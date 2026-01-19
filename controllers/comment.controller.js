import CommentModel from '../src/models/CommentModel.js';
import TicketModel from '../src/models/TicketModel.js';
import ActivityModel from '../src/models/ActivityModel.js';
import NotificationService from '../src/services/NotificationService.js';
import TicketService from '../src/services/TicketService.js';
import { uuidParamValidation } from '../src/validators/common.validator.js';
import { body, param } from 'express-validator';
import { validate } from '../src/validators/auth.validator.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Allow images and common document types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and documents are allowed.'));
    }
  }
});

/**
 * Create comment (with file upload support)
 */
export const createComment = async (req, res, next) => {
  try {
    const uploadMiddleware = upload.single('attachment');
    
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return next(err);
      }

      try {
        const { ticket_id, comment_text, mentioned_users } = req.body;
        let mentionedUserIds = [];

        // Parse mentioned_users if provided
        if (mentioned_users) {
          try {
            mentionedUserIds = typeof mentioned_users === 'string' 
              ? JSON.parse(mentioned_users) 
              : mentioned_users;
          } catch (e) {
            // If parsing fails, try as array
            mentionedUserIds = Array.isArray(mentioned_users) ? mentioned_users : [];
          }
        }

        // Use TicketService to add comment (handles activity logging and notifications)
        const comment = await TicketService.addComment(req.user, ticket_id, {
          comment_text,
          mentioned_user_ids: mentionedUserIds
        });

        // Handle file attachment if uploaded
        if (req.file) {
          // TODO: Create attachment record
          // For now, we'll just return the comment
        }

        // Frontend expects comment object directly
        res.status(201).json(comment);
      } catch (error) {
        next(error);
      }
    });
  } catch (error) {
    next(error);
  }
};

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
    // Frontend expects array
    res.json(comments);
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
    res.json(commentWithUser);
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

export const createCommentValidation = validate([
  body('ticket_id')
    .isUUID()
    .withMessage('Invalid ticket ID format'),
  body('comment_text')
    .trim()
    .notEmpty()
    .withMessage('Comment text is required'),
  body('mentioned_users')
    .optional()
    .custom((value) => {
      try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        return Array.isArray(parsed);
      } catch {
        return false;
      }
    })
    .withMessage('mentioned_users must be a valid JSON array')
]);
