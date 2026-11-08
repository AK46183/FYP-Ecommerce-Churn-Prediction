const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/postgres/user.model');
const ApiError = require('../utils/ApiError');
const { logActivity } = require('./activityLogger.service');
const { sendWelcome, sendPasswordReset } = require('./mail.service');
const { notifyAdmin } = require('./notification.service');

const notifyNewCustomer = (user, via) =>
  notifyAdmin({
    type: 'customer',
    title: `New customer: ${user.name}`,
    body: `${user.name} (${user.email}) created an account${via ? ` with ${via}` : ''}.`,
    link: '/admin/customers',
    meta: { userId: user.id },
  });

const RESET_MINUTES = 30;

const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  phone: u.phone || '',
  city: u.city || '',
});

const issueToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const normalizeEmail = (email = '') => String(email).trim().toLowerCase();

const registerUser = async ({ name, email, password }) => {
  const cleanEmail = normalizeEmail(email);
  const existingUser = await User.findOne({ where: { email: cleanEmail } });
  if (existingUser) throw new ApiError(400, 'Email already registered');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name: String(name).trim(), email: cleanEmail, password: hashedPassword });

  sendWelcome(user); // email ka intezar nahi
  notifyNewCustomer(user);
  return { id: user.id, name: user.name, email: user.email };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email: normalizeEmail(email) } });
  if (!user) throw new ApiError(401, 'Invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, 'Invalid email or password');

  logActivity(user.id, 'login');
  return { token: issueToken(user), user: publicUser(user) };
};

/* ------------------------------ Profile ------------------------------ */

const getMe = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new ApiError(404, 'User not found');
  return publicUser(user);
};

const updateMe = async (userId, { name, phone, city }) => {
  const user = await User.findByPk(userId);
  if (!user) throw new ApiError(404, 'User not found');
  if (name !== undefined) {
    if (!String(name).trim()) throw new ApiError(400, 'Name cannot be empty');
    user.name = String(name).trim();
  }
  if (phone !== undefined) {
    const p = String(phone).replace(/[\s-]/g, '');
    if (p && !/^(\+92|0)3\d{9}$/.test(p)) throw new ApiError(400, 'Enter a valid mobile number, e.g. 03001234567');
    user.phone = p || null;
  }
  if (city !== undefined) user.city = String(city).trim() || null;
  await user.save();
  return publicUser(user);
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  if (!newPassword || newPassword.length < 6) throw new ApiError(400, 'New password must be at least 6 characters');
  const user = await User.findByPk(userId);
  if (!user) throw new ApiError(404, 'User not found');
  const ok = await bcrypt.compare(currentPassword || '', user.password);
  if (!ok) throw new ApiError(400, 'Current password is incorrect');
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  return true;
};

/* -------------------------- Forgot / reset --------------------------- */

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

// Hamesha same jawab — taake koi pata na laga sake ke email registered hai ya nahi
const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ where: { email: normalizeEmail(email) } });
  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    user.resetTokenHash = hashToken(token);
    user.resetTokenExpires = new Date(Date.now() + RESET_MINUTES * 60 * 1000);
    await user.save();
    await sendPasswordReset(user, token);
  }
  return true;
};

const resetPassword = async ({ token, password }) => {
  if (!token) throw new ApiError(400, 'Reset link is invalid');
  if (!password || password.length < 6) throw new ApiError(400, 'Password must be at least 6 characters');

  const user = await User.findOne({ where: { resetTokenHash: hashToken(String(token)) } });
  if (!user || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
    throw new ApiError(400, 'This reset link is invalid or has expired. Please request a new one.');
  }
  user.password = await bcrypt.hash(password, 10);
  user.resetTokenHash = null;
  user.resetTokenExpires = null;
  await user.save();
  return true;
};

/* ------------------------------ Google ------------------------------- */

/**
 * Frontend Google popup se access token bhejta hai.
 * Backend Google se check karta hai ke token sach mein HAMARI app ka hai (aud),
 * phir user ki email le kar login / signup karta hai.
 */
const googleLogin = async ({ accessToken }) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) throw new ApiError(500, 'Google Sign-In is not configured on the server (GOOGLE_CLIENT_ID)');
  if (!accessToken) throw new ApiError(400, 'Google token missing');

  let info;
  try {
    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accessToken)}`);
    info = await res.json();
    if (!res.ok) throw new Error(info.error_description || 'invalid token');
  } catch (error) {
    throw new ApiError(401, `Google sign-in failed: ${error.message}`);
  }
  if (info.aud !== clientId && info.azp !== clientId) throw new ApiError(401, 'Google token was not issued for this app');

  let profile;
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    profile = await res.json();
    if (!res.ok) throw new Error('profile not available');
  } catch (error) {
    throw new ApiError(401, `Google sign-in failed: ${error.message}`);
  }
  if (!profile.email || profile.email_verified === false) throw new ApiError(401, 'Google account email is not verified');

  const email = normalizeEmail(profile.email);
  let user = await User.findOne({ where: { email } });
  let isNew = false;
  if (!user) {
    // Google users ka random password (woh hamesha Google se hi login karenge, ya "Forgot password" se set kar lein)
    user = await User.create({
      name: profile.name || email.split('@')[0],
      email,
      password: await bcrypt.hash(crypto.randomBytes(24).toString('hex'), 10),
      googleId: profile.sub,
    });
    isNew = true;
    sendWelcome(user);
    notifyNewCustomer(user, 'Google');
  } else if (!user.googleId) {
    user.googleId = profile.sub;
    await user.save();
  }

  logActivity(user.id, 'login');
  return { token: issueToken(user), user: publicUser(user), isNew };
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  changePassword,
  forgotPassword,
  resetPassword,
  googleLogin,
  publicUser,
  hashToken,
};
