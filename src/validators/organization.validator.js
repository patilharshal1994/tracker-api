import { body, param, query } from 'express-validator';
import { validate } from './auth.validator.js';

export const createOrganizationValidation = validate([
  body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean')
]);

export const updateOrganizationValidation = validate([
  param('id')
    .isUUID()
    .withMessage('Invalid organization ID format'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean')
]);

export const getOrganizationValidation = validate([
  param('id')
    .isUUID()
    .withMessage('Invalid organization ID format')
]);

export const getOrganizationsValidation = validate([
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean')
]);
