# Issue Tracker API

RESTful API for the Issue Tracker application built with Node.js, Express, and MySQL.

## Features

- JWT-based authentication with refresh tokens
- Role-based access control (Admin/User)
- User, Team, Project, Ticket, and Comment management
- SLA breach detection with automated notifications
- Secure file uploads for ticket comments
- Email notifications (configurable via SMTP)

## Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials and other settings.

3. **Create database:**
   ```bash
   mysql -u root -p < database/schema.sql
   ```

4. **Seed database (optional):**
   ```bash
   npm run seed
   ```

5. **Start server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register (optional)
- `POST /api/auth/refresh` - Refresh access token

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/me` - Get current user
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams` - Create team (Admin only)
- `PUT /api/teams/:id` - Update team (Admin only)
- `DELETE /api/teams/:id` - Delete team (Admin only)

### Projects
- `GET /api/projects` - Get all projects (filtered by role)
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create project (Admin only)
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project (Admin only)
- `POST /api/projects/:id/members` - Add project member
- `DELETE /api/projects/:id/members/:userId` - Remove project member

### Tickets
- `GET /api/tickets` - Get tickets (with filters)
- `GET /api/tickets/:id` - Get ticket by ID
- `POST /api/tickets` - Create ticket
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket

### Comments
- `GET /api/comments/ticket/:ticketId` - Get comments for ticket
- `POST /api/comments` - Create comment (with optional file upload)
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

## Security Features

- Password hashing with bcrypt
- JWT tokens with short expiry
- Input validation and sanitization
- SQL injection prevention (prepared statements)
- File upload security (MIME type validation, size limits)
- Rate limiting on auth endpoints
- CORS configuration
- Secure HTTP headers (Helmet)

## Environment Variables

See `.env.example` for all required environment variables.

## Database Schema

See `database/schema.sql` for the complete database schema.

## Seed Data

Default credentials after running seed:
- Admin: `admin@tracker.com` / `password123`
- User1: `user1@tracker.com` / `password123`
- User2: `user2@tracker.com` / `password123`
