import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { verifyAdminToken } from "@/lib/auth"
import type { Product, ProductVariant } from "@/types/product"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await verifyAdminToken(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("products")
      .select("*, product_variants(id, product_id, size, stock_quantity, color, image_url)")
      .eq("id", params.id)
      .single()

    if (error) {
      console.error("Product fetch error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const variants = data.product_variants || []
    // Find first color variant with image for main display
    const firstColorVariant = variants.find(v => v.color && v.image_url)

    // Transform the response to match our Product interface
    const transformedProduct = {
      ...data,
      variants: variants,
      // Set main image to first color variant image if available, otherwise use image1
      mainImage: firstColorVariant?.image_url || data.image1 || "/placeholder.svg?height=300&width=300"
    }

    // Remove the product_variants property to avoid duplication
    delete transformedProduct.product_variants

    return NextResponse.json(transformedProduct)
  } catch (error) {
    console.error("Product fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await verifyAdminToken(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const productId = parseInt(params.id)
    const body = await request.json()
    const { variants, ...productData } = body

    console.log("Updating product with data:", productData)
    console.log("Updating product variants:", variants)

    // Update the product
    const { data: product, error: productError } = await supabase
      .from("products")
      .update({
        ...productData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId)
      .select()
      .single()

    if (productError) {
      console.error("Error updating product:", productError)
      return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
    }

    // Delete existing variants
    const { error: deleteError } = await supabase
      .from("product_variants")
      .delete()
      .eq("product_id", productId)

    if (deleteError) {
      console.error("Error deleting existing variants:", deleteError)
    }

    // Insert new variants if provided
    if (variants && variants.length > 0) {
      const variantsToInsert = variants.map((variant: ProductVariant) => ({
        product_id: productId,
        size: variant.size,
        stock_quantity: variant.stock_quantity,
        color: variant.color || null,
        image_url: variant.image_url || null,
      }))

      console.log("Inserting new variants:", variantsToInsert)

      const { error: insertVariantsError } = await supabase
        .from("product_variants")
        .insert(variantsToInsert)

      if (insertVariantsError) {
        console.error("Error inserting new product variants:", insertVariantsError)
        return NextResponse.json({ error: insertVariantsError.message }, { status: 500 })
      }
    }

    // Fetch the updated product with its new variants to return
    const { data: updatedProductWithVariants, error: fetchError } = await supabase
      .from("products")
      .select("*, product_variants(id, product_id, size, stock_quantity, color, image_url)")
      .eq("id", productId)
      .single()

    if (fetchError) {
      console.error("Error fetching updated product with variants:", fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    const variants_data = updatedProductWithVariants.product_variants || []
    // Find first color variant with image for main display
    const firstColorVariant = variants_data.find(v => v.color && v.image_url)

    // Transform the response to match our Product interface
    const transformedProduct = {
      ...updatedProductWithVariants,
      variants: variants_data,
      // Set main image to first color variant image if available, otherwise use image1
      mainImage: firstColorVariant?.image_url || updatedProductWithVariants.image1 || "/placeholder.svg?height=300&width=300"
    }

    // Remove the product_variants property to avoid duplication
    delete transformedProduct.product_variants

    console.log("Product updated successfully:", transformedProduct)

    return NextResponse.json(transformedProduct)
  } catch (error) {
    console.error("Error in PUT /api/admin/products/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await verifyAdminToken(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const productId = parseInt(params.id)

    // Delete variants first (foreign key constraint)
    const { error: variantsError } = await supabase
      .from("product_variants")
      .delete()
      .eq("product_id", productId)

    if (variantsError) {
      console.error("Error deleting variants:", variantsError)
    }

    // Delete the product
    const { error: productError } = await supabase
      .from("products")
      .delete()
      .eq("id", productId)

    if (productError) {
      console.error("Error deleting product:", productError)
      return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error in DELETE /api/admin/products/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
