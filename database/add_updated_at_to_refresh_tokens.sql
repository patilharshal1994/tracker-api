-- Migration: Add updated_at column to refresh_tokens table
-- Run this if you have an existing database without this column

USE issue_tracker;

-- Add updated_at column to refresh_tokens table
ALTER TABLE refresh_tokens 
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Verify the column was added
DESCRIBE refresh_tokens;
