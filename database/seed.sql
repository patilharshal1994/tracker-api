-- Seed Data for Issue Tracker
USE issue_tracker;

-- Insert Teams
INSERT INTO teams (name) VALUES ('Development Team');

-- Insert Users (passwords are 'password123' hashed with bcrypt)
-- Admin: admin@tracker.com / password123
-- User1: user1@tracker.com / password123
-- User2: user2@tracker.com / password123
INSERT INTO users (name, email, password_hash, role, team_id, is_active) VALUES
('Admin User', 'admin@tracker.com', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'ADMIN', 1, TRUE),
('John Doe', 'user1@tracker.com', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'USER', 1, TRUE),
('Jane Smith', 'user2@tracker.com', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'USER', 1, TRUE);

-- Note: The password hashes above are placeholders. 
-- In production, use bcrypt to generate proper hashes for 'password123'
-- Example: bcrypt.hashSync('password123', 10)

-- Insert Project
INSERT INTO projects (name, description, created_by, team_id) VALUES
('Website Redesign', 'Complete redesign of company website with modern UI/UX', 1, 1);

-- Add project members
INSERT INTO project_members (project_id, user_id) VALUES
(1, 1), -- Admin
(1, 2), -- User1
(1, 3); -- User2

-- Insert Sample Tickets
INSERT INTO tickets (project_id, type, title, description, reporter_id, assignee_id, status, priority, due_date) VALUES
(1, 'TASK', 'Design new homepage layout', 'Create wireframes and mockups for the new homepage', 1, 2, 'IN_PROGRESS', 'HIGH', DATE_ADD(NOW(), INTERVAL 7 DAY)),
(1, 'BUG', 'Fix mobile menu not working', 'Mobile navigation menu is not responsive on iOS devices', 2, 3, 'CREATED', 'MEDIUM', DATE_ADD(NOW(), INTERVAL 3 DAY)),
(1, 'SUGGESTION', 'Add dark mode support', 'Implement dark mode toggle for better user experience', 3, NULL, 'CREATED', 'LOW', DATE_ADD(NOW(), INTERVAL 14 DAY));
