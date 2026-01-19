import express from 'express';
import { body } from 'express-validator';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getCurrentUser
} from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get current user profile
router.get('/me', getCurrentUser);

// Get all users (admin only)
router.get('/', authorize('ADMIN'), getUsers);

// Get user by ID
router.get('/:id', getUserById);

// Create user (admin only)
router.post(
  '/',
  authorize('ADMIN'),
  [
    body('name').trim().notEmpty().isLength({ min: 2, max: 255 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).optional(),
    body('role').isIn(['ADMIN', 'USER']).optional()
  ],
  validate,
  createUser
);

// Update user
router.put(
  '/:id',
  [
    body('name').trim().isLength({ min: 2, max: 255 }).optional(),
    body('email').isEmail().normalizeEmail().optional(),
    body('role').isIn(['ADMIN', 'USER']).optional(),
    body('team_id').isInt().optional({ nullable: true }),
    body('is_active').isBoolean().optional()
  ],
  validate,
  updateUser
);

// Delete user (admin only)
router.delete('/:id', authorize('ADMIN'), deleteUser);

export default router;
