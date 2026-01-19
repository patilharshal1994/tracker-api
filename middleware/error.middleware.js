export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Validation errors
  if (err.name === 'ValidationError' || err.name === 'BadRequestError') {
    return res.status(400).json({
      error: err.message || 'Validation error',
      details: isDevelopment ? err.stack : undefined
    });
  }

  // Authentication errors
  if (err.name === 'UnauthorizedError' || err.status === 401) {
    return res.status(401).json({
      error: err.message || 'Authentication failed'
    });
  }

  // Forbidden errors
  if (err.status === 403) {
    return res.status(403).json({
      error: err.message || 'Access forbidden'
    });
  }

  // Not found errors
  if (err.status === 404) {
    return res.status(404).json({
      error: err.message || 'Resource not found'
    });
  }

  // Database errors
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      error: 'Duplicate entry'
    });
  }

  // Default server error
  res.status(err.status || 500).json({
    error: isDevelopment ? err.message : 'Internal server error',
    details: isDevelopment ? err.stack : undefined
  });
};
