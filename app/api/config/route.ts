import { NextResponse } from 'next/server'

// Tells the client which providers are configured, WITHOUT leaking keys.
export async function GET() {
  return NextResponse.json({
    hasGoogle: !!process.env.GOOGLE_MAPS_API_KEY,
    hasReplicate: !!process.env.REPLICATE_API_TOKEN,
  })
}
