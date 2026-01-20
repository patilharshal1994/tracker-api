import OrganizationService from '../src/services/OrganizationService.js';
import {
  createOrganizationValidation,
  updateOrganizationValidation,
  getOrganizationValidation,
  getOrganizationsValidation
} from '../src/validators/organization.validator.js';

export const getOrganizations = async (req, res, next) => {
  try {
    const result = await OrganizationService.getOrganizations(req.user, req.query);
    // Return consistent format: { data: [...], pagination: {...} }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getOrganizationById = async (req, res, next) => {
  try {
    const organization = await OrganizationService.getOrganizationById(req.user, req.params.id);
    res.json({ data: organization });
  } catch (error) {
    next(error);
  }
};

export const createOrganization = async (req, res, next) => {
  try {
    const organization = await OrganizationService.createOrganization(req.user, req.body);
    res.status(201).json({
      message: 'Organization created successfully',
      data: organization
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrganization = async (req, res, next) => {
  try {
    const organization = await OrganizationService.updateOrganization(req.user, req.params.id, req.body);
    res.json({
      message: 'Organization updated successfully',
      data: organization
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrganization = async (req, res, next) => {
  try {
    await OrganizationService.deleteOrganization(req.user, req.params.id);
    res.json({ message: 'Organization deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export {
  createOrganizationValidation,
  updateOrganizationValidation,
  getOrganizationValidation,
  getOrganizationsValidation
};
