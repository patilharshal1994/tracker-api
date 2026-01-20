import { body, param, query } from 'express-validator';
import { validate } from './auth.validator.js';

export const createTicketValidation = validate([
  body('project_id')
    .isUUID()
    .withMessage('Invalid project ID format'),
  body('title')
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage('Title must be between 3 and 500 characters'),
  body('description')
    .optional()
    .trim(),
  body('type')
    .optional()
    .isIn(['TASK', 'BUG', 'ISSUE', 'SUGGESTION'])
    .withMessage('Invalid ticket type'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .withMessage('Invalid priority'),
  body('status')
    .optional()
    .isIn(['CREATED', 'IN_PROGRESS', 'DEPENDENCY', 'HOLD', 'SOLVED', 'CLOSED'])
    .withMessage('Invalid status'),
  body('module')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Module must be less than 255 characters'),
  body('assignee_id')
    .notEmpty()
    .withMessage('Assignee is required')
    .isUUID()
    .withMessage('Invalid assignee ID format'),
  body('due_date')
    .optional()
    .isISO8601()
    .withMessage('Invalid due date format'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .isUUID()
    .withMessage('Invalid tag ID format'),
  body('mentioned_users')
    .optional()
    .isArray()
    .withMessage('mentioned_users must be an array'),
  body('mentioned_users.*')
    .optional()
    .isUUID()
    .withMessage('Invalid user ID in mentioned_users')
]);

export const updateTicketValidation = validate([
  param('id')
    .isUUID()
    .withMessage('Invalid ticket ID format'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage('Title must be between 3 and 500 characters'),
  body('description')
    .optional()
    .trim(),
  body('type')
    .optional()
    .isIn(['TASK', 'BUG', 'ISSUE', 'SUGGESTION'])
    .withMessage('Invalid ticket type'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .withMessage('Invalid priority'),
  body('status')
    .optional()
    .isIn(['CREATED', 'IN_PROGRESS', 'DEPENDENCY', 'HOLD', 'SOLVED', 'CLOSED'])
    .withMessage('Invalid status'),
  body('module')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Module must be less than 255 characters'),
  body('assignee_id')
    .optional()
    .isUUID()
    .withMessage('Invalid assignee ID format'),
  body('due_date')
    .optional()
    .isISO8601()
    .withMessage('Invalid due date format')
]);

export const getTicketValidation = validate([
  param('id')
    .notEmpty()
    .withMessage('Ticket ID is required')
    .trim()
    // Allow any string format - UUID validation happens in service layer
    // This allows for encoded IDs or other formats that the frontend might use
]);

export const getTicketsValidation = validate([
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('project_id')
    .optional()
    .isUUID()
    .withMessage('Invalid project ID format'),
  query('status')
    .optional()
    .isIn(['CREATED', 'IN_PROGRESS', 'DEPENDENCY', 'HOLD', 'SOLVED', 'CLOSED'])
    .withMessage('Invalid status'),
  query('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .withMessage('Invalid priority'),
  query('type')
    .optional()
    .isIn(['TASK', 'BUG', 'ISSUE', 'SUGGESTION'])
    .withMessage('Invalid ticket type'),
  query('assignee_id')
    .optional()
    .isUUID()
    .withMessage('Invalid assignee ID format'),
  query('reporter_id')
    .optional()
    .isUUID()
    .withMessage('Invalid reporter ID format')
]);

export const addCommentValidation = validate([
  param('id')
    .isUUID()
    .withMessage('Invalid ticket ID format'),
  body('comment_text')
    .trim()
    .notEmpty()
    .withMessage('Comment text is required'),
  body('mentioned_user_ids')
    .optional()
    .isArray()
    .withMessage('mentioned_user_ids must be an array'),
  body('mentioned_user_ids.*')
    .optional()
    .isUUID()
    .withMessage('Invalid user ID in mentioned_user_ids')
]);

export const addTagValidation = validate([
  param('id')
    .isUUID()
    .withMessage('Invalid ticket ID format'),
  body('tag_id')
    .isUUID()
    .withMessage('Invalid tag ID format')
]);

export const addWatcherValidation = validate([
  param('id')
    .isUUID()
    .withMessage('Invalid ticket ID format'),
  body('user_id')
    .isUUID()
    .withMessage('Invalid user ID format')
]);

export const addRelationshipValidation = validate([
  param('id')
    .isUUID()
    .withMessage('Invalid ticket ID format'),
  body('related_ticket_id')
    .isUUID()
    .withMessage('Invalid related ticket ID format'),
  body('relationship_type')
    .isIn(['BLOCKS', 'BLOCKED_BY', 'DUPLICATE', 'RELATES_TO', 'PARENT', 'CHILD'])
    .withMessage('Invalid relationship type')
]);

export const logTimeValidation = validate([
  param('id')
    .isUUID()
    .withMessage('Invalid ticket ID format'),
  body('hours')
    .isFloat({ min: 0.01 })
    .withMessage('Hours must be a positive number'),
  body('description')
    .optional()
    .trim(),
  body('logged_date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
]);
