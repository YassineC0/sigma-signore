import { NextResponse } from "next/server"
import { supabase, supabaseAdmin } from "@/lib/supabase"
import AWS from "aws-sdk"

export async function GET() {
  try {
    // Test Supabase connection
    const supabaseTest = supabase ? "✅ Connected" : "❌ Not connected"
    const supabaseAdminTest = supabaseAdmin ? "✅ Connected" : "❌ Not connected"

    // Test AWS configuration
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || "eu-north-1",
    })

    let awsTest = "❌ Not configured"
    try {
      await s3.listBuckets().promise()
      awsTest = "✅ Connected"
    } catch (error) {
      awsTest = `❌ Error: ${error}`
    }

    return NextResponse.json({
      supabase: supabaseTest,
      supabaseAdmin: supabaseAdminTest,
      aws: awsTest,
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing",
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing",
        supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Set" : "❌ Missing",
        awsAccessKey: process.env.AWS_ACCESS_KEY_ID ? "✅ Set" : "❌ Missing",
        awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY ? "✅ Set" : "❌ Missing",
        awsRegion: process.env.AWS_REGION ? "✅ Set" : "❌ Missing",
        awsBucket: process.env.AWS_S3_BUCKET_NAME ? "✅ Set" : "❌ Missing",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
