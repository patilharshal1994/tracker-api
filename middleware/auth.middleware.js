import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    
    try {
      // Verify JWT token and decode payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (!decoded || !decoded.userId) {
        return res.status(401).json({ error: 'Invalid token payload' });
      }
      
      // Verify user still exists and is active - fetch all user fields including organization_id
      const [users] = await pool.query(
        `SELECT 
          id, name, email, role, organization_id, team_id, is_active, 
          phone, designation, department, specialty, bio
        FROM users WHERE id = ?`,
        [decoded.userId]
      );

      if (users.length === 0) {
        return res.status(401).json({ error: 'User not found' });
      }

      const user = users[0];

      // Handle UUID vs integer ID
      const userId = user.id;

      if (!user.is_active) {
        return res.status(403).json({ error: 'Account is inactive' });
      }

      // Attach full user object to request
      req.user = {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        organization_id: user.organization_id,
        team_id: user.team_id,
        is_active: user.is_active,
        phone: user.phone,
        designation: user.designation,
        department: user.department,
        specialty: user.specialty,
        bio: user.bio
      };
      
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Authorization middleware
 * Checks if user has required role
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};
