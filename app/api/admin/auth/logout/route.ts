import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get("admin-token")?.value

    if (token) {
      // Clear session token from database
      await supabaseAdmin.from("admin_users").update({ session_token: null }).eq("session_token", token)
    }

    const response = NextResponse.json({ success: true })

    // Clear the cookie
    response.cookies.set("admin-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Expire immediately
    })

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
