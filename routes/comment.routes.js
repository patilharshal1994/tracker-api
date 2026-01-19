import express from 'express';
import { body } from 'express-validator';
import {
  getComments,
  createComment,
  updateComment,
  deleteComment
} from '../controllers/comment.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get comments for a ticket
router.get('/ticket/:ticketId', getComments);

// Create comment (with optional file upload)
router.post(
  '/',
  upload.single('attachment'),
  [body('ticket_id').isInt(), body('comment_text').trim().notEmpty()],
  validate,
  createComment
);

// Update comment
router.put(
  '/:id',
  [body('comment_text').trim().notEmpty()],
  validate,
  updateComment
);

// Delete comment
router.delete('/:id', deleteComment);

export default router;
