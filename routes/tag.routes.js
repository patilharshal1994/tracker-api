import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
  getTagsValidation,
  getTagValidation,
  createTagValidation,
  updateTagValidation
} from '../controllers/tag.controller.js';
import { uuidParamValidation } from '../src/validators/common.validator.js';

const router = express.Router();

router.use(authenticate);

// Get all tags
router.get('/', getTagsValidation, getTags);

// Get tag by ID
router.get('/:id', getTagValidation, getTagById);

// Create tag
router.post('/', createTagValidation, createTag);

// Update tag
router.put('/:id', updateTagValidation, updateTag);

// Delete tag
router.delete('/:id', getTagValidation, deleteTag);

export default router;
