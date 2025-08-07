import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// GET all categories
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.from("categories").select("*").order("name")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
