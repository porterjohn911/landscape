import { NextRequest, NextResponse } from 'next/server'

// Property parcel + building footprint for a lat/lng.
//
// Real implementation (phase B) will call Regrid (parcels) and Microsoft /
// Overture building footprints, returning GeoJSON we project onto the plan.
// You said you're starting with a Google key only, so this is mocked: it
// returns a plausible rectangular lot + house centered on the point so the
// "auto-trace" UX is wired end-to-end and easy to swap for live data later.
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const lat = parseFloat(sp.get('lat') || '')
  const lng = parseFloat(sp.get('lng') || '')
  if (!isFinite(lat) || !isFinite(lng)) {
    return NextResponse.json({ error: 'Missing lat/lng' }, { status: 400 })
  }

  // Meters relative to the center point. A ~18m x 25m lot with a ~10x12 house.
  const lot = [
    { x: -9, y: -12.5 },
    { x: 9, y: -12.5 },
    { x: 9, y: 12.5 },
    { x: -9, y: 12.5 },
  ]
  const house = [
    { x: -5, y: -3 },
    { x: 5, y: -3 },
    { x: 5, y: 7 },
    { x: -5, y: 7 },
  ]

  return NextResponse.json({
    mocked: true,
    note: 'Mock parcel/footprint. Wire Regrid + MS Buildings for real geometry.',
    lot,
    house,
  })
}
