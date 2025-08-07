import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST() {
  try {
    console.log("=== FIXING IMAGE URLS ===")

    // Get all products with S3 URLs
    const { data: products, error } = await supabaseAdmin
      .from("products")
      .select("id, name, image1, image2")
      .or("image1.like.%s3.us-east-1%,image2.like.%s3.us-east-1%")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("Products to fix:", products)

    const updates = []

    for (const product of products || []) {
      const updatedProduct: any = { id: product.id }
      let needsUpdate = false

      // Fix image1 if it has wrong region
      if (product.image1 && product.image1.includes("s3.us-east-1")) {
        updatedProduct.image1 = product.image1.replace("s3.us-east-1", "s3.eu-north-1")
        needsUpdate = true
      }

      // Fix image2 if it has wrong region
      if (product.image2 && product.image2.includes("s3.us-east-1")) {
        updatedProduct.image2 = product.image2.replace("s3.us-east-1", "s3.eu-north-1")
        needsUpdate = true
      }

      if (needsUpdate) {
        updates.push(updatedProduct)
      }
    }

    console.log("Updates to apply:", updates)

    // Apply updates
    const results = []
    for (const update of updates) {
      const { data, error } = await supabaseAdmin
        .from("products")
        .update({
          image1: update.image1,
          image2: update.image2,
        })
        .eq("id", update.id)
        .select()

      if (error) {
        console.error(`Error updating product ${update.id}:`, error)
      } else {
        results.push(data[0])
      }
    }

    return NextResponse.json({
      success: true,
      message: `Fixed ${results.length} products`,
      updatedProducts: results,
    })
  } catch (error) {
    console.error("Fix URLs error:", error)
    return NextResponse.json(
      {
        error: "Failed to fix URLs",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
