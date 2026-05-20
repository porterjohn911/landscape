import type { Point } from './types'

export type Config = { hasGoogle: boolean; hasReplicate: boolean }

export async function getConfig(): Promise<Config> {
  const r = await fetch('/api/config')
  return r.json()
}

export async function geocode(q: string): Promise<{ lat: number; lng: number; label: string }> {
  const r = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`)
  const j = await r.json()
  if (!r.ok) throw new Error(j.error || 'Geocode failed')
  return j
}

export function aerialUrl(lat: number, lng: number, zoom: number, size = 640): string {
  return `/api/aerial?lat=${lat}&lng=${lng}&zoom=${zoom}&size=${size}`
}

export async function streetViewDataUrl(lat: number, lng: number): Promise<string> {
  const r = await fetch(`/api/streetview?lat=${lat}&lng=${lng}`)
  if (!r.ok) {
    const j = await r.json().catch(() => ({}))
    throw new Error(j.error || `Street View ${r.status}`)
  }
  const blob = await r.blob()
  return await blobToDataUrl(blob)
}

export async function fetchParcel(lat: number, lng: number): Promise<{ lot: Point[]; house: Point[]; mocked?: boolean }> {
  const r = await fetch(`/api/parcel?lat=${lat}&lng=${lng}`)
  const j = await r.json()
  if (!r.ok) throw new Error(j.error || 'Parcel lookup failed')
  return j
}

export async function generateAI(body: {
  sourceImageDataUrl: string
  maskImageDataUrl?: string
  prompt: string
  negativePrompt?: string
  controlnet: string
  variantCount?: number
}): Promise<{ variants: { url: string; seed: number }[]; mocked?: boolean }> {
  const r = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  const j = await r.json()
  if (!r.ok) throw new Error(j.error || 'Generation failed')
  return j
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = () => resolve(fr.result as string)
    fr.onerror = reject
    fr.readAsDataURL(blob)
  })
}

// meters/pixel for Web Mercator at given lat/zoom, accounting for @2x scale tiles.
export function metersPerPixel(lat: number, zoom: number, scale = 2): number {
  return (156543.03392 * Math.cos((lat * Math.PI) / 180)) / Math.pow(2, zoom) / scale
}
