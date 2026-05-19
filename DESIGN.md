# Landscape Studio — Design Document

A desktop landscape design application in the spirit of DynaScape, Structure
Studios (Pool Studio / Vip3D), and iScape. It lets a landscape designer take a
client from a satellite photo of their property to a 2D site plan to a 3D
photoreal render, and overlays an AI redesign mode that restyles uploaded yard
photos using Stable Diffusion + ControlNet.

---

## 1. Product vision

**One project, three views of the same yard.**

| View          | Purpose                                            | Closest analog            |
|---------------|----------------------------------------------------|---------------------------|
| AI Photo      | "Show me what this yard could look like"           | iScape, Yardzen previews  |
| 2D Plan       | Accurate top-down site plan over satellite imagery | DynaScape, AutoCAD LT     |
| 3D Scene      | Walkthrough / fly-over render for the client       | Pool Studio, Vip3D, Lumion|

A `Project` owns a single `Site` (address + property polygon). All three views
read and write the same `DesignLayer` tree of placed objects (plants, hardscape,
water, structures, lighting). The 2D plan is the source of truth for placement;
the 3D scene mirrors it; the AI photo view treats placements as prompt hints +
ControlNet masks.

---

## 2. Target user & key flows

**Primary user:** independent landscape designer or small design-build firm
producing concept-to-sale visuals for residential clients.

**Headline flows:**

1. **New project from address** — type address → satellite tile loads → trace
   property polygon → start designing.
2. **AI quick-concept** — client emails a back-yard photo → designer uploads,
   masks the lawn, prompts "tropical pool deck with palms," gets 4 variants in
   under a minute, picks one, shares link with client.
3. **Detailed plan** — drop plants/hardscape/pool from the palette onto the 2D
   plan, with scale and quantities auto-totaled for the plant schedule.
4. **3D presentation** — open the 3D tab, the same scene is already populated;
   orbit, set sun angle/time of day, capture stills or a turntable video.
5. **Client share** — publish a read-only link (or PDF) the client opens in a
   browser; no install required on their side.

---

## 3. Architecture

### 3.1 Process model (Electron)

```
┌───────────────────────────────────────────────────────────────┐
│ Main process (Node)                                           │
│  ├── Window manager                                           │
│  ├── Project store    → JSON files in app userData/projects/  │
│  ├── Asset cache      → images, GLB plant models, sat tiles   │
│  ├── IPC handlers     → projects, ai, satellite, export       │
│  └── External clients → Replicate, Mapbox Static, file I/O    │
└───────────────────────────────────────────────────────────────┘
        ▲ contextBridge (typed IPC)
┌───────┴───────────────────────────────────────────────────────┐
│ Renderer process (React + Vite)                               │
│  ├── Route shell      → ProjectList, Editor, ClientView       │
│  ├── Module: AI Photo (Konva mask + Replicate calls)          │
│  ├── Module: 2D Plan  (react-konva over satellite tile)       │
│  ├── Module: 3D Scene (react-three-fiber)                     │
│  └── Shared state     → Zustand store (project + design tree) │
└───────────────────────────────────────────────────────────────┘
```

Secrets (REPLICATE_API_TOKEN, MAPBOX_TOKEN) live only in the main process and
are read from a per-user `~/.landscape-studio/config.json` or environment
variables. The renderer never sees them; it talks to thin IPC endpoints.

### 3.2 Data model

```ts
type Project = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  site: Site
  design: DesignLayer[]
  photoStudio: AIPhotoSession[]
  thumbnail?: string
}

type Site = {
  address?: string
  center: { lat: number; lng: number }
  zoom: number              // satellite zoom level used for the base
  propertyPolygon: LatLng[] // user-traced lot line
  northRotation: number     // degrees, for plan/3D alignment
}

type DesignLayer =
  | { kind: 'plant'; id: string; species: string; x: number; y: number; radius: number }
  | { kind: 'hardscape'; id: string; material: string; polygon: Point[] }
  | { kind: 'water'; id: string; shape: 'pool' | 'pond' | 'spa'; polygon: Point[]; depth: number }
  | { kind: 'structure'; id: string; type: 'pergola' | 'fence' | 'wall' | 'firepit'; ... }
  | { kind: 'light'; id: string; fixture: string; x: number; y: number; lumens: number }

type AIPhotoSession = {
  id: string
  sourceImage: string       // local path under userData/assets/
  maskImage?: string
  prompt: string
  negativePrompt?: string
  controlnet: 'canny' | 'depth' | 'mlsd' | 'seg'
  variants: { url: string; seed: number; createdAt: string }[]
}
```

Coordinates: 2D plan is in meters relative to the site center; satellite tile is
projected to the same plane via Web Mercator. The 3D scene reads the same
meter-space directly; +X east, +Z south, +Y up.

### 3.3 Module responsibilities

- `electron/main.ts` — window lifecycle, dev-tools, deep-link handler for client shares.
- `electron/ipc/projects.ts` — CRUD against JSON files; debounced autosave.
- `electron/ipc/ai.ts` — wraps the Replicate REST API; ControlNet model dispatch; image download & caching.
- `electron/ipc/satellite.ts` — fetches Mapbox static tiles for a lat/lng/zoom; on-disk cache keyed by tile coords.
- `electron/ipc/export.ts` *(roadmap)* — PDF plan, walkthrough MP4, shareable web bundle.
- `src/modules/ai-photo` — upload → mask → prompt → Replicate variants.
- `src/modules/plan-2d` — Konva stage with satellite raster, polygon tools, plant palette.
- `src/modules/scene-3d` — react-three-fiber scene that mounts plant/hardscape components from the design tree.

### 3.4 AI integration (Replicate)

Default model: `jagilley/controlnet-canny` for "preserve structure, restyle
materials" — best for "same yard, new design" output. A drop-down lets the user
swap in:

- `controlnet-depth` for replacing larger objects while keeping perspective.
- `controlnet-seg` when we want category-level swaps (lawn → pavers).
- `stability-ai/sdxl` (no ControlNet) for from-scratch concept boards.

Pipeline:

1. Renderer ships {sourceDataUrl, maskDataUrl?, prompt, controlnet, seed?} to main.
2. Main uploads images to Replicate's file endpoint, gets URLs.
3. Main calls `predictions.create` with the appropriate `version`, polls until
   `succeeded`, downloads the resulting image(s) to `userData/assets/`, returns
   local paths to the renderer.
4. Renderer adds them as `AIPhotoSession.variants`; user picks favorites and
   they get pinned to the project.

Rate limiting and key absence are handled in main — the IPC always returns a
typed `{ ok: true, data } | { ok: false, error }` so the UI can show a friendly
"Add your Replicate key in Settings" state.

### 3.5 Satellite imagery

We use Mapbox Static Images API as the default (clean license for embedding,
high zoom levels in residential areas). Token lives in main process; renderer
just requests `getSatelliteImage(lat, lng, zoom, width, height)` and gets a
local PNG path back. Tiles are cached so a project re-opens offline.

Future: support Google Static Maps and Nearmap as alt providers.

---

## 4. Tech stack

- **Shell:** Electron 30, electron-builder for packaging (mac/win/linux).
- **Renderer:** React 18, Vite 5, TypeScript 5, Tailwind 3, Zustand.
- **2D canvas:** react-konva (good free-form polygon + transform support).
- **3D:** three.js + @react-three/fiber + @react-three/drei.
- **Routing:** react-router-dom (HashRouter under Electron).
- **AI:** `replicate` npm SDK in main process.
- **Storage:** plain JSON in `app.getPath('userData')/projects/<id>.json`. We
  deliberately avoid better-sqlite3 to dodge native-module rebuild pain for v1;
  swap in SQLite later if needed.

---

## 5. Phased roadmap

### Phase 0 — Scaffold (this commit)
- Electron + Vite + React wiring with hot reload for renderer.
- Typed IPC bridge (`window.api`) with `projects`, `ai`, `satellite` namespaces.
- Project list + create-project flow with JSON persistence.
- Editor shell with three tabs (AI Photo / 2D Plan / 3D Scene).
- Working stubs for each module that read/write the shared design tree.
- Replicate client wired up; returns mock data when no token is set so the UI
  is still demoable.

### Phase 1 — AI photo MVP
- Mask painting (brush + rect) on uploaded photo.
- Prompt + style presets ("modern xeriscape", "tropical resort", "english cottage", "japanese zen", ...).
- 4-variant grid with side-by-side before/after slider.
- Pin favorites; export PNG.

### Phase 2 — 2D plan MVP
- Mapbox satellite base layer, address search.
- Property polygon tool with scale calibration (drag a known-length edge).
- Plant palette (start with ~50 common residentials, generic SVG icons).
- Hardscape polygon tool (patio, walkway, driveway) with material swatches.
- Pool/spa tool with depth slider.
- Plant schedule sidebar with auto-counts and est. mature spread.

### Phase 3 — 3D scene MVP
- Auto-build a ground plane from the property polygon.
- Apply satellite as a planar texture beneath placed objects.
- Lightweight GLB plant models (3-4 LODs per species; billboards at distance).
- Sun position by date/time + lat/lng for accurate shadows.
- Orbit / first-person camera; PNG capture; turntable MP4 export.

### Phase 4 — Client share & polish
- "Publish read-only" packages the project as a static web bundle uploaded to
  a Cloudflare R2 bucket; designer gets a URL.
- PDF plan export with title block, legend, plant schedule.
- Material/cost estimator that totals hardscape areas and plant counts against
  a designer-editable price list.

### Phase 5 — Pro features (later)
- Irrigation layer (heads, lateral lines, GPM totals).
- Lighting layer with night-view 3D render.
- Multi-user collaboration via a small Node sync server.
- iPad companion (Capacitor) for on-site captures.

---

## 6. Non-goals (v1)

- Full CAD precision (we won't compete with AutoCAD line-for-line; we target
  presentation-quality, not stamped-engineering output).
- Civil engineering / grading / drainage calcs.
- Cross-platform mobile native apps.
- Building offline-first AI models — we rely on hosted Replicate for v1.

---

## 7. Open questions

- **Plant 3D models:** licensing real photoreal models gets expensive. v1 ships
  with simple stylized billboards + a small free pack; we evaluate Quaternius,
  Quixel free tier, or a Sketchfab partnership for v2.
- **Address geocoding:** Mapbox geocoding bundled with the satellite token vs.
  separate Google Places call — TBD on the licensing comparison.
- **Pricing model:** seat-based ($79/mo designer) feels right; AI generations
  metered above an included monthly cap to cover Replicate cost-of-goods.
