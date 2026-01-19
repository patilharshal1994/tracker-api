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
INSERT INTO organizations (id, name, description, is_active, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'TechCorp Solutions', 'Leading technology solutions provider specializing in enterprise software development', TRUE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'Digital Innovations Inc', 'Innovative digital agency focused on web and mobile application development', TRUE, NOW(), NOW());

-- ============================================
-- Teams (2 teams - one for each organization)
-- ============================================
INSERT INTO teams (id, name, organization_id, description, created_at, updated_at) VALUES
('33333333-3333-3333-3333-333333333333', 'Development Team', '11111111-1111-1111-1111-111111111111', 'Main development team for TechCorp Solutions', NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'Engineering Team', '22222222-2222-2222-2222-222222222222', 'Core engineering team for Digital Innovations Inc', NOW(), NOW());

-- ============================================
-- Users
-- ============================================
-- Password for all users: 'password123'
-- Bcrypt hash generated: $2b$10$chAQCB7/mDJ.Bsvf2k9JgOyKyJk3.AkADaNE.l7339mvIAZ6Hfp.y

-- 2 Org Admins
INSERT INTO users (id, name, email, password_hash, role, organization_id, team_id, phone, designation, department, specialty, is_active, created_at, updated_at) VALUES
('55555555-5555-5555-5555-555555555555', 'John Smith', 'john.smith@techcorp.com', '$2b$10$chAQCB7/mDJ.Bsvf2k9JgOyKyJk3.AkADaNE.l7339mvIAZ6Hfp.y', 'ORG_ADMIN', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', '+1-555-0101', 'Organization Administrator', 'Management', 'IT Management', TRUE, NOW(), NOW()),
('66666666-6666-6666-6666-666666666666', 'Sarah Johnson', 'sarah.johnson@digitalinnovations.com', '$2b$10$chAQCB7/mDJ.Bsvf2k9JgOyKyJk3.AkADaNE.l7339mvIAZ6Hfp.y', 'ORG_ADMIN', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', '+1-555-0102', 'Organization Administrator', 'Management', 'Project Management', TRUE, NOW(), NOW());

-- 1 Team Lead
INSERT INTO users (id, name, email, password_hash, role, organization_id, team_id, phone, designation, department, specialty, is_active, created_at, updated_at) VALUES
('77777777-7777-7777-7777-777777777777', 'Mike Anderson', 'mike.anderson@techcorp.com', '$2b$10$chAQCB7/mDJ.Bsvf2k9JgOyKyJk3.AkADaNE.l7339mvIAZ6Hfp.y', 'TEAM_LEAD', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', '+1-555-0103', 'Senior Developer', 'Engineering', 'Full Stack Development', TRUE, NOW(), NOW());

-- 1 Regular User
INSERT INTO users (id, name, email, password_hash, role, organization_id, team_id, phone, designation, department, specialty, is_active, created_at, updated_at) VALUES
('88888888-8888-8888-8888-888888888888', 'Emily Davis', 'emily.davis@techcorp.com', '$2b$10$chAQCB7/mDJ.Bsvf2k9JgOyKyJk3.AkADaNE.l7339mvIAZ6Hfp.y', 'USER', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', '+1-555-0104', 'Software Developer', 'Engineering', 'Frontend Development', TRUE, NOW(), NOW());

-- ============================================
-- Optional: Additional Sample Data
-- ============================================

-- Sample Projects (optional - uncomment if needed)
-- INSERT INTO projects (id, name, description, created_by, team_id, organization_id, is_active, created_at, updated_at) VALUES
-- ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Website Redesign', 'Complete redesign of company website with modern UI/UX', '55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', TRUE, NOW(), NOW()),
-- ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Mobile App Development', 'Native mobile application for iOS and Android platforms', '66666666-6666-6666-6666-666666666666', '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', TRUE, NOW(), NOW());

-- Sample Tags (optional - uncomment if needed)
-- INSERT INTO tags (id, name, color, description, created_at, updated_at) VALUES
-- ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Frontend', '#1976d2', 'Frontend development related', NOW(), NOW()),
-- ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Backend', '#d32f2f', 'Backend development related', NOW(), NOW()),
-- ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Bug', '#f57c00', 'Bug fix required', NOW(), NOW()),
-- ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Feature', '#388e3c', 'New feature request', NOW(), NOW());

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
