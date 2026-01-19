import UserService from '../src/services/UserService.js';
import { createUserValidation, updateUserValidation, getUserValidation, getUsersValidation } from '../src/validators/user.validator.js';
import { body, param } from 'express-validator';
import { validate } from '../src/validators/auth.validator.js';

/**
 * Get all users with filtering and pagination
 */
export const getUsers = async (req, res, next) => {
  try {
    const result = await UserService.getUsers(req.user, req.query);
    // Frontend expects response.data to be array
    res.json(result.data || result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.user, req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.user, req.user.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user profile (for /users/:id/profile)
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.user, req.params.id);
    // Return profile fields only
    const profile = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      designation: user.designation,
      department: user.department,
      specialty: user.specialty,
      experience: user.experience,
      education: user.education,
      address: user.address,
      city: user.city,
      country: user.country,
      bio: user.bio
    };
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile (for /users/:id/profile)
 */
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await UserService.updateUser(req.user, req.params.id, req.body);
    res.json({
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new user
 */
export const createUser = async (req, res, next) => {
  try {
    const user = await UserService.createUser(req.user, req.body);
    res.status(201).json({ 
      message: 'User created successfully',
      data: user 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user
 */
export const updateUser = async (req, res, next) => {
  try {
    const user = await UserService.updateUser(req.user, req.params.id, req.body);
    res.json({ 
      message: 'User updated successfully',
      data: user 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 */
export const deleteUser = async (req, res, next) => {
  try {
    await UserService.deleteUser(req.user, req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset user password
 */
export const resetPassword = async (req, res, next) => {
  try {
    await UserService.resetUserPassword(req.user, req.params.id, req.body.newPassword);
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};

// Export validators for routes
export const resetPasswordValidation = validate([
  param('id')
    .isUUID()
    .withMessage('Invalid user ID format'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
]);

export {
  createUserValidation,
  updateUserValidation,
  getUserValidation,
  getUsersValidation
};
