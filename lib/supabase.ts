import { createClient } from "@supabase/supabase-js"

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Create client with error handling
export const supabase = (() => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "Supabase client: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
    )
    return null
  }
  return createClient(supabaseUrl, supabaseAnonKey)
})()

// Server-side client (for API routes)
export const supabaseAdmin = (() => {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error(
      "Supabase admin client: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.",
    )
    return null
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey)
})()
