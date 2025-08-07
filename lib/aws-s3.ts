import AWS from "aws-sdk"
import sharp from "sharp"

// Configure AWS - Make sure to use the correct region
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "eu-north-1", // Changed to eu-north-1
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || ""

export interface UploadResult {
  url: string
  key: string
}

export async function uploadImageToS3(file: File, folder = "products"): Promise<UploadResult> {
  // Generate unique filename
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const fileName = `${folder}/${timestamp}-${randomString}.${fileExtension}`

  // Read the original file buffer
  const originalBuffer = Buffer.from(await file.arrayBuffer())
  let finalBuffer = originalBuffer

  // If file is larger than 1MB, compress it
  const ONE_MB = 1 * 1024 * 1024
  if (file.size > ONE_MB) {
    try {
      // Compress using sharp
      finalBuffer = await sharp(originalBuffer)
        .resize({ width: 1280, withoutEnlargement: true }) // reduce width
        .jpeg({ quality: 80 }) // reduce quality (works for jpg)
        .toBuffer()
    } catch (error) {
      console.warn("Image compression failed, falling back to original image:", error)
    }
  }

  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: finalBuffer,
    ContentType: file.type,
    // Remove ACL parameter - we'll handle public access via bucket policy
  }

  try {
    const result = await s3.upload(uploadParams).promise()
    // Construct the public URL manually with correct region
    const region = process.env.AWS_REGION || "eu-north-1"
    const publicUrl = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${fileName}`

    return {
      url: publicUrl,
      key: result.Key,
    }
  } catch (error) {
    console.error("S3 upload error:", error)
    throw new Error("Failed to upload image to S3")
  }
}

export async function deleteImageFromS3(key: string): Promise<void> {
  const deleteParams = {
    Bucket: BUCKET_NAME,
    Key: key,
  }

  try {
    await s3.deleteObject(deleteParams).promise()
  } catch (error) {
    console.error("S3 delete error:", error)
    throw new Error("Failed to delete image from S3")
  }
}

// Helper function to extract S3 key from URL
export function getS3KeyFromUrl(url: string): string | null {
  try {
    const urlParts = url.split("/")
    const bucketIndex = urlParts.findIndex((part) => part.includes(BUCKET_NAME))
    if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
      return urlParts.slice(bucketIndex + 1).join("/")
    }
    return null
  } catch {
    return null
  }
}