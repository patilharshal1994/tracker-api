import ActivityService from '../src/services/ActivityService.js';
import { uuidParamValidation } from '../src/validators/common.validator.js';
import { validate } from '../src/validators/auth.validator.js';
import { param, query } from 'express-validator';

export const getTicketActivities = async (req, res, next) => {
  try {
    const result = await ActivityService.getTicketActivities(req.params.ticketId, req.query);
    // Frontend expects response.data.data for array
    res.json({
      data: result.data || result
    });
  } catch (error) {
    next(error);
  }
};

export const getTicketActivitiesValidation = validate([
  param('ticketId')
    .notEmpty()
    .withMessage('Ticket ID is required')
    .isString()
    .withMessage('Ticket ID must be a string'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
]);
