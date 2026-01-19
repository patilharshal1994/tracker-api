# Issue Tracker API - Implementation Guide

## Overview
This document outlines the complete backend API implementation with UUID-based primary keys, proper validation, services layer, and secure authentication.

## Project Structure
```
tracker-api/
├── src/
│   ├── models/          # Database models extending BaseModel
│   ├── services/        # Business logic layer
│   ├── validators/      # Request validation schemas
│   └── utils/           # Utility functions (UUID, pagination, query builder)
├── controllers/         # Route handlers (to be updated to use services)
├── routes/              # API routes
├── middleware/          # Authentication, validation, error handling
├── config/              # Database configuration
├── database/            # Schema and seed files
└── jobs/                # Cron jobs (SLA breach checks)
```

## Implementation Status

### ✅ Completed
1. Database schema with UUID primary keys for all tables
2. Base model class with common CRUD operations
3. Utility functions (UUID generation, pagination, query builder)
4. Validation schemas for auth and users
5. Folder structure created

### 🚧 In Progress
- Model files for each entity
- Service layer with business logic
- Controller updates to use services
- Complete validation schemas

### 📋 Next Steps

1. **Create Model Files** (`src/models/`)
   - OrganizationModel.js
   - UserModel.js
   - TeamModel.js
   - ProjectModel.js
   - TicketModel.js
   - CommentModel.js
   - TagModel.js
   - NotificationModel.js
   - ActivityModel.js
   - etc.

2. **Create Service Files** (`src/services/`)
   - OrganizationService.js
   - UserService.js
   - TeamService.js
   - ProjectService.js
   - TicketService.js
   - CommentService.js
   - TagService.js
   - NotificationService.js
   - AuthService.js
   - etc.

3. **Update Controllers** (`controllers/`)
   - Use services instead of direct database calls
   - Remove password fields from responses
   - Add proper error handling
   - Implement role-based access control

4. **Complete Validators** (`src/validators/`)
   - Organization validators
   - Team validators
   - Project validators
   - Ticket validators
   - Comment validators
   - Tag validators
   - etc.

5. **Update Middleware**
   - Enhance auth.middleware.js for role hierarchy
   - Update validation.middleware.js to use new validators

## Database Schema Features
- All tables use UUID (CHAR(36)) as primary key
- Proper foreign key relationships
- Indexes on frequently queried columns
- Support for hierarchical roles (SUPER_ADMIN, ORG_ADMIN, TEAM_LEAD, USER)
- Organization-based data isolation
- Complete audit trail with activity logs

## Security Features
- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Request validation with express-validator
- SQL injection prevention with parameterized queries
- XSS protection with Helmet
- CORS configuration
- Rate limiting

## API Endpoints Structure

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout

### Organizations (Super Admin only)
- GET /api/organizations
- POST /api/organizations
- GET /api/organizations/:id
- PUT /api/organizations/:id
- DELETE /api/organizations/:id

### Users
- GET /api/users
- POST /api/users
- GET /api/users/:id
- PUT /api/users/:id
- DELETE /api/users/:id
- POST /api/users/:id/reset-password

### Teams
- GET /api/teams
- POST /api/teams
- GET /api/teams/:id
- PUT /api/teams/:id
- DELETE /api/teams/:id

### Projects
- GET /api/projects
- POST /api/projects
- GET /api/projects/:id
- PUT /api/projects/:id
- DELETE /api/projects/:id

### Tickets
- GET /api/tickets
- POST /api/tickets
- GET /api/tickets/:id
- PUT /api/tickets/:id
- DELETE /api/tickets/:id

... and more endpoints for comments, tags, notifications, activities, etc.

## Usage Instructions

1. **Setup Database**
   ```bash
   mysql -u root -p < database/schema.sql
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create `.env` file with:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=issue_tracker
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   ```

4. **Run Server**
   ```bash
   npm run dev
   ```

## Next Implementation Steps
Continue creating model and service files following the established patterns, then update controllers to use the service layer for all business logic.
