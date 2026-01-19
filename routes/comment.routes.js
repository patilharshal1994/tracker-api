import express from 'express';
import {
  getComments,
  updateComment,
  deleteComment,
  updateCommentValidation,
  deleteCommentValidation,
  getCommentsValidation
} from '../controllers/comment.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get comments for a ticket
router.get('/ticket/:ticketId', getCommentsValidation, getComments);

// Update comment
router.put('/:id', updateCommentValidation, updateComment);

// Delete comment
router.delete('/:id', deleteCommentValidation, deleteComment);

export default router;
