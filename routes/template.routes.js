import express from 'express';
import {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getTemplatesValidation,
  getTemplateValidation,
  createTemplateValidation,
  updateTemplateValidation
} from '../controllers/template.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all templates
router.get('/', getTemplatesValidation, getTemplates);

// Get template by ID
router.get('/:id', getTemplateValidation, getTemplateById);

// Create template
router.post('/', createTemplateValidation, createTemplate);

// Update template
router.put('/:id', updateTemplateValidation, updateTemplate);

// Delete template
router.delete('/:id', getTemplateValidation, deleteTemplate);

export default router;
