import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    // Get all products to see their category values
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, category")
      .eq("in_stock", true)

    // Get all categories to see their names
    const { data: categories, error: categoriesError } = await supabase.from("categories").select("id, name")

    if (productsError) {
      console.error("Products error:", productsError)
      return NextResponse.json({ error: productsError.message }, { status: 500 })
    }

    if (categoriesError) {
      console.error("Categories error:", categoriesError)
      return NextResponse.json({ error: categoriesError.message }, { status: 500 })
    }

    return NextResponse.json({
      products: products || [],
      categories: categories || [],
      debug: {
        message: "Check the category values in products vs category names",
        productCategories: [...new Set(products?.map((p) => p.category) || [])],
        categoryNames: categories?.map((c) => c.name) || [],
      },
    })
  } catch (error) {
    console.error("Debug API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
