import UserService from '../src/services/UserService.js';
import { createUserValidation, updateUserValidation, getUserValidation, getUsersValidation, resetPasswordValidation } from '../src/validators/user.validator.js';

/**
 * Get all users with filtering and pagination
 */
export const getUsers = async (req, res, next) => {
  try {
    const users = await UserService.getUsers(req.user, req.query);
    res.json(users);
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
    res.json({ data: user });
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
    await UserService.resetPassword(req.user, req.params.id, req.body.password);
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};

// Export validators for routes
export {
  createUserValidation,
  updateUserValidation,
  getUserValidation,
  getUsersValidation,
  resetPasswordValidation
};
