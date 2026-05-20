import { NextRequest, NextResponse } from 'next/server'

// Top-down aerial image for a lat/lng/zoom, proxied from Google Maps Static so
// the key never reaches the browser. Returns the raw image bytes. When no key
// is set, returns a generated placeholder so the 2D plan still renders.
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const lat = parseFloat(sp.get('lat') || '')
  const lng = parseFloat(sp.get('lng') || '')
  const zoom = parseInt(sp.get('zoom') || '20')
  const size = Math.min(640, parseInt(sp.get('size') || '640'))

  if (!isFinite(lat) || !isFinite(lng)) {
    return NextResponse.json({ error: 'Missing lat/lng' }, { status: 400 })
  }

  const key = process.env.GOOGLE_MAPS_API_KEY
  if (!key) {
    return new NextResponse(placeholderSvg(size), {
      headers: { 'content-type': 'image/svg+xml', 'cache-control': 'public, max-age=60' },
    })
  }

  const url =
    `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}` +
    `&zoom=${zoom}&size=${size}x${size}&scale=2&maptype=satellite&key=${key}`
  const res = await fetch(url)
  if (!res.ok) {
    return NextResponse.json({ error: `Google static maps ${res.status}` }, { status: 502 })
  }
  const buf = Buffer.from(await res.arrayBuffer())
  return new NextResponse(buf, {
    headers: {
      'content-type': res.headers.get('content-type') || 'image/png',
      'cache-control': 'public, max-age=86400',
    },
  })
}

function placeholderSvg(size: number) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2e4628"/><stop offset="1" stop-color="#4a6238"/>
    </linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="50%" fill="#ffffff88" font-family="sans-serif" font-size="${size / 22}"
      text-anchor="middle">No Google key — placeholder aerial</text>
  </svg>`
}
