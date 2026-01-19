import express from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import { login, register, refreshToken } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later'
});

// Validation rules
const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

const registerValidation = [
  body('name').trim().notEmpty().isLength({ min: 2, max: 255 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
];

router.post('/login', authLimiter, loginValidation, validate, login);
router.post('/register', registerValidation, validate, register);
router.post('/refresh', refreshToken);

export default router;
