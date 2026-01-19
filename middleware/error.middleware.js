/**
 * Error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Validation errors (express-validator)
  if (err.name === 'ValidationError' || err.name === 'BadRequestError') {
    return res.status(400).json({
      error: err.message || 'Validation error',
      details: isDevelopment ? err.stack : undefined
    });
  }

  // Authentication errors
  if (err.name === 'UnauthorizedError' || err.status === 401 || err.message?.includes('Access denied') || err.message?.includes('Authentication')) {
    return res.status(401).json({
      error: err.message || 'Authentication failed'
    });
  }

  // Forbidden errors
  if (err.status === 403 || err.message?.includes('permission') || err.message?.includes('Access denied')) {
    return res.status(403).json({
      error: err.message || 'Access forbidden'
    });
  }

  // Not found errors
  if (err.status === 404 || err.message?.includes('not found')) {
    return res.status(404).json({
      error: err.message || 'Resource not found'
    });
  }

  // Conflict errors (duplicate entries, etc.)
  if (err.status === 409 || err.message?.includes('already exists') || err.message?.includes('Email already')) {
    return res.status(409).json({
      error: err.message || 'Conflict'
    });
  }

  // Database errors
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      error: 'Duplicate entry'
    });
  }

  // UUID validation errors
  if (err.message?.includes('Invalid') && err.message?.includes('UUID')) {
    return res.status(400).json({
      error: err.message
    });
  }

  // Default server error
  res.status(err.status || 500).json({
    error: isDevelopment ? err.message : 'Internal server error',
    details: isDevelopment ? err.stack : undefined
  });
};
