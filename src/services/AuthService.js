import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';
import RefreshTokenModel from '../models/RefreshTokenModel.js';
import { generateUUID } from '../utils/uuid.js';

/**
 * Auth Service - Authentication and authorization business logic
 */
class AuthService {
  /**
   * Login user
   */
  async login(email, password) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.is_active) {
      throw new Error('Account is inactive');
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens with all necessary user info for hierarchical access control
    const accessToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        organization_id: user.organization_id,
        team_id: user.team_id
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRY || '30m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
    );

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
    await RefreshTokenModel.create({
      user_id: user.id,
      token: refreshToken,
      expires_at: expiresAt.toISOString().slice(0, 19).replace('T', ' ')
    });

    return {
      user: UserModel.sanitize(user),
      accessToken,
      refreshToken
    };
  }

  /**
   * Register new user
   */
  async register(userData) {
    // Check if email already exists
    const existing = await UserModel.findByEmail(userData.email);
    if (existing) {
      throw new Error('Email already registered');
    }

    // Hash password
    const saltRounds = 10;
    userData.password_hash = await bcrypt.hash(userData.password, saltRounds);
    delete userData.password;

    // Create user
    const user = await UserModel.create(userData);

    return UserModel.sanitize(user);
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      // Verify refresh token exists in database and is not expired
      const tokenRecord = await RefreshTokenModel.findOne({ token: refreshToken });
      if (!tokenRecord) {
        throw new Error('Invalid refresh token');
      }

      // Check if token is expired
      if (new Date(tokenRecord.expires_at) < new Date()) {
        // Delete expired token
        await RefreshTokenModel.delete(tokenRecord.id);
        throw new Error('Refresh token expired');
      }

      // Get user
      const user = await UserModel.findById(decoded.userId);
      if (!user || !user.is_active) {
        throw new Error('User not found or inactive');
      }

      // Generate new access token with all necessary user info
      const accessToken = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role,
          organization_id: user.organization_id,
          team_id: user.team_id
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRY || '30m' }
      );

      return {
        accessToken,
        user: UserModel.sanitize(user)
      };
    } catch (err) {
      if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
        throw new Error('Invalid refresh token');
      }
      throw err;
    }
  }

  /**
   * Logout user (revoke refresh token)
   */
  async logout(refreshToken) {
    const tokenRecord = await RefreshTokenModel.findOne({ token: refreshToken });
    if (tokenRecord) {
      await RefreshTokenModel.delete(tokenRecord.id);
    }
    return { success: true };
  }
}

export default new AuthService();
