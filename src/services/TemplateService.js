import TemplateModel from '../models/TemplateModel.js';
import { getPaginationParams, createPaginationMeta } from '../utils/pagination.js';

/**
 * Template Service
 */
class TemplateService {
  /**
   * Get all templates for current user
   */
  async getTemplates(currentUser, query = {}) {
    const pagination = getPaginationParams(query);
    const templates = await TemplateModel.findByUserId(currentUser.id);

    // Apply pagination manually
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    const paginatedTemplates = templates.slice(start, end);

    return {
      data: paginatedTemplates,
      pagination: createPaginationMeta(templates.length, pagination.page, pagination.limit)
    };
  }

  /**
   * Get template by ID
   */
  async getTemplateById(currentUser, templateId) {
    const template = await TemplateModel.findById(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    // Check access
    if (template.created_by !== currentUser.id && !template.is_shared) {
      throw new Error('Access denied');
    }

    return template;
  }

  /**
   * Create template
   */
  async createTemplate(currentUser, templateData) {
    templateData.created_by = currentUser.id;
    return TemplateModel.create(templateData);
  }

  /**
   * Update template
   */
  async updateTemplate(currentUser, templateId, updateData) {
    const template = await TemplateModel.findById(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    // Only creator can update
    if (template.created_by !== currentUser.id) {
      throw new Error('Access denied');
    }

    return TemplateModel.update(templateId, updateData);
  }

  /**
   * Delete template
   */
  async deleteTemplate(currentUser, templateId) {
    const template = await TemplateModel.findById(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    // Only creator can delete
    if (template.created_by !== currentUser.id) {
      throw new Error('Access denied');
    }

    const deleted = await TemplateModel.delete(templateId);
    if (!deleted) {
      throw new Error('Failed to delete template');
    }

    return { success: true };
  }
}

export default new TemplateService();
