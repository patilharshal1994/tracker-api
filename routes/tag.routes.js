import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';
import {
  getTags,
  createTag,
  updateTag,
  deleteTag,
  getTicketTags,
  addTagToTicket,
  removeTagFromTicket
} from '../controllers/tag.controller.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getTags);
router.post('/', requireAdmin, createTag);
router.put('/:id', requireAdmin, updateTag);
router.delete('/:id', requireAdmin, deleteTag);

router.get('/tickets/:ticketId', getTicketTags);
router.post('/tickets/:ticketId', addTagToTicket);
router.delete('/tickets/:ticketId/:tagId', removeTagFromTicket);

export default router;
