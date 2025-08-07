import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET() {
  try {
    // Get all products with their images
    const { data: products, error } = await supabaseAdmin
      .from("products")
      .select("id, name, image1, image2")
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      products: products,
      imageCheck: products?.map((product) => ({
        id: product.id,
        name: product.name,
        image1: {
          url: product.image1,
          hasValue: !!product.image1,
          isS3: product.image1?.includes("s3.amazonaws.com"),
        },
        image2: {
          url: product.image2,
          hasValue: !!product.image2,
          isS3: product.image2?.includes("s3.amazonaws.com"),
        },
      })),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Debug failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
