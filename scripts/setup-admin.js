// Run this script to create the admin user with proper password hashing
// Usage: node scripts/setup-admin.js

const bcrypt = require("bcryptjs")

async function generateAdminHash() {
  const password = "admin123"
  const hash = await bcrypt.hash(password, 10)

  console.log("=== ADMIN SETUP ===")
  console.log("Email: admin@l3aounistyle.com")
  console.log("Password: admin123")
  console.log("Hash:", hash)
  console.log("\n=== SQL TO RUN IN SUPABASE ===")
  console.log(
    `INSERT INTO admin_users (email, password_hash, name, role) VALUES ('admin@l3aounistyle.com', '${hash}', 'Admin User', 'admin');`,
  )
}

generateAdminHash().catch(console.error)
