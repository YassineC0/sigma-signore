import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    console.log("=== DEBUG LOGIN ===")
    console.log("Username:", username)
    console.log("Password:", password)

    // Query admin table using username
    const { data: admin, error } = await supabaseAdmin.from("admin_users").select("*").eq("username", username).single()

    console.log("Database query error:", error)
    console.log("Admin found:", admin)

    if (error || !admin) {
      return NextResponse.json({
        step: "user_fetch",
        error: error?.message || "User not found",
        username: username,
      })
    }

    // Test password verification
    console.log("Stored hash:", admin.password_hash)
    console.log("Password to verify:", password)

    const isValidPassword = await bcrypt.compare(password, admin.password_hash)
    console.log("Password verification result:", isValidPassword)

    // Test with a fresh hash
    const testHash = await bcrypt.hash(password, 10)
    const testVerification = await bcrypt.compare(password, testHash)
    console.log("Test hash:", testHash)
    console.log("Test verification:", testVerification)

    return NextResponse.json({
      step: "password_verification",
      user_found: true,
      admin: {
        id: admin.id,
        username: admin.username,
      },
      stored_hash: admin.password_hash,
      password_verification: isValidPassword,
      test_hash: testHash,
      test_verification: testVerification,
    })
  } catch (error) {
    console.error("Debug login error:", error)
    return NextResponse.json({
      error: "Debug failed",
      details: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
