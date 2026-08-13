const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/postgres/user.model');
const ApiError = require('../utils/ApiError');

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new ApiError(400, 'Email already registered');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  return { id: user.id, name: user.name, email: user.email };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new ApiError(401, 'Invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, 'Invalid email or password');

  const token = jwt.sign(
  { id: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

module.exports = { registerUser, loginUser };