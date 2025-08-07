import bcrypt from 'bcryptjs'

async function createAdminUser() {
  const password = 'admin'
  const saltRounds = 10
  
  try {
    const hash = await bcrypt.hash(password, saltRounds)
    console.log('Password hash for "admin":', hash)
    
    // Test the hash
    const isValid = await bcrypt.compare(password, hash)
    console.log('Hash validation test:', isValid)
    
    console.log('\nSQL to create admin user:')
    console.log(`INSERT INTO admin_users (id, username, password_hash, name, role, created_at, updated_at)
VALUES (
  '01b3f40f-154c-4f7c-a266-f5fb528ab235',
  'admin',
  '${hash}',
  'Administrator',
  'admin',
  NOW(),
  NOW()
);`)
    
  } catch (error) {
    console.error('Error creating hash:', error)
  }
}

createAdminUser()
