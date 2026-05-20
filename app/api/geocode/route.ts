import { NextRequest, NextResponse } from 'next/server'

// Address -> { lat, lng, label }. Proxies Google Geocoding so the key stays
// on the server. Falls back to a friendly error when no key is configured.
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q) return NextResponse.json({ error: 'Missing address' }, { status: 400 })

  const key = process.env.GOOGLE_MAPS_API_KEY
  if (!key) {
    return NextResponse.json(
      { error: 'No Google Maps key configured. Add GOOGLE_MAPS_API_KEY to enable address search.' },
      { status: 503 },
    )
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(q)}&key=${key}`
  const res = await fetch(url)
  const json = await res.json()
  if (json.status !== 'OK' || !json.results?.length) {
    return NextResponse.json({ error: json.error_message || 'No matching address' }, { status: 404 })
  }
  const r = json.results[0]
  return NextResponse.json({
    lat: r.geometry.location.lat,
    lng: r.geometry.location.lng,
    label: r.formatted_address,
  })
}
