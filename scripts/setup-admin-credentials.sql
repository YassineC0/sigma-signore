-- Create the admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    last_login TIMESTAMPTZ,
    session_token TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Delete existing admin user if it exists
DELETE FROM public.admin_users WHERE username = 'admin';

-- Insert a new admin user with a bcrypt-hashed password
-- Replace this with a real bcrypt hash of your password (e.g., from Node.js)
INSERT INTO public.admin_users (username, password_hash)
VALUES (
  'admin',
  '$2a$10$FiN5XL9ipBhOfz8fz6q9yOvpiX4iVw0X9b1VK0Y.RbdtSxK42IL2S'  -- password: admin
);

-- OPTIONAL: Grant read-only to authenticated role
-- ⚠️ Avoid granting full access to anon unless needed
GRANT SELECT, INSERT, UPDATE ON public.admin_users TO authenticated;
-- Do NOT grant to anon unless your app is intentionally public-facing
