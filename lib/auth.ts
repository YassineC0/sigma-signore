import type { NextRequest } from "next/server"
import { supabaseAdmin } from "./supabase"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "XDNIGGA"

export interface AdminUser {
  id: string // UUID, not number
  username: string
  name?: string
  role?: string
}

export async function verifyAdminToken(
  request: NextRequest,
): Promise<{ success: boolean; admin?: AdminUser; error?: string }> {
  try {
    // Try to get token from Authorization header first
    const authHeader = request.headers.get("authorization")
    let token = authHeader?.replace("Bearer ", "")

    // If no token in header, try cookies
    if (!token) {
      token = request.cookies.get("admin-token")?.value
    }

    console.log("Token received for verification:", token ? "Token exists" : "No token")

    if (!token || token === "null" || token === "undefined") {
      console.log("No valid token found")
      return { success: false, error: "No token provided" }
    }

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET) as any
      console.log("Token decoded successfully, adminId:", decoded.adminId)

      // Check if supabaseAdmin is configured before using it
      if (!supabaseAdmin) {
        console.log("Supabase admin client not configured. Check SUPABASE_SERVICE_ROLE_KEY.")
        return { success: false, error: "Database client not configured" }
      }

      // Get admin from database using the adminId from JWT
      const { data: admin, error } = await supabaseAdmin
        .from("admin_users")
        .select("id, username, name, role")
        .eq("id", decoded.adminId)
        .single()

      console.log("Database query result:", { admin: admin ? "Found" : "Not found", error })

      if (error) {
        console.log("Database error:", error)
        return { success: false, error: `Database error: ${error.message}` }
      }

      if (!admin) {
        console.log("Admin not found in database")
        return { success: false, error: "Admin not found" }
      }

      return {
        success: true,
        admin: {
          id: admin.id,
          username: admin.username,
          name: admin.name,
          role: admin.role,
        },
      }
    } catch (jwtError: any) {
      console.log("JWT verification failed:", jwtError.message)
      // If token is invalid, clear it and return error
      return { success: false, error: "Invalid or expired token" }
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return { success: false, error: "Token verification failed" }
  }
}

export async function requireAdmin(request: NextRequest): Promise<AdminUser> {
  const result = await verifyAdminToken(request)
  if (!result.success || !result.admin) {
    console.error("Admin authentication failed:", result.error)
    throw new Error(`Unauthorized: ${result.error}`)
  }
  return result.admin
}

export async function getAdminFromRequest(request: NextRequest): Promise<AdminUser | null> {
  const result = await verifyAdminToken(request)
  return result.admin || null
}
