import { body, param, query } from 'express-validator';
import { validate } from './auth.validator.js';

/**
 * Create user validation
 */
export const createUserValidation = validate([
  body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .isIn(['SUPER_ADMIN', 'ORG_ADMIN', 'TEAM_LEAD', 'USER'])
    .withMessage('Invalid role'),
  body('organization_id')
    .optional()
    .isUUID()
    .withMessage('Invalid organization ID format'),
  body('team_id')
    .optional()
    .isUUID()
    .withMessage('Invalid team ID format'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Invalid phone number format'),
  body('designation')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Designation must be less than 255 characters'),
  body('department')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Department must be less than 255 characters'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean')
]);

/**
 * Update user validation
 */
export const updateUserValidation = validate([
  param('id')
    .isUUID()
    .withMessage('Invalid user ID format'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('role')
    .optional()
    .isIn(['SUPER_ADMIN', 'ORG_ADMIN', 'TEAM_LEAD', 'USER'])
    .withMessage('Invalid role'),
  body('organization_id')
    .optional()
    .isUUID()
    .withMessage('Invalid organization ID format'),
  body('team_id')
    .optional()
    .isUUID()
    .withMessage('Invalid team ID format'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Invalid phone number format'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean')
]);

/**
 * Get user by ID validation
 */
export const getUserValidation = validate([
  param('id')
    .isUUID()
    .withMessage('Invalid user ID format')
]);

/**
 * Get users query validation
 */
export const getUsersValidation = validate([
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('role')
    .optional()
    .isIn(['SUPER_ADMIN', 'ORG_ADMIN', 'TEAM_LEAD', 'USER'])
    .withMessage('Invalid role'),
  query('organization_id')
    .optional()
    .isUUID()
    .withMessage('Invalid organization ID format'),
  query('team_id')
    .optional()
    .isUUID()
    .withMessage('Invalid team ID format'),
  query('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean')
]);

/**
 * Reset password validation
 */
export const resetPasswordValidation = validate([
  param('id')
    .isUUID()
    .withMessage('Invalid user ID format'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
]);
