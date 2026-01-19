import CommentModel from '../src/models/CommentModel.js';
import TicketModel from '../src/models/TicketModel.js';
import ActivityModel from '../src/models/ActivityModel.js';
import NotificationService from '../src/services/NotificationService.js';
import { uuidParamValidation } from '../src/validators/common.validator.js';
import { body, param } from 'express-validator';
import { validate } from '../src/validators/auth.validator.js';

/**
 * Get comments for a ticket
 */
export const getComments = async (req, res, next) => {
  try {
    // Verify ticket exists and user has access
    const ticket = await TicketModel.findById(req.params.ticketId);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const comments = await CommentModel.findByTicketId(req.params.ticketId);
    res.json({ data: comments });
  } catch (error) {
    next(error);
  }
};

/**
 * Update comment
 */
export const updateComment = async (req, res, next) => {
  try {
    const comment = await CommentModel.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check permissions - only comment author can update
    if (comment.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedComment = await CommentModel.update(req.params.id, {
      comment_text: req.body.comment_text
    });

    // Log activity
    await ActivityModel.logActivity(
      comment.ticket_id,
      req.user.id,
      'COMMENT_UPDATED',
      { comment_text: comment.comment_text },
      { comment_text: req.body.comment_text },
      'Comment updated'
    );

    const commentWithUser = await CommentModel.findByIdWithUser(req.params.id);
    res.json({
      message: 'Comment updated successfully',
      data: commentWithUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete comment
 */
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await CommentModel.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check permissions - only comment author or admin can delete
    if (comment.user_id !== req.user.id && 
        req.user.role !== 'SUPER_ADMIN' && 
        req.user.role !== 'ORG_ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Log activity
    await ActivityModel.logActivity(
      comment.ticket_id,
      req.user.id,
      'COMMENT_DELETED',
      { comment_id: comment.id },
      null,
      'Comment deleted'
    );

    await CommentModel.delete(req.params.id);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateCommentValidation = validate([
  param('id')
    .isUUID()
    .withMessage('Invalid comment ID format'),
  body('comment_text')
    .trim()
    .notEmpty()
    .withMessage('Comment text is required')
]);

export const deleteCommentValidation = validate([
  param('id')
    .isUUID()
    .withMessage('Invalid comment ID format')
]);

export const getCommentsValidation = validate([
  param('ticketId')
    .isUUID()
    .withMessage('Invalid ticket ID format')
]);
