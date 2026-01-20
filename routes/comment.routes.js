import express from 'express';
import {
  getComments,
  createComment,
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

/**
 * @swagger
 * /api/comments/ticket/{ticketId}:
 *   get:
 *     summary: Get comments for a ticket
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */
router.get('/ticket/:ticketId', getCommentsValidation, getComments);

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Create comment (with optional file upload)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - ticket_id
 *               - comment_text
 *             properties:
 *               ticket_id:
 *                 type: string
 *                 format: uuid
 *               comment_text:
 *                 type: string
 *               mentioned_users:
 *                 type: string
 *                 description: JSON string array of user IDs
 *               attachment:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */
// Note: Validation happens inside createComment after multer processes multipart/form-data
router.post('/', createComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     summary: Update comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment_text
 *             properties:
 *               comment_text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *   delete:
 *     summary: Delete comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 */
router.put('/:id', updateCommentValidation, updateComment);
router.delete('/:id', deleteCommentValidation, deleteComment);

export default router;
