import express from 'express';
import { body } from 'express-validator';
import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket
} from '../controllers/ticket.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all tickets (with filters)
router.get('/', getTickets);

// Get ticket by ID
router.get('/:id', getTicketById);

// Create ticket
router.post(
  '/',
  [
    body('project_id').isInt(),
    body('type').isIn(['TASK', 'BUG', 'ISSUE', 'SUGGESTION']).optional(),
    body('title').trim().notEmpty().isLength({ min: 3, max: 500 }),
    body('description').trim().optional(),
    body('assignee_id').isInt().optional({ nullable: true }),
    body('priority').isIn(['LOW', 'MEDIUM', 'HIGH']).optional(),
    body('due_date').isISO8601().optional({ nullable: true }),
    body('duration_hours').isInt().optional({ nullable: true })
  ],
  validate,
  createTicket
);

// Update ticket
router.put(
  '/:id',
  [
    body('title').trim().isLength({ min: 3, max: 500 }).optional(),
    body('description').trim().optional(),
    body('status').isIn(['CREATED', 'IN_PROGRESS', 'DEPENDENCY', 'HOLD', 'SOLVED', 'CLOSED']).optional(),
    body('priority').isIn(['LOW', 'MEDIUM', 'HIGH']).optional(),
    body('assignee_id').isInt().optional({ nullable: true }),
    body('due_date').isISO8601().optional({ nullable: true })
  ],
  validate,
  updateTicket
);

// Delete ticket
router.delete('/:id', deleteTicket);

export default router;
