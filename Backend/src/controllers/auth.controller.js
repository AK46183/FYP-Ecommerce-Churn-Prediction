const { registerValidation, loginValidation } = require('../validators/auth.validator');
const { registerUser, loginUser } = require('../services/auth.service');
const ApiResponse = require('../utils/ApiResponse');

const register = async (req, res, next) => {
  try {
    const errors = registerValidation(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const user = await registerUser(req.body);
    res.status(201).json(new ApiResponse(201, user, 'User registered successfully'));
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = loginValidation(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const result = await loginUser(req.body);
    res.status(200).json(new ApiResponse(200, result, 'Login successful'));
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
