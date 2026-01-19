import TagModel from '../models/TagModel.js';
import { getPaginationParams, createPaginationMeta } from '../utils/pagination.js';

/**
 * Tag Service
 */
class TagService {
  /**
   * Get all tags
   */
  async getTags(query = {}) {
    const pagination = getPaginationParams(query);
    const filters = {};

    if (query.search) {
      filters.search = query.search;
    }

    const tags = await TagModel.findAll(filters, pagination);
    const total = await TagModel.count(filters);

    return {
      data: tags,
      pagination: createPaginationMeta(total, pagination.page, pagination.limit)
    };
  }

  /**
   * Get tag by ID
   */
  async getTagById(tagId) {
    const tag = await TagModel.findById(tagId);
    if (!tag) {
      throw new Error('Tag not found');
    }
    return tag;
  }

  /**
   * Create tag
   */
  async createTag(tagData) {
    // Check if name already exists
    const existing = await TagModel.findByName(tagData.name);
    if (existing) {
      throw new Error('Tag name already exists');
    }

    return TagModel.create(tagData);
  }

  /**
   * Update tag
   */
  async updateTag(tagId, updateData) {
    const tag = await TagModel.findById(tagId);
    if (!tag) {
      throw new Error('Tag not found');
    }

    // Check if new name conflicts
    if (updateData.name && updateData.name !== tag.name) {
      const existing = await TagModel.findByName(updateData.name);
      if (existing) {
        throw new Error('Tag name already exists');
      }
    }

    return TagModel.update(tagId, updateData);
  }

  /**
   * Delete tag
   */
  async deleteTag(tagId) {
    const tag = await TagModel.findById(tagId);
    if (!tag) {
      throw new Error('Tag not found');
    }

    const deleted = await TagModel.delete(tagId);
    if (!deleted) {
      throw new Error('Failed to delete tag');
    }

    return { success: true };
  }
}

export default new TagService();
