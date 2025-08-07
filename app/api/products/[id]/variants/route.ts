import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams

    const { data: variants, error } = await supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", id)
      .order("size")

    if (error) {
      console.error("Error fetching variants:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(variants || [])
  } catch (error) {
    console.error("Variants API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
