import ProjectModel from '../models/ProjectModel.js';
import TeamModel from '../models/TeamModel.js';
import OrganizationModel from '../models/OrganizationModel.js';
import UserModel from '../models/UserModel.js';
import ProjectMemberModel from '../models/ProjectMemberModel.js';
import { getPaginationParams, createPaginationMeta } from '../utils/pagination.js';
import { ROLES } from '../utils/roleHierarchy.js';

/**
 * Project Service
 */
class ProjectService {
  /**
   * Get all projects with filtering
   */
  async getProjects(currentUser, query = {}) {
    const pagination = getPaginationParams(query);
    const filters = {};

    if (query.organization_id) filters.organization_id = query.organization_id;
    if (query.team_id) filters.team_id = query.team_id;
    if (query.is_active !== undefined) filters.is_active = query.is_active === 'true';
    if (query.search) filters.search = query.search;

    const projects = await ProjectModel.findWithFilters(currentUser, filters, pagination);
    const total = await ProjectModel.count(filters);

    // Frontend expects array directly
    return projects;
  }

  /**
   * Get project by ID with details
   */
  async getProjectById(currentUser, projectId) {
    const project = await ProjectModel.findByIdWithDetails(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    // Check access permissions
    if (currentUser.role === 'ORG_ADMIN' && project.organization_id !== currentUser.organization_id) {
      throw new Error('Access denied');
    }

    return project;
  }

  /**
   * Create project
   */
  async createProject(currentUser, projectData) {
    // Validate team if provided
    if (projectData.team_id) {
      const team = await TeamModel.findById(projectData.team_id);
      if (!team) {
        throw new Error('Team not found');
      }
      // Set organization_id from team
      projectData.organization_id = team.organization_id;
    }

    // Set organization_id for Org Admin
    if (currentUser.role === ROLES.ORG_ADMIN) {
      projectData.organization_id = currentUser.organization_id;
    }

    // Set created_by
    projectData.created_by = currentUser.id;

    const project = await ProjectModel.create(projectData);

    // Add creator as project member
    await ProjectMemberModel.create({
      project_id: project.id,
      user_id: currentUser.id
    });

    return project;
  }

  /**
   * Update project
   */
  async updateProject(currentUser, projectId, updateData) {
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    // Check access permissions
    if (currentUser.role === 'ORG_ADMIN' && project.organization_id !== currentUser.organization_id) {
      throw new Error('Access denied');
    }
    if (currentUser.role === 'TEAM_LEAD' && project.team_id !== currentUser.team_id) {
      throw new Error('Access denied');
    }
    if (currentUser.role === 'USER' && project.created_by !== currentUser.id) {
      throw new Error('Access denied');
    }

    // Org Admin cannot change organization
    if (currentUser.role === ROLES.ORG_ADMIN && updateData.organization_id) {
      delete updateData.organization_id;
    }

    return ProjectModel.update(projectId, updateData);
  }

  /**
   * Delete project
   */
  async deleteProject(currentUser, projectId) {
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    // Only Super Admin, Org Admin, or creator can delete
    if (currentUser.role !== ROLES.SUPER_ADMIN && 
        currentUser.role !== ROLES.ORG_ADMIN && 
        project.created_by !== currentUser.id) {
      throw new Error('Access denied');
    }

    // Org Admin can only delete projects in their organization
    if (currentUser.role === ROLES.ORG_ADMIN && project.organization_id !== currentUser.organization_id) {
      throw new Error('Access denied');
    }

    const deleted = await ProjectModel.delete(projectId);
    if (!deleted) {
      throw new Error('Failed to delete project');
    }

    return { success: true };
  }

  /**
   * Add member to project
   */
  async addMember(currentUser, projectId, userId) {
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    // Check access
    if (currentUser.role !== ROLES.SUPER_ADMIN && 
        currentUser.role !== ROLES.ORG_ADMIN && 
        project.created_by !== currentUser.id) {
      throw new Error('Access denied');
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if already a member
    const exists = await ProjectMemberModel.findOne({ project_id: projectId, user_id: userId });
    if (exists) {
      throw new Error('User is already a project member');
    }

    return ProjectMemberModel.create({
      project_id: projectId,
      user_id: userId
    });
  }

  /**
   * Remove member from project
   */
  async removeMember(currentUser, projectId, userId) {
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    // Check access
    if (currentUser.role !== ROLES.SUPER_ADMIN && 
        currentUser.role !== ROLES.ORG_ADMIN && 
        project.created_by !== currentUser.id) {
      throw new Error('Access denied');
    }

    const deleted = await ProjectMemberModel.deleteByProjectAndUser(projectId, userId);
    if (!deleted) {
      throw new Error('Member not found in project');
    }

    return { success: true };
  }
}

export default new ProjectService();
