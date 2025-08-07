import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET() {
  try {
    const { data: cities, error } = await supabaseAdmin
      .from("livraiso_info")
      .select("*")
      .order("Ville", { ascending: true })

    if (error) {
      console.error("Error fetching delivery cities:", error)
      return NextResponse.json({ error: "Erreur lors de la récupération des villes" }, { status: 500 })
    }

    return NextResponse.json({ cities: cities || [] })
  } catch (error) {
    console.error("Delivery cities API error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
