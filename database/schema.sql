-- ============================================================================
-- Issue Tracker Database Schema
-- MySQL 8.0+ / MariaDB 10.3+ with InnoDB
-- All tables use UUID (CHAR(36)) as primary key
-- Ready for phpMyAdmin import
-- ============================================================================

-- Drop database if exists (optional - comment out if you want to keep existing data)
-- DROP DATABASE IF EXISTS issue_tracker;

-- Create database
CREATE DATABASE IF NOT EXISTS issue_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE issue_tracker;

-- ============================================================================
-- 1. ORGANIZATIONS TABLE
-- ============================================================================
CREATE TABLE organizations (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 2. TEAMS TABLE (must be created before users due to foreign key)
-- ============================================================================
CREATE TABLE teams (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    organization_id CHAR(36) NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_organization_id (organization_id),
    INDEX idx_name (name),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 3. USERS TABLE
-- ============================================================================
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('SUPER_ADMIN', 'ORG_ADMIN', 'TEAM_LEAD', 'USER') NOT NULL DEFAULT 'USER',
    organization_id CHAR(36) NULL,
    team_id CHAR(36) NULL,
    phone VARCHAR(20) NULL,
    designation VARCHAR(255) NULL,
    department VARCHAR(255) NULL,
    specialty VARCHAR(255) NULL,
    experience INT NULL,
    education TEXT NULL,
    address TEXT NULL,
    city VARCHAR(100) NULL,
    country VARCHAR(100) NULL,
    bio TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_organization_id (organization_id),
    INDEX idx_team_id (team_id),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at),
    INDEX idx_name (name),
    FULLTEXT INDEX ft_user_search (name, email),
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 4. PROJECTS TABLE
-- ============================================================================
CREATE TABLE projects (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    created_by CHAR(36) NOT NULL,
    team_id CHAR(36) NULL,
    organization_id CHAR(36) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_created_by (created_by),
    INDEX idx_team_id (team_id),
    INDEX idx_organization_id (organization_id),
    INDEX idx_is_active (is_active),
    INDEX idx_name (name),
    INDEX idx_created_at (created_at),
    FULLTEXT INDEX ft_project_search (name, description),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 5. PROJECT MEMBERS TABLE (Many-to-Many: Projects <-> Users)
-- ============================================================================
CREATE TABLE project_members (
    id CHAR(36) PRIMARY KEY,
    project_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_project_user (project_id, user_id),
    INDEX idx_project_id (project_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 6. TAGS TABLE
-- ============================================================================
CREATE TABLE tags (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(7) NULL DEFAULT '#1976d2',
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_color (color),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 7. TICKETS TABLE
-- ============================================================================
CREATE TABLE tickets (
    id CHAR(36) PRIMARY KEY,
    project_id CHAR(36) NOT NULL,
    type ENUM('TASK', 'BUG', 'ISSUE', 'SUGGESTION') NOT NULL DEFAULT 'TASK',
    title VARCHAR(500) NOT NULL,
    description TEXT NULL,
    module VARCHAR(255) NULL,
    reporter_id CHAR(36) NOT NULL,
    assignee_id CHAR(36) NULL,
    branch_name VARCHAR(255) NULL,
    scenario TEXT NULL,
    start_date DATE NULL,
    due_date DATETIME NULL,
    duration_hours INT NULL,
    breach_threshold_minutes INT NULL DEFAULT 0,
    status ENUM('CREATED', 'IN_PROGRESS', 'DEPENDENCY', 'HOLD', 'SOLVED', 'CLOSED') NOT NULL DEFAULT 'CREATED',
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') NOT NULL DEFAULT 'MEDIUM',
    is_breached BOOLEAN NOT NULL DEFAULT FALSE,
    last_breach_notified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_project_id (project_id),
    INDEX idx_reporter_id (reporter_id),
    INDEX idx_assignee_id (assignee_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_module (module),
    INDEX idx_type (type),
    INDEX idx_due_date (due_date),
    INDEX idx_is_breached (is_breached),
    INDEX idx_created_at (created_at),
    INDEX idx_updated_at (updated_at),
    INDEX idx_status_priority (status, priority),
    INDEX idx_project_status (project_id, status),
    FULLTEXT INDEX ft_ticket_search (title, description, scenario),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 8. TICKET TAGS TABLE (Many-to-Many: Tickets <-> Tags)
-- ============================================================================
CREATE TABLE ticket_tags (
    id CHAR(36) PRIMARY KEY,
    ticket_id CHAR(36) NOT NULL,
    tag_id CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_ticket_tag (ticket_id, tag_id),
    INDEX idx_ticket_id (ticket_id),
    INDEX idx_tag_id (tag_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 9. TICKET COMMENTS TABLE
-- ============================================================================
CREATE TABLE ticket_comments (
    id CHAR(36) PRIMARY KEY,
    ticket_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    comment_text TEXT NOT NULL,
    mentioned_user_ids JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ticket_id (ticket_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_updated_at (updated_at),
    FULLTEXT INDEX ft_comment_search (comment_text),
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 10. TICKET ATTACHMENTS TABLE
-- ============================================================================
CREATE TABLE ticket_attachments (
    id CHAR(36) PRIMARY KEY,
    ticket_id CHAR(36) NOT NULL,
    comment_id CHAR(36) NULL,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_by CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ticket_id (ticket_id),
    INDEX idx_comment_id (comment_id),
    INDEX idx_uploaded_by (uploaded_by),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 11. TICKET RELATIONSHIPS TABLE
-- ============================================================================
CREATE TABLE ticket_relationships (
    id CHAR(36) PRIMARY KEY,
    ticket_id CHAR(36) NOT NULL,
    related_ticket_id CHAR(36) NOT NULL,
    relationship_type ENUM('BLOCKS', 'BLOCKED_BY', 'DUPLICATE', 'RELATES_TO', 'PARENT', 'CHILD') NOT NULL,
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ticket_id (ticket_id),
    INDEX idx_related_ticket_id (related_ticket_id),
    INDEX idx_relationship_type (relationship_type),
    INDEX idx_created_by (created_by),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (related_ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 12. TICKET WATCHERS TABLE
-- ============================================================================
CREATE TABLE ticket_watchers (
    id CHAR(36) PRIMARY KEY,
    ticket_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_ticket_watcher (ticket_id, user_id),
    INDEX idx_ticket_id (ticket_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 13. TICKET TIME LOGS TABLE
-- ============================================================================
CREATE TABLE ticket_time_logs (
    id CHAR(36) PRIMARY KEY,
    ticket_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    hours DECIMAL(10, 2) NOT NULL,
    description TEXT NULL,
    logged_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ticket_id (ticket_id),
    INDEX idx_user_id (user_id),
    INDEX idx_logged_date (logged_date),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 14. TICKET ACTIVITIES TABLE
-- ============================================================================
CREATE TABLE ticket_activities (
    id CHAR(36) PRIMARY KEY,
    ticket_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    old_value TEXT NULL,
    new_value TEXT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ticket_id (ticket_id),
    INDEX idx_user_id (user_id),
    INDEX idx_activity_type (activity_type),
    INDEX idx_created_at (created_at),
    INDEX idx_ticket_activity (ticket_id, activity_type, created_at),
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 15. NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE notifications (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'info',
    related_entity_type VARCHAR(50) NULL,
    related_entity_id CHAR(36) NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at),
    INDEX idx_type (type),
    INDEX idx_user_read (user_id, is_read),
    INDEX idx_related_entity (related_entity_type, related_entity_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 16. SAVED FILTERS TABLE
-- ============================================================================
CREATE TABLE saved_filters (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    filter_data JSON NOT NULL,
    is_shared BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_is_shared (is_shared),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 17. TICKET TEMPLATES TABLE
-- ============================================================================
CREATE TABLE ticket_templates (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    type ENUM('TASK', 'BUG', 'ISSUE', 'SUGGESTION') NOT NULL DEFAULT 'TASK',
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') NOT NULL DEFAULT 'MEDIUM',
    default_title VARCHAR(500) NULL,
    default_description TEXT NULL,
    default_module VARCHAR(255) NULL,
    created_by CHAR(36) NOT NULL,
    is_shared BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_created_by (created_by),
    INDEX idx_is_shared (is_shared),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 18. USER PREFERENCES TABLE
-- ============================================================================
CREATE TABLE user_preferences (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL UNIQUE,
    theme_mode ENUM('light', 'dark') DEFAULT 'dark',
    color_scheme VARCHAR(50) DEFAULT 'salla',
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 19. REFRESH TOKENS TABLE (for JWT authentication)
-- ============================================================================
CREATE TABLE refresh_tokens (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_token (token),
    INDEX idx_expires_at (expires_at),
    INDEX idx_user_expires (user_id, expires_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
-- Total Tables: 19
-- 
-- Core Tables:
--   1. organizations
--   2. teams
--   3. users
--   4. projects
--   5. project_members
--   6. tags
--   7. tickets
--   8. ticket_tags
--   9. ticket_comments
--   10. ticket_attachments
--   11. ticket_relationships
--   12. ticket_watchers
--   13. ticket_time_logs
--   14. ticket_activities
--   15. notifications
--   16. saved_filters
--   17. ticket_templates
--   18. user_preferences
--   19. refresh_tokens
-- ============================================================================
