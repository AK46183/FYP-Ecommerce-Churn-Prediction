const { registerValidation, loginValidation } = require('../validators/auth.validator');
const authService = require('../services/auth.service');
const ApiResponse = require('../utils/ApiResponse');

const handle = (fn, status = 200, message) => async (req, res, next) => {
  try {
    const data = await fn(req);
    res.status(status).json(new ApiResponse(status, data, message));
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const errors = registerValidation(req.body);
    if (errors.length) return res.status(400).json({ success: false, message: errors[0], errors });

    const user = await authService.registerUser(req.body);
    res.status(201).json(new ApiResponse(201, user, 'User registered successfully'));
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = loginValidation(req.body);
    if (errors.length) return res.status(400).json({ success: false, message: errors[0], errors });

    const result = await authService.loginUser(req.body);
    res.status(200).json(new ApiResponse(200, result, 'Login successful'));
  } catch (error) {
    next(error);
  }
};

const me = handle((req) => authService.getMe(req.user.id));
const updateMe = handle((req) => authService.updateMe(req.user.id, req.body || {}), 200, 'Profile updated');
const changePassword = handle((req) => authService.changePassword(req.user.id, req.body || {}), 200, 'Password changed');
const forgotPassword = handle(
  (req) => authService.forgotPassword(req.body || {}),
  200,
  'If an account exists for this email, a reset link has been sent'
);
const resetPassword = handle((req) => authService.resetPassword(req.body || {}), 200, 'Password has been reset');
const google = handle((req) => authService.googleLogin(req.body || {}), 200, 'Login successful');

module.exports = { register, login, me, updateMe, changePassword, forgotPassword, resetPassword, google };
