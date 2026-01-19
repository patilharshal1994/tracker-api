import OrganizationModel from '../models/OrganizationModel.js';
import { getPaginationParams, createPaginationMeta } from '../utils/pagination.js';
import { ROLES } from '../utils/roleHierarchy.js';

/**
 * Organization Service
 */
class OrganizationService {
  /**
   * Get all organizations (Super Admin only)
   */
  async getOrganizations(currentUser, query = {}) {
    if (currentUser.role !== ROLES.SUPER_ADMIN) {
      throw new Error('Access denied. Super Admin only.');
    }

    const pagination = getPaginationParams(query);
    const filters = {};

    if (query.is_active !== undefined) {
      filters.is_active = query.is_active === 'true';
    }
    if (query.search) {
      // Search will be handled in findWithFilters if needed
    }

    const organizations = await OrganizationModel.findAll(filters, pagination);
    const total = await OrganizationModel.count(filters);

    return {
      data: organizations,
      pagination: createPaginationMeta(total, pagination.page, pagination.limit)
    };
  }

  /**
   * Get organization by ID
   */
  async getOrganizationById(currentUser, organizationId) {
    if (currentUser.role !== ROLES.SUPER_ADMIN) {
      throw new Error('Access denied. Super Admin only.');
    }

    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) {
      throw new Error('Organization not found');
    }

    return organization;
  }

  /**
   * Create organization (Super Admin only)
   */
  async createOrganization(currentUser, organizationData) {
    if (currentUser.role !== ROLES.SUPER_ADMIN) {
      throw new Error('Access denied. Super Admin only.');
    }

    // Check if name already exists
    const existing = await OrganizationModel.findByName(organizationData.name);
    if (existing) {
      throw new Error('Organization name already exists');
    }

    return OrganizationModel.create(organizationData);
  }

  /**
   * Update organization (Super Admin only)
   */
  async updateOrganization(currentUser, organizationId, updateData) {
    if (currentUser.role !== ROLES.SUPER_ADMIN) {
      throw new Error('Access denied. Super Admin only.');
    }

    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) {
      throw new Error('Organization not found');
    }

    // Check if new name conflicts
    if (updateData.name && updateData.name !== organization.name) {
      const existing = await OrganizationModel.findByName(updateData.name);
      if (existing) {
        throw new Error('Organization name already exists');
      }
    }

    return OrganizationModel.update(organizationId, updateData);
  }

  /**
   * Delete organization (Super Admin only)
   */
  async deleteOrganization(currentUser, organizationId) {
    if (currentUser.role !== ROLES.SUPER_ADMIN) {
      throw new Error('Access denied. Super Admin only.');
    }

    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) {
      throw new Error('Organization not found');
    }

    const deleted = await OrganizationModel.delete(organizationId);
    if (!deleted) {
      throw new Error('Failed to delete organization');
    }

    return { success: true };
  }
}

export default new OrganizationService();
