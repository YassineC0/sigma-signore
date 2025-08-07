import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    console.log("Debug: Checking admin users in database")

    // Get all admin users
    const { data: admins, error } = await supabaseAdmin
      .from("admin_users")
      .select("id, username, name, role, created_at")

    console.log("Debug: Admin users query result:", { admins, error })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      admins: admins || [],
      count: admins?.length || 0,
    })
  } catch (error) {
    console.error("Debug check admin error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
