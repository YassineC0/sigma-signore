import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { requireAdmin } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    // Get dashboard statistics
    const [productsResult, categoriesResult, featuredResult] = await Promise.all([
      supabaseAdmin.from("products").select("id", { count: "exact" }),
      supabaseAdmin.from("categories").select("id", { count: "exact" }),
      supabaseAdmin.from("products").select("id", { count: "exact" }).eq("featured", true),
    ])

    // Get recent products
    const { data: recentProducts } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)

    // Get products by category
    const { data: productsByCategory } = await supabaseAdmin
      .from("products")
      .select("category")
      .not("category", "is", null)

    const categoryStats = productsByCategory?.reduce((acc: Record<string, number>, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1
      return acc
    }, {})

    return NextResponse.json({
      stats: {
        totalProducts: productsResult.count || 0,
        totalCategories: categoriesResult.count || 0,
        featuredProducts: featuredResult.count || 0,
      },
      recentProducts: recentProducts || [],
      categoryStats: categoryStats || {},
    })
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
