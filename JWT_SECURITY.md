# JWT Authentication Security Implementation

## ✅ Package Verification

All required packages are installed in `package.json`:

### Authentication & Security Packages
- ✅ **jsonwebtoken** (v9.0.2) - JWT token generation and verification
- ✅ **bcrypt** (v5.1.1) - Password hashing
- ✅ **uuid** (v9.0.1) - UUID generation for IDs and refresh tokens
- ✅ **express-validator** (v7.0.1) - Request validation
- ✅ **helmet** (v7.1.0) - Security headers
- ✅ **express-rate-limit** (v7.1.5) - Rate limiting

### Database & Other Packages
- ✅ **mysql2** (v3.6.5) - MySQL database driver
- ✅ **dotenv** (v16.3.1) - Environment variables
- ✅ **multer** (v1.4.5-lts.1) - File uploads
- ✅ **swagger-jsdoc** & **swagger-ui-express** - API documentation

## 🔐 JWT Security Implementation

### 1. Dual Token Strategy
- **Access Token**: Short-lived (30 minutes default)
  - Contains: userId, email, role, organization_id, team_id
  - Used for API requests
  - Stored in memory (frontend)

- **Refresh Token**: Long-lived (7 days default)
  - Contains: userId only
  - Stored in database (`refresh_tokens` table)
  - Used to get new access tokens

### 2. Token Generation (`AuthService.login()`)
```javascript
// Access Token - includes all necessary info for hierarchical access
const accessToken = jwt.sign({
  userId: user.id,
  email: user.email,
  role: user.role,
  organization_id: user.organization_id,  // For hierarchical access
  team_id: user.team_id                    // For hierarchical access
}, process.env.JWT_SECRET, { expiresIn: '30m' });

// Refresh Token - minimal info
const refreshToken = jwt.sign({
  userId: user.id
}, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
```

### 3. Token Verification (`auth.middleware.js`)
- Verifies JWT signature using `JWT_SECRET`
- Validates token expiry
- Checks if user exists and is active
- Fetches fresh user data from database (prevents stale token issues)
- Attaches full user object to `req.user`

### 4. Security Features

#### ✅ Password Security
- Passwords hashed with bcrypt (10 salt rounds)
- Never stored in plain text
- Password never included in JWT tokens

#### ✅ Token Security
- Separate secrets for access and refresh tokens
- Short-lived access tokens (30m default)
- Refresh tokens stored in database with expiry
- Token revocation on logout
- User active status checked on each request

#### ✅ Hierarchical Access Control
- JWT includes `organization_id` and `team_id`
- Enables role-based filtering at token level
- Service layer validates organization/team boundaries

#### ✅ Request Security
- Bearer token authentication
- Token validation on every protected route
- Error handling for expired/invalid tokens
- User existence and active status verification

### 5. Environment Variables Required

```env
# JWT Secrets (MUST be strong, random strings - minimum 32 characters)
JWT_SECRET=your-super-secret-access-token-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-min-32-chars

# Token Expiry (optional - defaults provided)
JWT_ACCESS_EXPIRY=30m    # Access token expiry
JWT_REFRESH_EXPIRY=7d    # Refresh token expiry
```

### 6. Token Flow

1. **Login**:
   - User provides email/password
   - Server verifies credentials
   - Generates access + refresh tokens
   - Stores refresh token in database
   - Returns both tokens to client

2. **API Requests**:
   - Client sends access token in `Authorization: Bearer <token>` header
   - Middleware verifies token signature and expiry
   - Validates user exists and is active
   - Attaches user info to request

3. **Token Refresh**:
   - Client sends refresh token when access token expires
   - Server verifies refresh token signature
   - Checks if refresh token exists in database
   - Validates token hasn't expired
   - Generates new access token
   - Returns new access token

4. **Logout**:
   - Client sends refresh token
   - Server deletes refresh token from database
   - Access token becomes invalid (but remains until expiry)

## 🔒 Security Best Practices Implemented

1. ✅ **Strong Secrets**: Uses separate secrets for access/refresh tokens
2. ✅ **Short Expiry**: Access tokens expire in 30 minutes
3. ✅ **Token Storage**: Refresh tokens stored securely in database
4. ✅ **Token Revocation**: Logout removes refresh tokens
5. ✅ **User Validation**: Every request verifies user exists and is active
6. ✅ **Password Hashing**: bcrypt with 10 salt rounds
7. ✅ **Input Validation**: express-validator on all endpoints
8. ✅ **HTTPS Ready**: Token-based auth works with HTTPS
9. ✅ **Role-Based Access**: JWT includes role, organization, team info
10. ✅ **Error Handling**: Proper error messages without exposing internals

## 📋 Required Environment Variables

Create a `.env` file with:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=issue_tracker
DB_PORT=3306

# JWT Security (REQUIRED)
JWT_SECRET=generate-strong-random-secret-minimum-32-characters
JWT_REFRESH_SECRET=generate-different-strong-random-secret-minimum-32-characters
JWT_ACCESS_EXPIRY=30m
JWT_REFRESH_EXPIRY=7d

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
API_URL=http://localhost:3001
```

### Generate Secure Secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run this twice to generate two different secrets for `JWT_SECRET` and `JWT_REFRESH_SECRET`.

## ✅ Verification

All packages are installed and JWT security is properly implemented with:
- Secure token generation
- Token verification middleware
- Refresh token mechanism
- Hierarchical access control support
- Proper error handling
