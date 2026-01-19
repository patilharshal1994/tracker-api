-- Seed Data for Issue Tracker
-- This file contains sample data for testing and development
-- All passwords are hashed with bcrypt for: 'password123'
-- Use this command to generate bcrypt hash: node -e "const bcrypt = require('bcrypt'); bcrypt.hash('password123', 10).then(h => console.log(h))"

USE issue_tracker;

-- Clear existing data (optional - uncomment if you want to reset)
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE tickets;
-- TRUNCATE TABLE ticket_activities;
-- TRUNCATE TABLE ticket_comments;
-- TRUNCATE TABLE ticket_tags;
-- TRUNCATE TABLE ticket_watchers;
-- TRUNCATE TABLE ticket_relationships;
-- TRUNCATE TABLE ticket_time_logs;
-- TRUNCATE TABLE project_members;
-- TRUNCATE TABLE projects;
-- TRUNCATE TABLE users;
-- TRUNCATE TABLE teams;
-- TRUNCATE TABLE organizations;
-- SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- Organizations (2 organizations)
-- ============================================
-- Using proper UUID v4 format (generated with uuid package)
INSERT INTO organizations (id, name, description, is_active, created_at, updated_at) VALUES
('f74adf7a-e226-4c65-8b7a-760d07b4ca1f', 'TechCorp Solutions', 'Leading technology solutions provider specializing in enterprise software development', TRUE, NOW(), NOW()),
('fc690d7d-2995-4249-b752-20803cdb274d', 'Digital Innovations Inc', 'Innovative digital agency focused on web and mobile application development', TRUE, NOW(), NOW());

-- ============================================
-- Teams (2 teams - one for each organization)
-- ============================================
INSERT INTO teams (id, name, organization_id, description, created_at, updated_at) VALUES
('8783a27c-f8e0-4397-84c2-fccbd5cd8087', 'Development Team', 'f74adf7a-e226-4c65-8b7a-760d07b4ca1f', 'Main development team for TechCorp Solutions', NOW(), NOW()),
('95aed0f4-537c-45db-b6e0-8afcb24129fd', 'Engineering Team', 'fc690d7d-2995-4249-b752-20803cdb274d', 'Core engineering team for Digital Innovations Inc', NOW(), NOW());

-- ============================================
-- Users
-- ============================================
-- Password for all users: 'password123'
-- Bcrypt hash generated: $2b$10$chAQCB7/mDJ.Bsvf2k9JgOyKyJk3.AkADaNE.l7339mvIAZ6Hfp.y

-- 2 Org Admins
INSERT INTO users (id, name, email, password_hash, role, organization_id, team_id, phone, designation, department, specialty, is_active, created_at, updated_at) VALUES
('66880b38-6631-4dd2-a66e-c07157675a35', 'John Smith', 'john.smith@techcorp.com', '$2b$10$chAQCB7/mDJ.Bsvf2k9JgOyKyJk3.AkADaNE.l7339mvIAZ6Hfp.y', 'ORG_ADMIN', 'f74adf7a-e226-4c65-8b7a-760d07b4ca1f', '8783a27c-f8e0-4397-84c2-fccbd5cd8087', '+1-555-0101', 'Organization Administrator', 'Management', 'IT Management', TRUE, NOW(), NOW()),
('79558cc8-b70b-44ca-b9ef-67f7dc82588c', 'Sarah Johnson', 'sarah.johnson@digitalinnovations.com', '$2b$10$chAQCB7/mDJ.Bsvf2k9JgOyKyJk3.AkADaNE.l7339mvIAZ6Hfp.y', 'ORG_ADMIN', 'fc690d7d-2995-4249-b752-20803cdb274d', '95aed0f4-537c-45db-b6e0-8afcb24129fd', '+1-555-0102', 'Organization Administrator', 'Management', 'Project Management', TRUE, NOW(), NOW());

-- 1 Team Lead
INSERT INTO users (id, name, email, password_hash, role, organization_id, team_id, phone, designation, department, specialty, is_active, created_at, updated_at) VALUES
('c3965045-464e-4d89-bc03-0d692a050493', 'Mike Anderson', 'mike.anderson@techcorp.com', '$2b$10$chAQCB7/mDJ.Bsvf2k9JgOyKyJk3.AkADaNE.l7339mvIAZ6Hfp.y', 'TEAM_LEAD', 'f74adf7a-e226-4c65-8b7a-760d07b4ca1f', '8783a27c-f8e0-4397-84c2-fccbd5cd8087', '+1-555-0103', 'Senior Developer', 'Engineering', 'Full Stack Development', TRUE, NOW(), NOW());

-- 1 Regular User
INSERT INTO users (id, name, email, password_hash, role, organization_id, team_id, phone, designation, department, specialty, is_active, created_at, updated_at) VALUES
('e54e645b-8e0e-421f-9750-0d7824182bfb', 'Emily Davis', 'emily.davis@techcorp.com', '$2b$10$chAQCB7/mDJ.Bsvf2k9JgOyKyJk3.AkADaNE.l7339mvIAZ6Hfp.y', 'USER', 'f74adf7a-e226-4c65-8b7a-760d07b4ca1f', '8783a27c-f8e0-4397-84c2-fccbd5cd8087', '+1-555-0104', 'Software Developer', 'Engineering', 'Frontend Development', TRUE, NOW(), NOW());

-- ============================================
-- Optional: Additional Sample Data
-- ============================================

-- Sample Projects (optional - uncomment if needed)
-- Note: Use proper UUID v4 format - generate new ones when uncommenting
-- INSERT INTO projects (id, name, description, created_by, team_id, organization_id, is_active, created_at, updated_at) VALUES
-- ('[GENERATE-NEW-UUID]', 'Website Redesign', 'Complete redesign of company website with modern UI/UX', '66880b38-6631-4dd2-a66e-c07157675a35', '8783a27c-f8e0-4397-84c2-fccbd5cd8087', 'f74adf7a-e226-4c65-8b7a-760d07b4ca1f', TRUE, NOW(), NOW()),
-- ('[GENERATE-NEW-UUID]', 'Mobile App Development', 'Native mobile application for iOS and Android platforms', '79558cc8-b70b-44ca-b9ef-67f7dc82588c', '95aed0f4-537c-45db-b6e0-8afcb24129fd', 'fc690d7d-2995-4249-b752-20803cdb274d', TRUE, NOW(), NOW());

-- Sample Tags (optional - uncomment if needed)
-- Note: Use proper UUID v4 format - generate new ones when uncommenting
-- INSERT INTO tags (id, name, color, description, created_at, updated_at) VALUES
-- ('[GENERATE-NEW-UUID]', 'Frontend', '#1976d2', 'Frontend development related', NOW(), NOW()),
-- ('[GENERATE-NEW-UUID]', 'Backend', '#d32f2f', 'Backend development related', NOW(), NOW()),
-- ('[GENERATE-NEW-UUID]', 'Bug', '#f57c00', 'Bug fix required', NOW(), NOW()),
-- ('[GENERATE-NEW-UUID]', 'Feature', '#388e3c', 'New feature request', NOW(), NOW());

-- ============================================
-- Summary
-- ============================================
-- Organizations: 2
-- Teams: 2 (one per organization)
-- Users: 4 total
--   - Org Admins: 2 (John Smith, Sarah Johnson)
--   - Team Lead: 1 (Mike Anderson)
--   - Regular User: 1 (Emily Davis)
--
-- Default password for all users: 'password123'
--
-- Login Credentials:
--   - Org Admin 1: john.smith@techcorp.com / password123
--   - Org Admin 2: sarah.johnson@digitalinnovations.com / password123
--   - Team Lead: mike.anderson@techcorp.com / password123
--   - User: emily.davis@techcorp.com / password123
