const jwt = require('jsonwebtoken');
const User = require('../models/postgres/user.model');

/**
 * Token check + database check.
 * - Token sahi aur expire na ho
 * - User abhi bhi database mein ho (delete ho gaya to token bekaar)
 * - Token ka version user ke tokenVersion se mile (password badla / reset hua to purane tokens band)
 * - Role hamesha database se (admin hata diya gaya to foran admin access khatam)
 * Returns { id, role } ya null.
 */
const verifyRequestToken = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  let decoded;
  try {
    decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
  } catch {
    return null;
  }
  if (!decoded || !decoded.id) return null;
  const user = await User.findByPk(decoded.id, { attributes: ['id', 'role', 'tokenVersion'] });
  if (!user) return null;
  // purane tokens (is feature se pehle wale) mein tv nahi hota: unhein version 0 maante hain
  if ((decoded.tv || 0) !== (user.tokenVersion || 0)) return null;
  return { id: user.id, role: user.role };
};

const authMiddleware = async (req, res, next) => {
  try {
    const user = await verifyRequestToken(req);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    req.user = user;
    return next();
  } catch (error) {
    return next(error); // database ki galti = 500, 401 nahi
  }
};

// Token ho to user set karo, na ho (ya ghalat ho) to bhi aage jane do (guest product dekh sake)
const optionalAuth = async (req, res, next) => {
  try {
    const user = await verifyRequestToken(req);
    if (user) req.user = user;
  } catch {
    // database na mile to guest hi samjho
  }
  next();
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access only' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware, optionalAuth, verifyRequestToken };
