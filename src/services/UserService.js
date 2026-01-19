import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel.js';
import TeamModel from '../models/TeamModel.js';
import OrganizationModel from '../models/OrganizationModel.js';
import { getPaginationParams, createPaginationMeta } from '../utils/pagination.js';
import { ROLES, canCreateRole, canResetPassword } from '../utils/roleHierarchy.js';

/**
 * User Service - Business logic for user operations
 */
class UserService {
  /**
   * Get all users with filtering and pagination
   */
  async getUsers(currentUser, query = {}) {
    const pagination = getPaginationParams(query);
    const filters = {};

    // Apply filters
    if (query.role) filters.role = query.role;
    if (query.organization_id) filters.organization_id = query.organization_id;
    if (query.team_id) filters.team_id = query.team_id;
    if (query.is_active !== undefined) filters.is_active = query.is_active === 'true';
    if (query.search) filters.search = query.search;

    // Get users with role-based filtering
    const users = await UserModel.findWithRoleFilter(currentUser, filters, pagination);
    const total = await UserModel.countWithRoleFilter(currentUser, filters);

    return {
      data: UserModel.sanitizeMany(users),
      pagination: createPaginationMeta(total, pagination.page, pagination.limit)
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(currentUser, userId) {
    const user = await UserModel.findByIdWithDetails(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Check access permissions
    if (currentUser.role === 'ORG_ADMIN' && user.organization_id !== currentUser.organization_id) {
      throw new Error('Access denied');
    }
    if (currentUser.role === 'TEAM_LEAD' && user.team_id !== currentUser.team_id) {
      throw new Error('Access denied');
    }

    return UserModel.sanitize(user);
  }

  /**
   * Create a new user
   */
  async createUser(currentUser, userData) {
    // Check permissions
    if (!canCreateRole(currentUser, userData.role)) {
      throw new Error('You do not have permission to create users with this role');
    }

    // Validate organization_id
    if (currentUser.role === 'ORG_ADMIN') {
      userData.organization_id = currentUser.organization_id;
    } else if (currentUser.role === 'TEAM_LEAD' && userData.role === 'USER') {
      userData.organization_id = currentUser.organization_id;
      userData.team_id = currentUser.team_id;
    }

    // Check if email already exists
    const existingUser = await UserModel.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Hash password
    const saltRounds = 10;
    userData.password_hash = await bcrypt.hash(userData.password, saltRounds);
    delete userData.password;

    // Validate organization exists (if provided)
    if (userData.organization_id && currentUser.role === 'SUPER_ADMIN') {
      const org = await OrganizationModel.findById(userData.organization_id);
      if (!org) {
        throw new Error('Organization not found');
      }
    }

    // Validate team exists (if provided)
    if (userData.team_id) {
      const team = await TeamModel.findById(userData.team_id);
      if (!team) {
        throw new Error('Team not found');
      }
    }

    const user = await UserModel.create(userData);
    return UserModel.sanitize(user);
  }

  /**
   * Update user
   */
  async updateUser(currentUser, userId, updateData) {
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Check access permissions
    if (currentUser.role === 'ORG_ADMIN' && existingUser.organization_id !== currentUser.organization_id) {
      throw new Error('Access denied');
    }
    if (currentUser.role === 'TEAM_LEAD' && existingUser.team_id !== currentUser.team_id) {
      throw new Error('Access denied');
    }

    // Only Super Admin can change roles
    if (updateData.role && currentUser.role !== 'SUPER_ADMIN') {
      if (!canCreateRole(currentUser, updateData.role)) {
        throw new Error('You do not have permission to assign this role');
      }
    }

    // Check if email is being changed and if it's already taken
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await UserModel.findByEmail(updateData.email);
      if (emailExists) {
        throw new Error('Email already exists');
      }
    }

    // Update password if provided
    if (updateData.password) {
      const saltRounds = 10;
      updateData.password_hash = await bcrypt.hash(updateData.password, saltRounds);
      delete updateData.password;
    }

    // Enforce organization for Org Admin
    if (currentUser.role === 'ORG_ADMIN') {
      updateData.organization_id = currentUser.organization_id;
    }

    const updatedUser = await UserModel.update(userId, updateData);
    return UserModel.sanitize(updatedUser);
  }

  /**
   * Delete user
   */
  async deleteUser(currentUser, userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Only Super Admin and Org Admin can delete users
    if (currentUser.role !== 'SUPER_ADMIN' && currentUser.role !== 'ORG_ADMIN') {
      throw new Error('Access denied');
    }

    // Org Admin can only delete users in their organization
    if (currentUser.role === 'ORG_ADMIN' && user.organization_id !== currentUser.organization_id) {
      throw new Error('Access denied');
    }

    const deleted = await UserModel.delete(userId);
    if (!deleted) {
      throw new Error('Failed to delete user');
    }

    return { success: true };
  }

  /**
   * Reset user password
   */
  async resetPassword(currentUser, userId, newPassword) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check permissions
    if (!canResetPassword(currentUser, user)) {
      throw new Error('You do not have permission to reset this user\'s password');
    }

    // Hash new password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);

    await UserModel.update(userId, { password_hash });
    return { success: true };
  }
}

export default new UserService();
