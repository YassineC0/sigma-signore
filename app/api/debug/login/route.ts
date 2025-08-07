import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    console.log("=== LOGIN DEBUG ===")
    console.log("Attempting login with:", { email, password })

    // 1. Check if user exists
    const { data: admin, error: fetchError } = await supabaseAdmin
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .single()

    console.log("Fetch error:", fetchError)
    console.log("Admin found:", admin)

    if (fetchError || !admin) {
      return NextResponse.json(
        {
          step: "user_fetch",
          error: fetchError?.message || "User not found",
          email: email,
        },
        { status: 404 },
      )
    }

    // 2. Test password verification
    console.log("Testing password verification...")
    console.log("Provided password:", password)
    console.log("Stored hash:", admin.password_hash)

    const isValidPassword = await bcrypt.compare(password, admin.password_hash)
    console.log("Password verification result:", isValidPassword)

    // 3. Additional hash tests
    const testHash = await bcrypt.hash(password, 10)
    const testVerification = await bcrypt.compare(password, testHash)

    console.log("Test hash:", testHash)
    console.log("Test verification:", testVerification)

    return NextResponse.json({
      step: "password_verification",
      user_found: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      password_verification: isValidPassword,
      test_hash: testHash,
      test_verification: testVerification,
      stored_hash: admin.password_hash,
    })
  } catch (error) {
    console.error("Login debug error:", error)
    return NextResponse.json(
      {
        error: "Debug failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
