-- First, let's see what's currently in the admin_users table
SELECT * FROM admin_users;

-- Delete any existing admin users to start fresh
DELETE FROM admin_users;

-- Create a new admin user with a known UUID
INSERT INTO admin_users (id, username, password_hash, name, role, created_at, updated_at)
VALUES (
  '01b3f40f-154c-4f7c-a266-f5fb528ab235',
  'admin',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Administrator',
  'admin',
  NOW(),
  NOW()
);

-- Verify the admin was created
SELECT id, username, name, role, created_at FROM admin_users;
