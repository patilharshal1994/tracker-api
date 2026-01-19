import { body, param, query } from 'express-validator';
import { validate } from './auth.validator.js';

export const createTeamValidation = validate([
  body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  body('organization_id')
    .optional({ values: 'falsy' })
    .custom((value) => {
      if (!value || value === '') return true;
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(value)) {
        throw new Error('Invalid organization ID format');
      }
      return true;
    }),
  body('description')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters')
]);

export const updateTeamValidation = validate([
  param('id')
    .isUUID()
    .withMessage('Invalid team ID format'),
  body('name')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  body('organization_id')
    .optional({ values: 'falsy' })
    .custom((value) => {
      if (!value || value === '') return true;
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(value)) {
        throw new Error('Invalid organization ID format');
      }
      return true;
    }),
  body('description')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters')
]);

export const getTeamValidation = validate([
  param('id')
    .isUUID()
    .withMessage('Invalid team ID format')
]);

export const getTeamsValidation = validate([
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
    .withMessage('Invalid organization ID format')
]);
