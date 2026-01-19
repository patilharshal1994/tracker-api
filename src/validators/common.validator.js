import { param, query } from 'express-validator';
import { validate } from './auth.validator.js';

/**
 * UUID parameter validation
 */
export const uuidParamValidation = (paramName = 'id') => {
  return validate([
    param(paramName)
      .isUUID()
      .withMessage(`Invalid ${paramName} format`)
  ]);
};

/**
 * Pagination query validation
 */
export const paginationValidation = validate([
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
]);
