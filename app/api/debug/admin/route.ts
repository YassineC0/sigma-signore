import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    console.log("=== DEBUGGING ADMIN SETUP ===")

    // 1. Check if admin_users table exists and get all users
    const { data: users, error: usersError } = await supabaseAdmin.from("admin_users").select("*")

    console.log("Users query error:", usersError)
    console.log("Users found:", users)

    // 2. Check environment variables
    const envCheck = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing",
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing",
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Set" : "❌ Missing",
      jwtSecret: process.env.JWT_SECRET ? "✅ Set" : "❌ Missing",
    }

    // 3. Test password hashing
    const testPassword = "admin123"
    const testHash = await bcrypt.hash(testPassword, 10)
    const testVerify = await bcrypt.compare(testPassword, testHash)

    console.log("Password test:", {
      password: testPassword,
      hash: testHash,
      verification: testVerify,
    })

    return NextResponse.json({
      step1_users: users,
      step1_error: usersError,
      step2_environment: envCheck,
      step3_password_test: {
        password: testPassword,
        hash: testHash,
        verification: testVerify,
      },
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json(
      {
        error: "Debug failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    console.log("=== CREATING ADMIN USER ===")

    // Delete existing admin user first
    await supabaseAdmin.from("admin_users").delete().eq("email", "admin@l3aounistyle.com")

    // Create new hash
    const password = "admin123"
    const hashedPassword = await bcrypt.hash(password, 10)

    console.log("Creating user with hash:", hashedPassword)

    // Insert new admin user
    const { data, error } = await supabaseAdmin
      .from("admin_users")
      .insert([
        {
          email: "admin@l3aounistyle.com",
          password_hash: hashedPassword,
          name: "Admin User",
          role: "admin",
        },
      ])
      .select()

    if (error) {
      console.error("Insert error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("User created:", data)

    // Verify the user was created correctly
    const { data: verifyUser } = await supabaseAdmin
      .from("admin_users")
      .select("*")
      .eq("email", "admin@l3aounistyle.com")
      .single()

    console.log("Verification:", verifyUser)

    // Test password verification
    const passwordTest = await bcrypt.compare(password, verifyUser?.password_hash || "")

    return NextResponse.json({
      success: true,
      user: verifyUser,
      passwordTest: passwordTest,
      credentials: {
        email: "admin@l3aounistyle.com",
        password: "admin123",
      },
    })
  } catch (error) {
    console.error("Creation error:", error)
    return NextResponse.json(
      {
        error: "Creation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
