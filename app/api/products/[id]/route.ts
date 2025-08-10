import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Corrected: Await params before destructuring
    const { id } = await params

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single()

    if (productError || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const { data: variants, error: variantsError } = await supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", id)
      .order("created_at", { ascending: true }) // Order to ensure consistent "first" variant

    if (variantsError) {
      console.error("Error fetching variants:", variantsError)
      return NextResponse.json({ error: "Failed to fetch variants" }, { status: 500 })
    }

    // Find first color variant with image for main display
    const firstColorVariant = variants?.find(v => v.color && v.image_url)
    
    const transformedProduct = {
      ...product,
      variants: variants || [],
      // Set main image to first color variant image if available, otherwise use image1
      mainImage: firstColorVariant?.image_url || product.image1 || "/placeholder.svg?height=400&width=400"
    }

    return NextResponse.json(transformedProduct)
  } catch (error) {
    console.error("Error in GET /api/products/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
