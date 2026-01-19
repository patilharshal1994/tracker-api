import express from 'express';
import {
  getOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  createOrganizationValidation,
  updateOrganizationValidation,
  getOrganizationValidation,
  getOrganizationsValidation
} from '../controllers/organization.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all organizations (Super Admin only)
router.get('/', getOrganizationsValidation, getOrganizations);

// Get organization by ID (Super Admin only)
router.get('/:id', getOrganizationValidation, getOrganizationById);

// Create organization (Super Admin only)
router.post('/', createOrganizationValidation, createOrganization);

// Update organization (Super Admin only)
router.put('/:id', updateOrganizationValidation, updateOrganization);

// Delete organization (Super Admin only)
router.delete('/:id', getOrganizationValidation, deleteOrganization);

export default router;
