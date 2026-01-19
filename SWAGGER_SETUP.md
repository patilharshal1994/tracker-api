# Swagger API Documentation

## Setup Complete ✅

Swagger documentation has been set up for the Issue Tracker API.

## Access

- **Swagger UI**: http://localhost:3001/api-docs
- **JSON Spec**: http://localhost:3001/api-docs.json (automatically available)

## What's Included

1. **Swagger Configuration** (`config/swagger.js`)
   - Complete schema definitions for all entities
   - Security schemes (JWT Bearer Auth)
   - Server configurations
   - Tags and descriptions

2. **Swagger UI Integration** (`server.js`)
   - Swagger UI served at `/api-docs`
   - Custom styling (topbar hidden)

3. **Swagger Annotations**
   - ✅ Authentication routes (register, login, refresh, logout)
   - ✅ User routes (CRUD + profile + password reset)
   - ✅ Organization routes (CRUD - Super Admin only)
   - 🔄 Remaining routes have basic structure - can be expanded

## Schema Definitions

All major entities have schema definitions:
- User
- Organization
- Team
- Project
- Ticket
- Comment
- Notification
- Tag
- TicketTemplate
- Activity
- Error responses
- Pagination metadata

## Usage

1. Start the server: `npm start`
2. Open browser: http://localhost:3001/api-docs
3. Click "Authorize" button to add JWT token
4. Test endpoints directly from Swagger UI

## Adding More Annotations

To add Swagger annotations to remaining routes, follow this pattern:

```javascript
/**
 * @swagger
 * /api/endpoint:
 *   get:
 *     summary: Description
 *     tags: [TagName]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path/query
 *         name: paramName
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/endpoint', validation, controller);
```

## Notes

- All authenticated routes require Bearer token (JWT)
- Use "Authorize" button in Swagger UI to add token
- Token can be obtained from `/api/auth/login` endpoint
- All UUID parameters are validated as UUID format
- Pagination parameters (page, limit) are available on list endpoints
