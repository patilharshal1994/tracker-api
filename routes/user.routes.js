import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
  createUserValidation,
  updateUserValidation,
  getUserValidation,
  getUsersValidation,
  resetPasswordValidation
} from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all users with filtering and pagination
router.get('/', getUsersValidation, getUsers);

// Get user by ID
router.get('/:id', getUserValidation, getUserById);

// Create user
router.post('/', createUserValidation, createUser);

// Update user
router.put('/:id', updateUserValidation, updateUser);

// Delete user
router.delete('/:id', getUserValidation, deleteUser);

// Reset user password
router.post('/:id/reset-password', resetPasswordValidation, resetPassword);

export default router;
