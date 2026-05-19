import type { IpcMain } from 'electron'
import fs from 'node:fs/promises'
import path from 'node:path'
import {
  IPC,
  type Result,
  type SatelliteRequest,
  type SatelliteResponse,
  type LatLng,
} from '../../shared/types.js'
import { tilesDir, getMapboxToken, readConfig } from '../store.js'

function tileKey(req: SatelliteRequest) {
  return `${req.center.lat.toFixed(6)}_${req.center.lng.toFixed(6)}_z${req.zoom}_${req.width}x${req.height}.png`
}

// Approximate meters/pixel at a given latitude and Mercator zoom level.
function metersPerPixel(lat: number, zoom: number) {
  return (156543.03392 * Math.cos((lat * Math.PI) / 180)) / Math.pow(2, zoom)
}

async function placeholderTile(outPath: string, w: number, h: number) {
  // Tiny 1x1 dark-green PNG, scaled by the renderer — we just need a file.
  // Inline PNG bytes for a 1x1 RGBA #2c4a26 pixel.
  const png = Buffer.from(
    '89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C4890000000D49444154789C636864606A0001000000050001A5F6450C0000000049454E44AE426082',
    'hex',
  )
  void w; void h
  await fs.writeFile(outPath, png)
}

export function registerSatelliteHandlers(ipc: IpcMain) {
  ipc.handle(IPC.satellite.hasToken, async () => {
    const cfg = await readConfig()
    return { hasToken: !!getMapboxToken(cfg) }
  })

  ipc.handle(
    IPC.satellite.fetch,
    async (_e, req: SatelliteRequest): Promise<Result<SatelliteResponse>> => {
      try {
        await fs.mkdir(tilesDir(), { recursive: true })
        const out = path.join(tilesDir(), tileKey(req))
        const exists = await fs
          .stat(out)
          .then(() => true)
          .catch(() => false)
        const cfg = await readConfig()
        const token = getMapboxToken(cfg)
        if (!exists) {
          if (token) {
            const url = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${req.center.lng},${req.center.lat},${req.zoom},0/${req.width}x${req.height}@2x?access_token=${token}`
            const res = await fetch(url)
            if (!res.ok) throw new Error(`Mapbox ${res.status}`)
            await fs.writeFile(out, Buffer.from(await res.arrayBuffer()))
          } else {
            await placeholderTile(out, req.width, req.height)
          }
        }
        const mpp = metersPerPixel(req.center.lat, req.zoom) / 2 // @2x retina
        return {
          ok: true,
          data: {
            localPath: out,
            bboxMeters: { width: req.width * mpp, height: req.height * mpp },
          },
        }
      } catch (err) {
        return { ok: false, error: (err as Error).message }
      }
    },
  )

  ipc.handle(IPC.satellite.geocode, async (_e, q: string): Promise<Result<LatLng & { label: string }>> => {
    const cfg = await readConfig()
    const token = getMapboxToken(cfg)
    if (!token) {
      return {
        ok: false,
        error: 'No Mapbox token configured. Add one in Settings to enable geocoding.',
      }
    }
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?limit=1&access_token=${token}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Mapbox ${res.status}`)
      const json = (await res.json()) as { features: Array<{ center: [number, number]; place_name: string }> }
      const f = json.features?.[0]
      if (!f) return { ok: false, error: 'No matching address' }
      return { ok: true, data: { lat: f.center[1], lng: f.center[0], label: f.place_name } }
    } catch (err) {
      return { ok: false, error: (err as Error).message }
    }
  })
}
