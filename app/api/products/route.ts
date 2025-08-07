import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured")

    console.log("Products API called with params:", { page, limit, category, search, featured })

    // Fetch products with variants to determine main image
    let query = supabase
      .from("products")
      .select(`
        *,
        product_variants(id, product_id, size, stock_quantity, color, image_url)
      `)
      .eq("in_stock", true)

    if (category) {
      const trimmedCategoryParam = category.trim().toLowerCase()
      console.log("Filtering by trimmed category param:", trimmedCategoryParam)
      
      const { data: allProducts, error: allError } = await query

      if (allError) {
        console.error("Supabase error fetching products:", allError)
        return NextResponse.json({ error: allError.message }, { status: 500 })
      }

      // Filter products where category matches after trimming and converting to lowercase
      let filteredProducts = allProducts?.filter((product) => 
        product.category?.trim().toLowerCase() === trimmedCategoryParam
      ) || []

      // Apply search filter if provided
      if (search) {
        filteredProducts = filteredProducts.filter((product) =>
          product.name?.toLowerCase().includes(search.toLowerCase()),
        )
      }

      // Apply featured filter if provided
      if (featured === "true") {
        filteredProducts = filteredProducts.filter((product) => product.featured === true)
      }

      // Transform products to set main image from first color variant
      const transformedProducts = filteredProducts.map(product => {
        const variants = product.product_variants || []
        // Find first color variant with image
        const firstColorVariant = variants.find(v => v.color && v.image_url)
        
        return {
          ...product,
          // Set main image to first color variant image if available, otherwise use image1
          mainImage: firstColorVariant?.image_url || product.image1 || "/placeholder.svg?height=300&width=300",
          variants: variants
        }
      })

      // Apply pagination
      const offset = (page - 1) * limit
      const paginatedProducts = transformedProducts.slice(offset, offset + limit)

      return NextResponse.json({
        products: paginatedProducts,
        pagination: {
          page,
          limit,
          total: transformedProducts.length,
          pages: Math.ceil(transformedProducts.length / limit),
          hasNext: page < Math.ceil(transformedProducts.length / limit),
          hasPrev: page > 1,
        },
      })
    }

    // Original logic for when no category is provided
    if (search) {
      query = query.ilike("name", `%${search}%`)
    }

    if (featured === "true") {
      query = query.eq("featured", true)
    }

    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1).order("created_at", { ascending: false })

    const { data, error, count } = await query

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform products to set main image from first color variant
    const transformedProducts = (data || []).map(product => {
      const variants = product.product_variants || []
      // Find first color variant with image
      const firstColorVariant = variants.find(v => v.color && v.image_url)
      
      return {
        ...product,
        // Set main image to first color variant image if available, otherwise use image1
        mainImage: firstColorVariant?.image_url || product.image1 || "/placeholder.svg?height=300&width=300",
        variants: variants
      }
    })

    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
        hasNext: page < Math.ceil((count || 0) / limit),
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Products API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
