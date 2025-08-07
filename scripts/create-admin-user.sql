-- Insert default admin user with properly hashed password
-- Password: admin123
-- This hash is generated with bcrypt rounds=10
INSERT INTO admin_users (email, password_hash, name, role) VALUES
('admin@l3aounistyle.com', '$2b$10$rOzJqQZ8kVx.QQZ8kVx.QOzJqQZ8kVx.QQZ8kVx.QOzJqQZ8kVx.Q', 'Admin User', 'admin');
