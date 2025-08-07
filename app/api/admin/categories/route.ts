import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { requireAdmin } from "@/lib/auth"

// GET all categories (admin view)
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    const { data, error } = await supabaseAdmin.from("categories").select("*").order("name")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

// POST new category
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)

    const body = await request.json()

    const { data, error } = await supabaseAdmin.from("categories").insert([body]).select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
