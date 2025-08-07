import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET() {
  try {
    console.log("Testing database connection...")

    // Test basic connection
    const { data: testData, error: testError } = await supabaseAdmin.from("products").select("count").limit(1)

    if (testError) {
      console.error("Database connection error:", testError)
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: testError.message,
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set",
          supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Not set",
        },
        { status: 500 },
      )
    }

    // Get all products
    const { data: products, error: productsError } = await supabaseAdmin.from("products").select("*")

    if (productsError) {
      console.error("Products query error:", productsError)
      return NextResponse.json(
        {
          error: "Failed to fetch products",
          details: productsError.message,
        },
        { status: 500 },
      )
    }

    // Get all categories
    const { data: categories, error: categoriesError } = await supabaseAdmin.from("categories").select("*")

    if (categoriesError) {
      console.error("Categories query error:", categoriesError)
      return NextResponse.json(
        {
          error: "Failed to fetch categories",
          details: categoriesError.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      productsCount: products?.length || 0,
      categoriesCount: categories?.length || 0,
      products: products,
      categories: categories,
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set",
        supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Not set",
      },
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Unexpected error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
