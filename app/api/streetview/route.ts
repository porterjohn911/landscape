import { NextRequest, NextResponse } from 'next/server'

// Front-of-house facade for a lat/lng (or address), proxied from Google Street
// View Static. Used to auto-load a "before" photo into the AI module. Returns
// image bytes, or 404 when no panorama is available at that location.
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const lat = parseFloat(sp.get('lat') || '')
  const lng = parseFloat(sp.get('lng') || '')
  if (!isFinite(lat) || !isFinite(lng)) {
    return NextResponse.json({ error: 'Missing lat/lng' }, { status: 400 })
  }

  const key = process.env.GOOGLE_MAPS_API_KEY
  if (!key) {
    return NextResponse.json({ error: 'No Google Maps key configured.' }, { status: 503 })
  }

  const loc = `${lat},${lng}`
  // Check availability first so we can return a clean 404 instead of Google's
  // "no imagery" grey placeholder.
  const metaUrl = `https://maps.googleapis.com/maps/api/streetview/metadata?location=${loc}&key=${key}`
  const meta = await fetch(metaUrl).then((r) => r.json())
  if (meta.status !== 'OK') {
    return NextResponse.json({ error: 'No Street View imagery at this address.' }, { status: 404 })
  }

  const imgUrl =
    `https://maps.googleapis.com/maps/api/streetview?size=640x640&location=${loc}` +
    `&fov=80&pitch=10&source=outdoor&key=${key}`
  const res = await fetch(imgUrl)
  if (!res.ok) {
    return NextResponse.json({ error: `Street View ${res.status}` }, { status: 502 })
  }
  const buf = Buffer.from(await res.arrayBuffer())
  return new NextResponse(buf, {
    headers: {
      'content-type': res.headers.get('content-type') || 'image/jpeg',
      'cache-control': 'public, max-age=86400',
    },
  })
}
