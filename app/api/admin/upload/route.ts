import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminToken } from "@/lib/auth"
import { uploadImageToS3 } from "@/lib/aws-s3"

export async function POST(request: NextRequest) {
  try {
    console.log("Upload request received")

    // Verify admin authentication
    const authResult = await verifyAdminToken(request)
    console.log("Auth result for upload:", { success: authResult.success, error: authResult.error })

    if (!authResult.success || !authResult.admin) {
      return NextResponse.json({ error: `Unauthorized: ${authResult.error}` }, { status: 401 })
    }

    console.log("Admin authenticated:", authResult.admin.username)

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("File received:", { name: file.name, type: file.type, size: file.size })

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and AVIF are allowed." },
        { status: 400 },
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 })
    }

    console.log("Uploading to S3...")
    const result = await uploadImageToS3(file, "products")
    console.log("S3 upload successful:", result.url)

    return NextResponse.json({
      success: true,
      url: result.url,
      key: result.key,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
