import { body, param, query } from 'express-validator';
import { validate } from './auth.validator.js';

export const createTemplateValidation = validate([
  body('name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be between 1 and 255 characters'),
  body('type')
    .optional()
    .isIn(['TASK', 'BUG', 'ISSUE', 'SUGGESTION'])
    .withMessage('Invalid ticket type'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .withMessage('Invalid priority'),
  body('default_title')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Title template must be less than 500 characters'),
  body('default_description')
    .optional()
    .trim(),
  body('default_module')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Module must be less than 255 characters'),
  body('is_shared')
    .optional()
    .isBoolean()
    .withMessage('is_shared must be a boolean')
]);

export const updateTemplateValidation = validate([
  param('id')
    .isUUID()
    .withMessage('Invalid template ID format'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be between 1 and 255 characters'),
  body('type')
    .optional()
    .isIn(['TASK', 'BUG', 'ISSUE', 'SUGGESTION'])
    .withMessage('Invalid ticket type'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .withMessage('Invalid priority'),
  body('is_shared')
    .optional()
    .isBoolean()
    .withMessage('is_shared must be a boolean')
]);

export const getTemplateValidation = validate([
  param('id')
    .isUUID()
    .withMessage('Invalid template ID format')
]);

export const getTemplatesValidation = validate([
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
]);
