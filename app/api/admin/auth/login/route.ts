import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "XDNIGGA"

export async function POST(request: NextRequest) {
  try {
    console.log("Login API called")

    const { username, password } = await request.json()
    console.log("Login request data:", { username, password: password ? "***" : "empty" })

    if (!username || !password) {
      console.log("Missing username or password")
      return NextResponse.json({ error: "Nom d'utilisateur et mot de passe requis" }, { status: 400 })
    }

    // Check if supabase is configured
    if (!supabaseAdmin) {
      console.log("Supabase not configured")
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    console.log("Looking up admin with username:", username)

    // Select all columns that exist in your schema
    const { data: admin, error } = await supabaseAdmin
      .from("admin_users")
      .select("id, username, password_hash, name, role")
      .eq("username", username)
      .single()

    console.log("Admin lookup result:", {
      found: !!admin,
      error: error ? error.message : null,
      adminId: admin?.id,
    })

    if (error) {
      console.log("Admin lookup error:", error)
      return NextResponse.json({ error: "Nom d'utilisateur ou mot de passe incorrect" }, { status: 401 })
    }

    if (!admin) {
      console.log("No admin found with username:", username)
      return NextResponse.json({ error: "Nom d'utilisateur ou mot de passe incorrect" }, { status: 401 })
    }

    console.log("Comparing password with hash")
    const isValidPassword = await bcrypt.compare(password, admin.password_hash)
    console.log("Password validation result:", isValidPassword)

    if (!isValidPassword) {
      console.log("Invalid password for user:", username)
      return NextResponse.json({ error: "Nom d'utilisateur ou mot de passe incorrect" }, { status: 401 })
    }

    // Create a JWT token with UUID adminId
    console.log("Creating JWT token for admin ID:", admin.id)
    const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: "7d" })
    console.log("JWT token created successfully")

    // Update last login and session token
    console.log("Updating admin last login")
    const { error: updateError } = await supabaseAdmin
      .from("admin_users")
      .update({
        last_login: new Date().toISOString(),
        session_token: token,
        updated_at: new Date().toISOString(),
      })
      .eq("id", admin.id)

    if (updateError) {
      console.log("Update error:", updateError)
    } else {
      console.log("Admin last login updated successfully")
    }

    const responseData = {
      success: true,
      user: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        role: admin.role,
        token: token, // Include token in response for localStorage
      },
    }

    console.log("Sending successful login response")
    const response = NextResponse.json(responseData)

    // Set JWT in cookie as well
    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    console.log("Login successful for admin:", admin.username)
    return response
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
