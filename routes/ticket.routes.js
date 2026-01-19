import express from 'express';
import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  addComment,
  addTag,
  removeTag,
  addWatcher,
  removeWatcher,
  addRelationship,
  logTime,
  createTicketValidation,
  updateTicketValidation,
  getTicketValidation,
  getTicketsValidation,
  addCommentValidation,
  addTagValidation,
  addWatcherValidation,
  addRelationshipValidation,
  logTimeValidation
} from '../controllers/ticket.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { uuidParamValidation } from '../src/validators/common.validator.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all tickets
router.get('/', getTicketsValidation, getTickets);

// Get ticket by ID
router.get('/:id', getTicketValidation, getTicketById);

// Create ticket
router.post('/', createTicketValidation, createTicket);

// Update ticket
router.put('/:id', updateTicketValidation, updateTicket);

// Delete ticket
router.delete('/:id', getTicketValidation, deleteTicket);

// Add comment to ticket
router.post('/:id/comments', addCommentValidation, addComment);

// Add tag to ticket
router.post('/:id/tags', addTagValidation, addTag);

// Remove tag from ticket
router.delete('/:id/tags/:tagId', getTicketValidation, uuidParamValidation('tagId'), removeTag);

// Add watcher to ticket
router.post('/:id/watchers', addWatcherValidation, addWatcher);

// Remove watcher from ticket
router.delete('/:id/watchers/:userId', getTicketValidation, uuidParamValidation('userId'), removeWatcher);

// Add relationship between tickets
router.post('/:id/relationships', addRelationshipValidation, addRelationship);

// Log time for ticket
router.post('/:id/time-logs', logTimeValidation, logTime);

export default router;
