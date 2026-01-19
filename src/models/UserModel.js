import { BaseModel } from './BaseModel.js';
import pool from '../../config/database.js';

/**
 * User Model
 */
export class UserModel extends BaseModel {
  constructor() {
    super('users');
  }

  /**
   * Find user by email
   */
  async findByEmail(email) {
    return this.findOne({ email });
  }

  /**
   * Get users with role-based filtering
   */
  async findWithRoleFilter(user, filters = {}, pagination = {}) {
    let query = `
      SELECT 
        u.*,
        o.name as organization_name,
        t.name as team_name
      FROM users u
      LEFT JOIN organizations o ON u.organization_id = o.id
      LEFT JOIN teams t ON u.team_id = t.id
    `;
    const params = [];
    const conditions = [];

    // Apply role-based filtering
    if (user.role === 'ORG_ADMIN' && user.organization_id) {
      conditions.push('u.organization_id = ?');
      params.push(user.organization_id);
    } else if (user.role === 'TEAM_LEAD' && user.team_id) {
      conditions.push('u.team_id = ?');
      params.push(user.team_id);
    }

    // Apply additional filters
    if (filters.role) {
      conditions.push('u.role = ?');
      params.push(filters.role);
    }
    if (filters.organization_id) {
      conditions.push('u.organization_id = ?');
      params.push(filters.organization_id);
    }
    if (filters.team_id) {
      conditions.push('u.team_id = ?');
      params.push(filters.team_id);
    }
    if (filters.is_active !== undefined) {
      conditions.push('u.is_active = ?');
      params.push(filters.is_active);
    }
    if (filters.search) {
      conditions.push('(u.name LIKE ? OR u.email LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY u.created_at DESC`;

    // Apply pagination
    if (pagination.limit) {
      const offset = pagination.offset || 0;
      query += ` LIMIT ? OFFSET ?`;
      params.push(pagination.limit, offset);
    }

    const [rows] = await pool.query(query, params);
    return rows;
  }

  /**
   * Get user with related data
   */
  async findByIdWithDetails(id) {
    const query = `
      SELECT 
        u.*,
        o.name as organization_name,
        o.id as organization_id,
        t.name as team_name,
        t.id as team_id
      FROM users u
      LEFT JOIN organizations o ON u.organization_id = o.id
      LEFT JOIN teams t ON u.team_id = t.id
      WHERE u.id = ?
    `;
    const [rows] = await pool.query(query, [id]);
    return rows[0] || null;
  }

  /**
   * Count users with role-based filtering
   */
  async countWithRoleFilter(user, filters = {}) {
    let query = `SELECT COUNT(*) as total FROM users u`;
    const params = [];
    const conditions = [];

    // Apply role-based filtering
    if (user.role === 'ORG_ADMIN' && user.organization_id) {
      conditions.push('u.organization_id = ?');
      params.push(user.organization_id);
    } else if (user.role === 'TEAM_LEAD' && user.team_id) {
      conditions.push('u.team_id = ?');
      params.push(user.team_id);
    }

    // Apply additional filters
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== null) {
        conditions.push(`u.${key} = ?`);
        params.push(filters[key]);
      }
    });

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total;
  }

  /**
   * Remove password from user object
   */
  sanitize(user) {
    if (!user) return null;
    const { password_hash, ...sanitized } = user;
    return sanitized;
  }

  /**
   * Remove password from array of users
   */
  sanitizeMany(users) {
    return users.map(user => this.sanitize(user));
  }
}

export default new UserModel();
