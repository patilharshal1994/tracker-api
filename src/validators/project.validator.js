import { body, param, query } from 'express-validator';
import { validate } from './auth.validator.js';

export const createProjectValidation = validate([
  body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  body('description')
    .optional()
    .trim(),
  body('team_id')
    .optional()
    .isUUID()
    .withMessage('Invalid team ID format'),
  body('organization_id')
    .optional()
    .isUUID()
    .withMessage('Invalid organization ID format'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean')
]);

export const updateProjectValidation = validate([
  param('id')
    .isUUID()
    .withMessage('Invalid project ID format'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  body('description')
    .optional()
    .trim(),
  body('team_id')
    .optional()
    .isUUID()
    .withMessage('Invalid team ID format'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean')
]);

export const getProjectValidation = validate([
  param('id')
    .isUUID()
    .withMessage('Invalid project ID format')
]);

export const getProjectsValidation = validate([
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
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
