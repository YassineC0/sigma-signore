import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    console.log("Auth check API called")

    const result = await verifyAdminToken(request)
    console.log("Auth verification result:", { success: result.success, error: result.error })

    if (result.success && result.admin) {
      return NextResponse.json({
        isAuthenticated: true,
        user: result.admin,
      })
    } else {
      return NextResponse.json({
        isAuthenticated: false,
        error: result.error,
      })
    }
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({
      isAuthenticated: false,
      error: "Internal server error",
    })
  }
}
