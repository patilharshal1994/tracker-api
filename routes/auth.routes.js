import express from 'express';
import {
  login,
  register,
  refreshToken,
  logout,
  registerValidation,
  loginValidation,
  refreshTokenValidation,
  logoutValidation
} from '../controllers/auth.controller.js';

const router = express.Router();

// Register
router.post('/register', registerValidation, register);

// Login
router.post('/login', loginValidation, login);

// Refresh token
router.post('/refresh', refreshTokenValidation, refreshToken);

// Logout
router.post('/logout', logoutValidation, logout);

export default router;
