import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function POST() {
  try {
    console.log("=== SETTING UP ADMIN PASSWORD ===")

    // Hash the password 'admin' properly
    const password = "admin"
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    console.log("Generated hash:", hashedPassword)

    // Update the admin user with the proper hash
    const { data, error } = await supabaseAdmin
      .from("admin_users")
      .update({
        password_hash: hashedPassword,
        last_login: null,
        session_token: null,
      })
      .eq("username", "admin")
      .select()

    if (error) {
      console.error("Update error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("Updated admin user:", data)

    // Verify the update worked
    const { data: verifyUser, error: verifyError } = await supabaseAdmin
      .from("admin_users")
      .select("*")
      .eq("username", "admin")
      .single()

    if (verifyError) {
      console.error("Verification error:", verifyError)
      return NextResponse.json({ error: verifyError.message }, { status: 500 })
    }

    console.log("Verified user:", verifyUser)

    // Test password verification
    const passwordTest = await bcrypt.compare(password, verifyUser.password_hash)
    console.log("Password test result:", passwordTest)

    return NextResponse.json({
      success: true,
      message: "Admin password set successfully",
      credentials: {
        username: "admin",
        password: "admin",
      },
      hash_generated: hashedPassword,
      password_test: passwordTest,
      user: verifyUser,
    })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json(
      {
        error: "Setup failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
