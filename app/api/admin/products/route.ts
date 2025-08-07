import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { verifyAdminToken } from "@/lib/auth"
import type { Product, ProductVariant } from "@/types/product"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdminToken(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("products")
      .select("*, product_variants(id, product_id, size, stock_quantity, color, image_url)")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching products:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform the data to match the Product interface, including nested variants
    const products: Product[] = data.map((p: any) => {
      const variants = p.product_variants || []
      // Find first color variant with image for main display
      const firstColorVariant = variants.find(v => v.color && v.image_url)
      
      return {
        ...p,
        variants: variants,
        // Set main image to first color variant image if available, otherwise use image1
        mainImage: firstColorVariant?.image_url || p.image1 || "/placeholder.svg?height=300&width=300"
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error in GET /api/admin/products:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAdminToken(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { variants, ...productData } = (await request.json()) as Product & { variants: ProductVariant[] }

    console.log("Creating product with data:", productData)
    console.log("Creating product with variants:", variants)

    // Insert the main product data
    const { data: newProduct, error: productError } = await supabase
      .from("products")
      .insert({
        ...productData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (productError) {
      console.error("Error creating product:", productError)
      return NextResponse.json({ error: productError.message }, { status: 500 })
    }

    console.log("Product created successfully:", newProduct)

    // Insert product variants if provided
    if (newProduct && variants && variants.length > 0) {
      const variantsToInsert = variants.map((variant: ProductVariant) => ({
        product_id: newProduct.id,
        size: variant.size,
        stock_quantity: variant.stock_quantity,
        color: variant.color || null,
        image_url: variant.image_url || null,
      }))

      console.log("Inserting variants:", variantsToInsert)

      const { error: variantsError } = await supabase
        .from("product_variants")
        .insert(variantsToInsert)

      if (variantsError) {
        console.error("Error creating product variants:", variantsError)
        return NextResponse.json({ error: variantsError.message }, { status: 500 })
      }

      console.log("Variants created successfully")
    }

    // Fetch the newly created product with its variants to return a complete object
    const { data: createdProductWithVariants, error: fetchError } = await supabase
      .from("products")
      .select("*, product_variants(id, product_id, size, stock_quantity, color, image_url)")
      .eq("id", newProduct.id)
      .single()

    if (fetchError) {
      console.error("Error fetching created product with variants:", fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    const variants_data = createdProductWithVariants.product_variants || []
    // Find first color variant with image for main display
    const firstColorVariant = variants_data.find(v => v.color && v.image_url)

    const transformedProduct: Product = {
      ...createdProductWithVariants,
      variants: variants_data,
      // Set main image to first color variant image if available, otherwise use image1
      mainImage: firstColorVariant?.image_url || createdProductWithVariants.image1 || "/placeholder.svg?height=300&width=300"
    }
    delete (transformedProduct as any).product_variants

    console.log("Final product created:", transformedProduct)

    return NextResponse.json(transformedProduct, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/admin/products:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
