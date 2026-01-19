# Environment Variables Required

## Database Configuration
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=issue_tracker
DB_PORT=3306
```

## JWT Security (Required)
```env
# JWT Secret for access tokens (must be strong and unique)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-for-security

# JWT Secret for refresh tokens (should be different from access token secret)
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-minimum-32-characters-long

# Access token expiry (default: 30m)
JWT_ACCESS_EXPIRY=30m

# Refresh token expiry (default: 7d)
JWT_REFRESH_EXPIRY=7d
```

## Server Configuration
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
API_URL=http://localhost:3001
```

## Email Configuration (Optional - for notifications)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@issuetracker.com
```

## File Upload (Optional)
```env
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

## Security Notes
- **JWT_SECRET** and **JWT_REFRESH_SECRET**: Must be strong, random strings (minimum 32 characters)
- Generate secure secrets: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Never commit `.env` file to version control
- Use different secrets for development and production
