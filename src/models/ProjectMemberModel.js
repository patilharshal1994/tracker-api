import { BaseModel } from './BaseModel.js';
import pool from '../../config/database.js';

/**
 * Project Member Model
 */
export class ProjectMemberModel extends BaseModel {
  constructor() {
    super('project_members');
  }

  /**
   * Delete member by project and user
   */
  async deleteByProjectAndUser(projectId, userId) {
    const query = `DELETE FROM project_members WHERE project_id = ? AND user_id = ?`;
    const [result] = await pool.query(query, [projectId, userId]);
    return result.affectedRows > 0;
  }

  /**
   * Get members for a project
   */
  async findByProjectId(projectId) {
    const query = `
      SELECT 
        pm.*,
        u.name as user_name,
        u.email as user_email,
        u.role as user_role
      FROM project_members pm
      INNER JOIN users u ON pm.user_id = u.id
      WHERE pm.project_id = ?
      ORDER BY u.name
    `;
    const [rows] = await pool.query(query, [projectId]);
    return rows;
  }
}

export default new ProjectMemberModel();
