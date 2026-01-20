-- ============================================================================
-- Seed Data for Issue Tracker Database
-- This file contains comprehensive sample data for all tables
-- All passwords are hashed with bcrypt for: 'password123'
-- ============================================================================

USE issue_tracker;

-- Clear existing data (optional - uncomment if you want to reset)
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE refresh_tokens;
-- TRUNCATE TABLE user_preferences;
-- TRUNCATE TABLE ticket_templates;
-- TRUNCATE TABLE saved_filters;
-- TRUNCATE TABLE notifications;
-- TRUNCATE TABLE ticket_activities;
-- TRUNCATE TABLE ticket_time_logs;
-- TRUNCATE TABLE ticket_watchers;
-- TRUNCATE TABLE ticket_relationships;
-- TRUNCATE TABLE ticket_attachments;
-- TRUNCATE TABLE ticket_comments;
-- TRUNCATE TABLE ticket_tags;
-- TRUNCATE TABLE tickets;
-- TRUNCATE TABLE tags;
-- TRUNCATE TABLE project_members;
-- TRUNCATE TABLE projects;
-- TRUNCATE TABLE users;
-- TRUNCATE TABLE teams;
-- TRUNCATE TABLE organizations;
-- SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- 1. ORGANIZATIONS (2 organizations)
-- ============================================================================
INSERT INTO organizations (id, name, description, is_active, created_at, updated_at) VALUES
('f74adf7a-e226-4c65-8b7a-760d07b4ca1f', 'TechCorp Solutions', 'Leading technology solutions provider specializing in enterprise software development', TRUE, NOW(), NOW()),
('fc690d7d-2995-4249-b752-20803cdb274d', 'Digital Innovations Inc', 'Innovative digital agency focused on web and mobile application development', TRUE, NOW(), NOW());

-- ============================================================================
-- 2. TEAMS (3 teams - 2 for TechCorp, 1 for Digital Innovations)
-- ============================================================================
INSERT INTO teams (id, name, organization_id, description, created_at, updated_at) VALUES
('8783a27c-f8e0-4397-84c2-fccbd5cd8087', 'Development Team', 'f74adf7a-e226-4c65-8b7a-760d07b4ca1f', 'Main development team for TechCorp Solutions', NOW(), NOW()),
('95aed0f4-537c-45db-b6e0-8afcb24129fd', 'Engineering Team', 'fc690d7d-2995-4249-b752-20803cdb274d', 'Core engineering team for Digital Innovations Inc', NOW(), NOW()),
('a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7', 'QA Team', 'f74adf7a-e226-4c65-8b7a-760d07b4ca1f', 'Quality Assurance team for TechCorp Solutions', NOW(), NOW());

-- ============================================================================
-- 3. USERS (5 users with different roles)
-- ============================================================================
-- Password for all users: 'password123'
-- Bcrypt hash: $2b$10$chAQCB7/mDJ.Bsvf2k9JgOyKyJk3.AkADaNE.l7339mvIAZ6Hfp.y

-- 1 Super Admin
INSERT INTO users (id, name, email, password_hash, role, organization_id, team_id, phone, designation, department, specialty, is_active, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'Super Admin', 'admin@tracker.com', '$2b$10$chAQCB7/mDJ.Bsvf2k9JgOyKyJk3.AkADaNE.l7339mvIAZ6Hfp.y', 'SUPER_ADMIN', NULL, NULL, '+1-555-0000', 'System Administrator', 'IT', 'System Administration', TRUE, NOW(), NOW());

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

-- ============================================================================
-- 4. PROJECTS (4 projects)
-- ============================================================================
INSERT INTO projects (id, name, description, created_by, team_id, organization_id, is_active, created_at, updated_at) VALUES
('b8de1d25-956e-4e51-8e7f-4d4412f43ae9', 'Website Redesign', 'Complete redesign of company website with modern UI/UX and improved performance', '66880b38-6631-4dd2-a66e-c07157675a35', '8783a27c-f8e0-4397-84c2-fccbd5cd8087', 'f74adf7a-e226-4c65-8b7a-760d07b4ca1f', TRUE, NOW(), NOW()),
('c9ef2e36-a67f-5f62-9f8g-5e5523g54bf0', 'Mobile App Development', 'Native mobile application for iOS and Android platforms with offline support', '79558cc8-b70b-44ca-b9ef-67f7dc82588c', '95aed0f4-537c-45db-b6e0-8afcb24129fd', 'fc690d7d-2995-4249-b752-20803cdb274d', TRUE, NOW(), NOW()),
('d0fa3f47-b78g-6g73-ag9h-6f6634h65cg1', 'API Integration', 'RESTful API development and third-party service integrations', '66880b38-6631-4dd2-a66e-c07157675a35', '8783a27c-f8e0-4397-84c2-fccbd5cd8087', 'f74adf7a-e226-4c65-8b7a-760d07b4ca1f', TRUE, NOW(), NOW()),
('e1gb4g58-c89h-7h84-bh0i-7g7745i76dh2', 'Database Migration', 'Migration from legacy database system to modern cloud-based solution', 'c3965045-464e-4d89-bc03-0d692a050493', '8783a27c-f8e0-4397-84c2-fccbd5cd8087', 'f74adf7a-e226-4c65-8b7a-760d07b4ca1f', TRUE, NOW(), NOW());

-- ============================================================================
-- 5. PROJECT MEMBERS (assigning users to projects)
-- ============================================================================
INSERT INTO project_members (id, project_id, user_id, created_at) VALUES
('f2hc5h69-d90i-8i95-ci1j-8h8856j87ei3', 'b8de1d25-956e-4e51-8e7f-4d4412f43ae9', '66880b38-6631-4dd2-a66e-c07157675a35', NOW()),
('g3id6i70-e01j-9j06-dj2k-9i9967k98fj4', 'b8de1d25-956e-4e51-8e7f-4d4412f43ae9', 'c3965045-464e-4d89-bc03-0d692a050493', NOW()),
('h4je7j81-f12k-0k17-ek3l-0j0078l09gk5', 'b8de1d25-956e-4e51-8e7f-4d4412f43ae9', 'e54e645b-8e0e-421f-9750-0d7824182bfb', NOW()),
('i5kf8k92-g23l-1l28-fl4m-1k1189m10hl6', 'c9ef2e36-a67f-5f62-9f8g-5e5523g54bf0', '79558cc8-b70b-44ca-b9ef-67f7dc82588c', NOW()),
('j6lg9l03-h34m-2m39-gm5n-2l2200n21im7', 'd0fa3f47-b78g-6g73-ag9h-6f6634h65cg1', 'c3965045-464e-4d89-bc03-0d692a050493', NOW()),
('k7mh0m14-i45n-3n40-hn6o-3m3311o32jn8', 'd0fa3f47-b78g-6g73-ag9h-6f6634h65cg1', 'e54e645b-8e0e-421f-9750-0d7824182bfb', NOW());

-- ============================================================================
-- 6. TAGS (6 tags)
-- ============================================================================
INSERT INTO tags (id, name, color, description, created_at, updated_at) VALUES
('l8ni1n25-j56o-4o51-io7p-4n4422p43ko9', 'Frontend', '#1976d2', 'Frontend development related tasks', NOW(), NOW()),
('m9oj2o36-k67p-5p62-jp8q-5o5533q54lp0', 'Backend', '#d32f2f', 'Backend development related tasks', NOW(), NOW()),
('n0pk3p47-l78q-6q73-kq9r-6p6644r65mq1', 'Bug', '#f57c00', 'Bug fix required', NOW(), NOW()),
('o1ql4q58-m89r-7r84-lr0s-7q7755s76nr2', 'Feature', '#388e3c', 'New feature request', NOW(), NOW()),
('p2rm5r69-n90s-8s95-ms1t-8r8866t87os3', 'Urgent', '#c62828', 'Urgent priority items', NOW(), NOW()),
('q3sn6s70-o01t-9t06-nt2u-9s9977u98pt4', 'Documentation', '#7b1fa2', 'Documentation related tasks', NOW(), NOW());

-- ============================================================================
-- 7. TICKETS (6 tickets)
-- ============================================================================
INSERT INTO tickets (id, project_id, type, title, description, module, reporter_id, assignee_id, branch_name, scenario, start_date, due_date, duration_hours, breach_threshold_minutes, status, priority, is_breached, created_at, updated_at) VALUES
('r4to7t81-p12u-0u17-ou3v-0t0088v09qu5', 'b8de1d25-956e-4e51-8e7f-4d4412f43ae9', 'BUG', 'Login button not working on mobile', 'The login button on the mobile version of the website is not responding to clicks. This affects iOS Safari and Chrome browsers.', 'AUTHENTICATION', 'e54e645b-8e0e-421f-9750-0d7824182bfb', 'c3965045-464e-4d89-bc03-0d692a050493', 'fix/login-mobile', '1. Open website on mobile device\n2. Navigate to login page\n3. Click login button\n4. Button does not respond', '2024-01-15', '2024-01-20 17:00:00', 8, 1440, 'IN_PROGRESS', 'HIGH', FALSE, NOW(), NOW()),
('s5up8u92-q23v-1v28-pv4w-1u1199w10rv6', 'b8de1d25-956e-4e51-8e7f-4d4412f43ae9', 'SUGGESTION', 'Add dark mode support', 'Implement dark mode theme for the entire application with user preference toggle', 'UI', '66880b38-6631-4dd2-a66e-c07157675a35', 'e54e645b-8e0e-421f-9750-0d7824182bfb', 'feature/dark-mode', '1. Create dark theme color palette\n2. Add theme toggle component\n3. Persist user preference\n4. Apply theme across all pages', '2024-01-10', '2024-01-25 18:00:00', 16, 2880, 'CREATED', 'MEDIUM', FALSE, NOW(), NOW()),
('t6vq9v03-r34w-2w39-qw5x-2v2200x21sw7', 'c9ef2e36-a67f-5f62-9f8g-5e5523g54bf0', 'TASK', 'Implement push notifications', 'Add push notification support for mobile app to notify users of important updates', 'NOTIFICATIONS', '79558cc8-b70b-44ca-b9ef-67f7dc82588c', '79558cc8-b70b-44ca-b9ef-67f7dc82588c', 'feature/push-notifications', '1. Set up Firebase Cloud Messaging\n2. Request notification permissions\n3. Handle notification events\n4. Test on iOS and Android', '2024-01-12', '2024-01-30 19:00:00', 24, 4320, 'IN_PROGRESS', 'MEDIUM', FALSE, NOW(), NOW()),
('u7wr0w14-s45x-3x40-rx6y-3w3311y32tx8', 'd0fa3f47-b78g-6g73-ag9h-6f6634h65cg1', 'BUG', 'API rate limiting not working', 'The rate limiting middleware is not properly restricting API requests. Users can make unlimited requests.', 'API', 'c3965045-464e-4d89-bc03-0d692a050493', 'c3965045-464e-4d89-bc03-0d692a050493', 'fix/api-rate-limit', '1. Check rate limiting middleware\n2. Verify Redis connection\n3. Test with multiple requests\n4. Fix implementation', '2024-01-14', '2024-01-18 16:00:00', 6, 720, 'SOLVED', 'URGENT', FALSE, NOW(), NOW()),
('v8xs1x25-t56y-4y51-sy7z-4x4422z43uy9', 'd0fa3f47-b78g-6g73-ag9h-6f6634h65cg1', 'ISSUE', 'Database connection timeout', 'Production database is experiencing connection timeouts during peak hours. Need to investigate and optimize.', 'DATABASE', '66880b38-6631-4dd2-a66e-c07157675a35', 'c3965045-464e-4d89-bc03-0d692a050493', 'fix/db-timeout', '1. Check database connection pool\n2. Review slow query log\n3. Optimize queries\n4. Increase connection pool size if needed', '2024-01-13', '2024-01-19 17:00:00', 12, 1440, 'DEPENDENCY', 'HIGH', FALSE, NOW(), NOW()),
('w9yt2y36-u67z-5z62-tz8a-5y5533a54vz0', 'e1gb4g58-c89h-7h84-bh0i-7g7745i76dh2', 'TASK', 'Migrate user data to new schema', 'Migrate existing user data from legacy database to new schema format with data validation', 'MIGRATION', 'c3965045-464e-4d89-bc03-0d692a050493', 'e54e645b-8e0e-421f-9750-0d7824182bfb', 'migration/user-data', '1. Create migration script\n2. Validate data integrity\n3. Run migration in staging\n4. Execute production migration', '2024-01-11', '2024-01-22 20:00:00', 20, 2880, 'CREATED', 'MEDIUM', FALSE, NOW(), NOW());

-- ============================================================================
-- 8. TICKET TAGS (assigning tags to tickets)
-- ============================================================================
INSERT INTO ticket_tags (id, ticket_id, tag_id, created_at) VALUES
('x0zu3z47-v78a-6a73-ua9b-6z6644b65wa1', 'r4to7t81-p12u-0u17-ou3v-0t0088v09qu5', 'l8ni1n25-j56o-4o51-io7p-4n4422p43ko9', NOW()),
('y1av4a58-w89b-7b84-vb0c-7a7755c76xb2', 'r4to7t81-p12u-0u17-ou3v-0t0088v09qu5', 'n0pk3p47-l78q-6q73-kq9r-6p6644r65mq1', NOW()),
('z2bw5b69-x90c-8c95-wc1d-8b8866d87yc3', 's5up8u92-q23v-1v28-pv4w-1u1199w10rv6', 'l8ni1n25-j56o-4o51-io7p-4n4422p43ko9', NOW()),
('a3cx6c70-y01d-9d06-xd2e-9c9977e98zd4', 's5up8u92-q23v-1v28-pv4w-1u1199w10rv6', 'o1ql4q58-m89r-7r84-lr0s-7q7755s76nr2', NOW()),
('b4dy7d81-z12e-0e17-ye3f-0d0088f09ae5', 't6vq9v03-r34w-2w39-qw5x-2v2200x21sw7', 'o1ql4q58-m89r-7r84-lr0s-7q7755s76nr2', NOW()),
('c5ez8e92-a23f-1f28-zf4g-1e1199g10bf6', 'u7wr0w14-s45x-3x40-rx6y-3w3311y32tx8', 'm9oj2o36-k67p-5p62-jp8q-5o5533q54lp0', NOW()),
('d6fa9f03-b34g-2g39-ag5h-2f2200h21cg7', 'u7wr0w14-s45x-3x40-rx6y-3w3311y32tx8', 'n0pk3p47-l78q-6q73-kq9r-6p6644r65mq1', NOW()),
('e7gb0g14-c45h-3h40-bh6i-3g3311i32dh8', 'u7wr0w14-s45x-3x40-rx6y-3w3311y32tx8', 'p2rm5r69-n90s-8s95-ms1t-8r8866t87os3', NOW()),
('f8hc1h25-d56i-4i51-ci7j-4h4422j43ei9', 'v8xs1x25-t56y-4y51-sy7z-4x4422z43uy9', 'm9oj2o36-k67p-5p62-jp8q-5o5533q54lp0', NOW()),
('g9id2i36-e67j-5j62-dj8k-5i5533k54fj0', 'w9yt2y36-u67z-5z62-tz8a-5y5533a54vz0', 'q3sn6s70-o01t-9t06-nt2u-9s9977u98pt4', NOW());

-- ============================================================================
-- 9. TICKET COMMENTS (4 comments)
-- ============================================================================
INSERT INTO ticket_comments (id, ticket_id, user_id, comment_text, mentioned_user_ids, created_at, updated_at) VALUES
('h0je3j47-f78k-6k73-ek9l-6j6644l65gk1', 'r4to7t81-p12u-0u17-ou3v-0t0088v09qu5', 'c3965045-464e-4d89-bc03-0d692a050493', 'I have started investigating this issue. It seems to be related to touch event handling on mobile devices.', JSON_ARRAY('e54e645b-8e0e-421f-9750-0d7824182bfb'), NOW(), NOW()),
('i1kf4k58-g89l-7l84-fl0m-7k7755m76hl2', 's5up8u92-q23v-1v28-pv4w-1u1199w10rv6', 'e54e645b-8e0e-421f-9750-0d7824182bfb', 'I have created the initial design mockups for dark mode. Please review and provide feedback.', JSON_ARRAY('66880b38-6631-4dd2-a66e-c07157675a35'), NOW(), NOW()),
('j2lg5l69-h90m-8m95-gm1n-8l8866n87im3', 'u7wr0w14-s45x-3x40-rx6y-3w3311y32tx8', 'c3965045-464e-4d89-bc03-0d692a050493', 'Fixed the rate limiting issue. The Redis connection was not being properly initialized. All tests are passing now.', NULL, NOW(), NOW()),
('k3mh6m70-i01n-9n06-hn2o-9m9977o98jn4', 'v8xs1x25-t56y-4y51-sy7z-4x4422z43uy9', 'c3965045-464e-4d89-bc03-0d692a050493', 'Waiting for database team to provide access to connection pool configuration. @66880b38-6631-4dd2-a66e-c07157675a35 can you help with this?', JSON_ARRAY('66880b38-6631-4dd2-a66e-c07157675a35'), NOW(), NOW());

-- ============================================================================
-- 10. TICKET ATTACHMENTS (2 attachments)
-- ============================================================================
INSERT INTO ticket_attachments (id, ticket_id, comment_id, filename, original_filename, file_path, file_size, mime_type, uploaded_by, created_at) VALUES
('l4ni7n81-j12o-0o17-io3p-0n0088p09ko5', 's5up8u92-q23v-1v28-pv4w-1u1199w10rv6', 'i1kf4k58-g89l-7l84-fl0m-7k7755m76hl2', 'dark-mode-mockup-1234567890.png', 'dark-mode-mockup.png', '/uploads/dark-mode-mockup-1234567890.png', 245760, 'image/png', 'e54e645b-8e0e-421f-9750-0d7824182bfb', NOW()),
('m5oj8o92-k23p-1p28-jp4q-1o1199q10lp6', 'r4to7t81-p12u-0u17-ou3v-0t0088v09qu5', NULL, 'mobile-bug-screenshot-1234567891.jpg', 'mobile-bug-screenshot.jpg', '/uploads/mobile-bug-screenshot-1234567891.jpg', 189440, 'image/jpeg', 'e54e645b-8e0e-421f-9750-0d7824182bfb', NOW());

-- ============================================================================
-- 11. TICKET RELATIONSHIPS (3 relationships)
-- ============================================================================
INSERT INTO ticket_relationships (id, ticket_id, related_ticket_id, relationship_type, created_by, created_at) VALUES
('n6pk9p03-l34q-2q39-kq5r-2p2200r21mq7', 'r4to7t81-p12u-0u17-ou3v-0t0088v09qu5', 's5up8u92-q23v-1v28-pv4w-1u1199w10rv6', 'RELATES_TO', 'c3965045-464e-4d89-bc03-0d692a050493', NOW()),
('o7ql0q14-m45r-3r40-lr6s-3q3311s32nr8', 'v8xs1x25-t56y-4y51-sy7z-4x4422z43uy9', 'u7wr0w14-s45x-3x40-rx6y-3w3311y32tx8', 'BLOCKED_BY', 'c3965045-464e-4d89-bc03-0d692a050493', NOW()),
('p8rm1r25-n56s-4s51-ms7t-4r4422t43os9', 'w9yt2y36-u67z-5z62-tz8a-5y5533a54vz0', 'v8xs1x25-t56y-4y51-sy7z-4x4422z43uy9', 'RELATES_TO', 'c3965045-464e-4d89-bc03-0d692a050493', NOW());

-- ============================================================================
-- 12. TICKET WATCHERS (4 watchers)
-- ============================================================================
INSERT INTO ticket_watchers (id, ticket_id, user_id, created_at) VALUES
('q9sn2s36-o67t-5t62-nt8u-5s5533u54pt0', 'r4to7t81-p12u-0u17-ou3v-0t0088v09qu5', '66880b38-6631-4dd2-a66e-c07157675a35', NOW()),
('r0to3t47-p78u-6u73-ou9v-6t6644v65qu1', 's5up8u92-q23v-1v28-pv4w-1u1199w10rv6', '66880b38-6631-4dd2-a66e-c07157675a35', NOW()),
('s1up4u58-q89v-7v84-pv0w-7u7755w76rv2', 'u7wr0w14-s45x-3x40-rx6y-3w3311y32tx8', '79558cc8-b70b-44ca-b9ef-67f7dc82588c', NOW()),
('t2vq5v69-r90w-8w95-qw1x-8v8866x87sw3', 'v8xs1x25-t56y-4y51-sy7z-4x4422z43uy9', 'c3965045-464e-4d89-bc03-0d692a050493', NOW());

-- ============================================================================
-- 13. TICKET TIME LOGS (4 time logs)
-- ============================================================================
INSERT INTO ticket_time_logs (id, ticket_id, user_id, hours, description, logged_date, created_at, updated_at) VALUES
('u3wr6w70-s01x-9x06-rx2y-9w9977y98tx4', 'r4to7t81-p12u-0u17-ou3v-0t0088v09qu5', 'c3965045-464e-4d89-bc03-0d692a050493', 2.5, 'Initial investigation and debugging', '2024-01-16', NOW(), NOW()),
('v4xs7x81-t12y-0y17-sy3z-0x0088z09uy5', 's5up8u92-q23v-1v28-pv4w-1u1199w10rv6', 'e54e645b-8e0e-421f-9750-0d7824182bfb', 4.0, 'Created dark mode design mockups', '2024-01-11', NOW(), NOW()),
('w5yt8y92-u23z-1z28-tz4a-1y1199a10vz6', 'u7wr0w14-s45x-3x40-rx6y-3w3311y32tx8', 'c3965045-464e-4d89-bc03-0d692a050493', 3.0, 'Fixed rate limiting middleware and tested', '2024-01-15', NOW(), NOW()),
('x6zu9z03-v34a-2a39-ua5b-2z2200b21wa7', 't6vq9v03-r34w-2w39-qw5x-2v2200x21sw7', '79558cc8-b70b-44ca-b9ef-67f7dc82588c', 5.5, 'Set up Firebase Cloud Messaging and initial implementation', '2024-01-13', NOW(), NOW());

-- ============================================================================
-- 14. TICKET ACTIVITIES (6 activities - sample of auto-generated activities)
-- ============================================================================
INSERT INTO ticket_activities (id, ticket_id, user_id, activity_type, old_value, new_value, description, created_at) VALUES
('y7av0a14-w45b-3b40-vb6c-3a3311c32xb8', 'r4to7t81-p12u-0u17-ou3v-0t0088v09qu5', 'c3965045-464e-4d89-bc03-0d692a050493', 'STATUS_CHANGED', 'CREATED', 'IN_PROGRESS', 'Status changed from CREATED to IN_PROGRESS', NOW()),
('z8bw1b25-x56c-4c51-wc7d-4b4422d43yc9', 's5up8u92-q23v-1v28-pv4w-1u1199w10rv6', 'e54e645b-8e0e-421f-9750-0d7824182bfb', 'COMMENT_ADDED', NULL, NULL, 'Comment added to ticket', NOW()),
('a9cx2c36-y67d-5d62-xd8e-5c5533e54zd0', 'u7wr0w14-s45x-3x40-rx6y-3w3311y32tx8', 'c3965045-464e-4d89-bc03-0d692a050493', 'STATUS_CHANGED', 'IN_PROGRESS', 'SOLVED', 'Status changed from IN_PROGRESS to SOLVED', NOW()),
('b0dy3d47-z78e-6e73-ye9f-6d6644f65ae1', 'v8xs1x25-t56y-4y51-sy7z-4x4422z43uy9', 'c3965045-464e-4d89-bc03-0d692a050493', 'STATUS_CHANGED', 'IN_PROGRESS', 'DEPENDENCY', 'Status changed from IN_PROGRESS to DEPENDENCY', NOW()),
('c1ez4e58-a89f-7f84-zf0g-7e7755g76bf2', 'r4to7t81-p12u-0u17-ou3v-0t0088v09qu5', 'c3965045-464e-4d89-bc03-0d692a050493', 'ASSIGNEE_CHANGED', 'e54e645b-8e0e-421f-9750-0d7824182bfb', 'c3965045-464e-4d89-bc03-0d692a050493', 'Assignee changed from Emily Davis to Mike Anderson', NOW()),
('d2fa5f69-b90g-8g95-ag1h-8f8866h87cg3', 's5up8u92-q23v-1v28-pv4w-1u1199w10rv6', 'e54e645b-8e0e-421f-9750-0d7824182bfb', 'TAG_ADDED', NULL, 'Frontend', 'Tag "Frontend" added to ticket', NOW());

-- ============================================================================
-- 15. NOTIFICATIONS (6 notifications)
-- ============================================================================
INSERT INTO notifications (id, user_id, title, message, type, related_entity_type, related_entity_id, is_read, read_at, created_at) VALUES
('e3gb6g70-c01h-9h06-bh2i-9g9977i98dh4', 'c3965045-464e-4d89-bc03-0d692a050493', 'New Ticket Assigned', 'You have been assigned to ticket: Login button not working on mobile', 'ticket_assigned', 'ticket', 'r4to7t81-p12u-0u17-ou3v-0t0088v09qu5', FALSE, NULL, NOW()),
('f4hc7h81-d12i-0i17-ci3j-0h0088j09ei5', 'e54e645b-8e0e-421f-9750-0d7824182bfb', 'New Ticket Assigned', 'You have been assigned to ticket: Add dark mode support', 'ticket_assigned', 'ticket', 's5up8u92-q23v-1v28-pv4w-1u1199w10rv6', FALSE, NULL, NOW()),
('g5id8i92-e23j-1j28-dj4k-1i1199k10fj6', 'c3965045-464e-4d89-bc03-0d692a050493', 'Mentioned in Comment', 'Emily Davis mentioned you in a comment on ticket: Login button not working on mobile', 'mention', 'comment', 'h0je3j47-f78k-6k73-ek9l-6j6644l65gk1', TRUE, NOW(), NOW()),
('h6je9j03-f34k-2k39-ek5l-2j2200l21gk7', '66880b38-6631-4dd2-a66e-c07157675a35', 'Mentioned in Comment', 'Emily Davis mentioned you in a comment on ticket: Add dark mode support', 'mention', 'comment', 'i1kf4k58-g89l-7l84-fl0m-7k7755m76hl2', FALSE, NULL, NOW()),
('i7kf0k14-g45l-3l40-fl6m-3k3311m32hl8', '66880b38-6631-4dd2-a66e-c07157675a35', 'Mentioned in Comment', 'Mike Anderson mentioned you in a comment on ticket: Database connection timeout', 'mention', 'comment', 'k3mh6m70-i01n-9n06-hn2o-9m9977o98jn4', FALSE, NULL, NOW()),
('j8lg1l25-h56m-4m51-gm7n-4l4422n43im9', 'e54e645b-8e0e-421f-9750-0d7824182bfb', 'New Comment', 'Mike Anderson added a comment to ticket: Login button not working on mobile', 'comment_added', 'ticket', 'r4to7t81-p12u-0u17-ou3v-0t0088v09qu5', FALSE, NULL, NOW());

-- ============================================================================
-- 16. SAVED FILTERS (3 saved filters)
-- ============================================================================
INSERT INTO saved_filters (id, user_id, name, filter_data, is_shared, created_at, updated_at) VALUES
('k9mh2m36-i67n-5n62-hn8o-5m5533o54jn0', 'c3965045-464e-4d89-bc03-0d692a050493', 'My Assigned Tickets', JSON_OBJECT('assigned_to_me', true, 'status', 'IN_PROGRESS'), FALSE, NOW(), NOW()),
('l0ni3n47-j78o-6o73-io9p-6n6644p65ko1', '66880b38-6631-4dd2-a66e-c07157675a35', 'High Priority Bugs', JSON_OBJECT('priority', 'HIGH', 'type', 'BUG'), TRUE, NOW(), NOW()),
('m1oj4o58-k89p-7p84-jp0q-7o7755q76lp2', 'e54e645b-8e0e-421f-9750-0d7824182bfb', 'Frontend Tasks', JSON_OBJECT('module', 'UI', 'status', 'CREATED'), FALSE, NOW(), NOW());

-- ============================================================================
-- 17. TICKET TEMPLATES (4 templates)
-- ============================================================================
INSERT INTO ticket_templates (id, name, description, type, priority, default_title, default_description, default_module, created_by, is_shared, created_at, updated_at) VALUES
('n2pk5p69-l90q-8q95-kq1r-8p8866r87mq3', 'Bug Report Template', 'Standard template for reporting bugs', 'BUG', 'MEDIUM', 'Bug: [Brief Description]', '## Description\n\n## Steps to Reproduce\n1. \n2. \n3. \n\n## Expected Behavior\n\n## Actual Behavior\n\n## Environment\n- Browser: \n- OS: \n- Version: ', 'FRONTEND', 'c3965045-464e-4d89-bc03-0d692a050493', TRUE, NOW(), NOW()),
('o3ql6q70-m01r-9r06-lr2s-9q9977s98nr4', 'Feature Request Template', 'Template for new feature requests', 'SUGGESTION', 'MEDIUM', 'Feature: [Feature Name]', '## Feature Description\n\n## Use Case\n\n## Benefits\n\n## Implementation Notes', 'UI', '66880b38-6631-4dd2-a66e-c07157675a35', TRUE, NOW(), NOW()),
('p4rm7r81-n12s-0s17-ms3t-0r0088t09os5', 'API Integration Task', 'Template for API integration tasks', 'TASK', 'HIGH', 'API Integration: [Service Name]', '## Integration Details\n\n## Endpoints\n\n## Authentication\n\n## Data Format\n\n## Error Handling', 'API', 'c3965045-464e-4d89-bc03-0d692a050493', FALSE, NOW(), NOW()),
('q5sn8s92-o23t-1t28-nt4u-1s1199u10pt6', 'Database Migration', 'Template for database migration tasks', 'TASK', 'HIGH', 'Migration: [Description]', '## Migration Scope\n\n## Source Schema\n\n## Target Schema\n\n## Data Validation\n\n## Rollback Plan', 'DATABASE', '66880b38-6631-4dd2-a66e-c07157675a35', TRUE, NOW(), NOW());

-- ============================================================================
-- 18. USER PREFERENCES (preferences for all users)
-- ============================================================================
INSERT INTO user_preferences (id, user_id, theme_mode, color_scheme, email_notifications, push_notifications, created_at, updated_at) VALUES
('r6to9t03-p34u-2u39-ou5v-2t2200v21qu7', '11111111-1111-1111-1111-111111111111', 'dark', 'salla', TRUE, TRUE, NOW(), NOW()),
('s7up0u14-q45v-3v40-pv6w-3u3311w32rv8', '66880b38-6631-4dd2-a66e-c07157675a35', 'dark', 'salla', TRUE, TRUE, NOW(), NOW()),
('t8vq1v25-r56w-4w51-qw7x-4v4422x43sw9', '79558cc8-b70b-44ca-b9ef-67f7dc82588c', 'light', 'salla', TRUE, FALSE, NOW(), NOW()),
('u9wr2w36-s67x-5x62-rx8y-5w5533y54tx0', 'c3965045-464e-4d89-bc03-0d692a050493', 'dark', 'salla', TRUE, TRUE, NOW(), NOW()),
('v0xs3x47-t78y-6y73-sy9z-6x6644z65uy1', 'e54e645b-8e0e-421f-9750-0d7824182bfb', 'dark', 'salla', TRUE, TRUE, NOW(), NOW());

-- ============================================================================
-- 19. REFRESH TOKENS (optional - will be generated on login)
-- ============================================================================
-- Refresh tokens are typically generated dynamically on login
-- Sample tokens can be added here if needed for testing

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- Organizations: 2
-- Teams: 3
-- Users: 5 (1 Super Admin, 2 Org Admins, 1 Team Lead, 1 User)
-- Projects: 4
-- Project Members: 6
-- Tags: 6
-- Tickets: 6
-- Ticket Tags: 10
-- Ticket Comments: 4
-- Ticket Attachments: 2
-- Ticket Relationships: 3
-- Ticket Watchers: 4
-- Ticket Time Logs: 4
-- Ticket Activities: 6
-- Notifications: 6
-- Saved Filters: 3
-- Ticket Templates: 4
-- User Preferences: 5
-- Refresh Tokens: 0 (generated on login)
--
-- Default password for all users: 'password123'
--
-- Login Credentials:
--   - Super Admin: admin@tracker.com / password123
--   - Org Admin 1: john.smith@techcorp.com / password123
--   - Org Admin 2: sarah.johnson@digitalinnovations.com / password123
--   - Team Lead: mike.anderson@techcorp.com / password123
--   - User: emily.davis@techcorp.com / password123
-- ============================================================================
