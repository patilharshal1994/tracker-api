import AuthService from '../src/services/AuthService.js';
import { registerValidation, loginValidation } from '../src/validators/auth.validator.js';
import { body } from 'express-validator';
import { validate } from '../src/validators/auth.validator.js';

export const login = async (req, res, next) => {
  try {
    const result = await AuthService.login(req.body.email, req.body.password);
    res.json({
      message: 'Login successful',
      ...result
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const user = await AuthService.register(req.body);
    res.status(201).json({
      message: 'User registered successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const result = await AuthService.refreshToken(req.body.refreshToken);
    res.json({
      message: 'Token refreshed successfully',
      ...result
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await AuthService.logout(req.body.refreshToken);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export {
  registerValidation,
  loginValidation
};

export const refreshTokenValidation = validate([
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
]);

export const logoutValidation = validate([
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
]);
