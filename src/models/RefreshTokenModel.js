import { BaseModel } from './BaseModel.js';
import pool from '../../config/database.js';

/**
 * Refresh Token Model
 */
export class RefreshTokenModel extends BaseModel {
  constructor() {
    super('refresh_tokens');
  }

  /**
   * Delete expired tokens
   */
  async deleteExpired() {
    const query = `DELETE FROM refresh_tokens WHERE expires_at < NOW()`;
    const [result] = await pool.query(query);
    return result.affectedRows;
  }
}

export default new RefreshTokenModel();
