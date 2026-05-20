# Landscape Studio — Full source bundle

Every source file in the repository concatenated into one place. Useful for code review or LLM ingestion. To actually **run** the app you still need the repository's directory structure — see the repo home page.

Regenerated automatically on every push to `main` by [`scripts/build-bundle.sh`](./scripts/build-bundle.sh).

Generated from commit `01e55db` on 2026-05-20.

## Files included

- [`README.md`](#README-md) — 109 lines
- [`DESIGN.md`](#DESIGN-md) — 247 lines
- [`WEB_APP_PLAN.md`](#WEBAPPPLAN-md) — 179 lines
- [`package.json`](#package-json) — 35 lines
- [`next.config.mjs`](#next-config-mjs) — 8 lines
- [`tsconfig.json`](#tsconfig-json) — 23 lines
- [`tailwind.config.ts`](#tailwind-config-ts) — 17 lines
- [`postcss.config.mjs`](#postcss-config-mjs) — 6 lines
- [`.env.example`](#-env-example) — 14 lines
- [`.gitignore`](#-gitignore) — 15 lines
- [`lib/types.ts`](#lib-types-ts) — 83 lines
- [`lib/palette.ts`](#lib-palette-ts) — 44 lines
- [`lib/store.ts`](#lib-store-ts) — 98 lines
- [`lib/apiClient.ts`](#lib-apiClient-ts) — 68 lines
- [`app/layout.tsx`](#app-layout-tsx) — 15 lines
- [`app/globals.css`](#app-globals-css) — 10 lines
- [`app/page.tsx`](#app-page-tsx) — 86 lines
- [`app/project/[id]/page.tsx`](#app-project-[id]-page-tsx) — 5 lines
- [`app/api/config/route.ts`](#app-api-config-route-ts) — 9 lines
- [`app/api/geocode/route.ts`](#app-api-geocode-route-ts) — 29 lines
- [`app/api/aerial/route.ts`](#app-api-aerial-route-ts) — 49 lines
- [`app/api/streetview/route.ts`](#app-api-streetview-route-ts) — 42 lines
- [`app/api/parcel/route.ts`](#app-api-parcel-route-ts) — 38 lines
- [`app/api/ai/route.ts`](#app-api-ai-route-ts) — 71 lines
- [`components/Editor.tsx`](#components-Editor-tsx) — 64 lines
- [`components/PlanCanvas.tsx`](#components-PlanCanvas-tsx) — 364 lines
- [`components/AIPhotoStudio.tsx`](#components-AIPhotoStudio-tsx) — 202 lines
- [`components/BeforeAfter.tsx`](#components-BeforeAfter-tsx) — 69 lines
- [`components/SceneViewer.tsx`](#components-SceneViewer-tsx) — 144 lines
- [`components/PlantModel.tsx`](#components-PlantModel-tsx) — 70 lines
- [`web-demo/index.html`](#web-demo-index-html) — 962 lines
- [`scripts/build-bundle.sh`](#scripts-build-bundle-sh) — 101 lines
- [`.github/workflows/pages.yml`](#-github-workflows-pages-yml) — 31 lines
- [`.github/workflows/bundle.yml`](#-github-workflows-bundle-yml) — 42 lines


---

<a id="README-md"></a>
## `README.md`

````markdown
# Landscape Studio

A web application for landscape designers — take a client from their **real
address** to a 2D site plan, a 3D scene, and AI photo redesigns. It pulls real
aerial imagery and the front-of-house from Google, in the spirit of DynaScape
and Structure Studios.

---

## Run it

This is a **Next.js web app**. It needs a host that runs serverless functions
(for the secure API-key proxy), so deploy it to **Vercel** — GitHub Pages
won't work because that's static-only.

### Local dev

```bash
git clone https://github.com/porterjohn911/landscape.git
cd landscape
npm install
cp .env.example .env.local   # add your keys (optional — app runs without them)
npm run dev                  # http://localhost:3000
```

### Deploy to Vercel (one time)

1. Push to GitHub (already done).
2. Go to https://vercel.com/new, import `porterjohn911/landscape`.
3. Add environment variables `GOOGLE_MAPS_API_KEY` and `REPLICATE_API_TOKEN`
   (both optional — without them you get placeholder data).
4. Deploy. Vercel gives you a public URL and redeploys on every push to `main`.

> Keys live **only** on the server (no `NEXT_PUBLIC_` prefix), so they're never
> exposed to the browser and can't be stolen from client-side code.

### Standalone preview (no install, no keys)

A simplified single-file demo is still published to GitHub Pages:
**[porterjohn911.github.io/landscape](https://porterjohn911.github.io/landscape/)**
(AI + satellite are simulated there).

---

## What's in the app today

Three integrated views of a single project, all keyed off the client's address:

- **2D Plan** — type an address → real Google **aerial** loads → **Auto-trace
  lot & house** (mocked geometry for now) or hand-trace with the **Lot** tool →
  drop plants / hardscape / water → live area, perimeter, and plant schedule.
  Calibrate scale with the **Scale** tool.
- **3D Scene** — the same design in three.js with category-specific procedural
  plants (trees sway), the aerial painted on the ground, property + house
  outlines, an extruded house massing, and sun position by time of day.
- **AI Photo** — upload a yard photo *or* **pull the front of the house from
  Google Street View**, paint a mask, pick a style, generate four ControlNet
  variants via Replicate, and compare any variant to the source with a
  draggable before/after slider.

Projects are saved in your browser (localStorage) for now. Without API keys the
app still runs end-to-end on placeholder data.

---

## API keys

Set these in `.env.local` (dev) or Vercel env vars (prod):

| Variable | Unlocks | Without it |
|---|---|---|
| `GOOGLE_MAPS_API_KEY` | Geocoding, aerial imagery, Street View (and 3D Tiles, phase C) | Placeholder aerial; Street View disabled |
| `REPLICATE_API_TOKEN` | Real ControlNet AI redesigns | Mock variants (source echoed back) |

Enable Geocoding API, Maps Static API, Street View Static API (and Map Tiles
API for phase C) on the Google key.

---

## Roadmap

See [WEB_APP_PLAN.md](./WEB_APP_PLAN.md) for the full real-data plan.

- **Phase B** — real parcels (Regrid) + building footprints (Microsoft/Overture)
  to replace the mocked auto-trace.
- **Phase C** — Google **Photorealistic 3D Tiles**: the client's *real textured
  house* in the 3D scene.
- **Phase D** — pinned AI results saved to the project; client share links.
- **Phase E** — PDF plan export, cost estimator.

---

## Changelog

### `v0.2` — Migrated to a real-data web app
- Rebuilt as a **Next.js** app; removed the Electron desktop shell.
- Secure server API routes proxy Google (geocode / aerial / Street View) and
  Replicate so keys never reach the browser.
- 2D plan loads **real Google aerial** from an address; **Auto-trace lot &
  house** wired (mock geometry pending Regrid/footprints).
- AI photo can **pull the facade from Street View** as the "before."
- 3D scene paints the aerial on the ground and extrudes the house footprint.
- Projects persist in localStorage; ported the plant/hardscape/water tools,
  property + scale tools, procedural plants, and before/after slider.

### `v0.1` — Electron prototype (archived in git history)
- Initial Electron + Vite scaffold, property polygon + scale calibration, 3D
  plant upgrades, before/after slider, installer pipeline, single-file web demo.
  See earlier commits for details.
````

---

<a id="DESIGN-md"></a>
## `DESIGN.md`

````markdown
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
````

---

<a id="WEBAPPPLAN-md"></a>
## `WEB_APP_PLAN.md`

````markdown
# Plan: Real-data web app

How Landscape Studio becomes a **full working web application** that pulls a
client's *actual* property from their address — aerial imagery, lot lines,
house footprint, a photorealistic 3D model of the real house, and the
street-level facade — and lets a designer work on top of all of it.

This supersedes the desktop-only direction. The Electron app and the
single-file demo stay as references, but new work targets a deployed web app.

---

## 1. Why a web app changes the architecture

In the browser you **cannot** ship API keys to the client — anyone could open
dev tools and steal them, and you'd get billed for their usage. So every paid
data source has to be called from a **server we control**, which holds the keys
and proxies requests. That single constraint drives the whole stack:

```
Browser (React)  ──►  Our API (serverless)  ──►  Google / Mapbox / Replicate / Regrid
   design UI            holds the secret keys,        (the actual data + AI providers)
   2D / 3D / AI         caches, rate-limits,
                        normalizes responses
```

Benefits we get for free by being on the web: shareable client links (no
install), real accounts, projects saved in the cloud, and instant updates.

---

## 2. Recommended stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router)** | One project gives us the React UI *and* serverless API routes to hide keys. Deploys to Vercel in one click. |
| 2D map | **MapLibre GL** + a draw layer (terra-draw / mapbox-gl-draw) | A real geo map correctly projects parcel + footprint GeoJSON. Much better than drawing over a static image. |
| 3D | **react-three-fiber** + **3DTilesRendererJS** | Renders Google Photorealistic 3D Tiles (the real textured house) inside the same three.js scene we already have. |
| AI | **Replicate** via server route | ControlNet redesigns, same as today, but proxied. |
| DB + storage + auth | **Supabase** (Postgres + Storage + Auth) | Generous free tier; designers get accounts, projects persist, images stored. |
| Hosting | **Vercel** | Native Next.js host; serverless functions for the proxy. |

We can lift the existing React modules (`AIPhotoStudio`, `PlantModel`, the
before/after slider, the palette/types) almost as-is — they're already
framework-agnostic React.

---

## 3. Real-data sources (the heart of the request)

Each row is an independent integration that drops into a module we already have.

### 3.1 Address → coordinates (foundation)
- **Google Geocoding API** (or Mapbox Geocoding).
- Input: "123 Main St, Austin TX". Output: lat/lng + normalized address.
- Cheap, universal. Everything else keys off this.

### 3.2 Top-down aerial (2D base layer)
- **Tier 1:** Mapbox / Google satellite static tiles — already wired for Mapbox.
- **Tier 2 (premium):** **Nearmap** — much higher resolution, recent captures.
  B2B pricing; worth it for a paid product, optional at first.

### 3.3 Property lines (auto-trace the lot)
- **Regrid Parcel API** — the standard for US nationwide parcels; returns the
  lot polygon as GeoJSON + owner/APN/acreage.
- Free fallback: some county/city open-data GIS portals, but coverage is
  inconsistent.
- Result: the **Lot** tool gets pre-filled instead of hand-traced.

### 3.4 House outline (auto-trace the building)
- **Microsoft Building Footprints** (free, ML-derived, US-wide) or **Overture
  Maps** buildings.
- Returns the house's roof polygon as GeoJSON.
- Used to auto-place the structure in 2D and extrude a massing block in 3D.

### 3.5 Photorealistic 3D of the *real* house ⭐
- **Google Map Tiles API → Photorealistic 3D Tiles.**
- A streamed, textured 3D mesh of the actual address — the client's real house,
  trees, neighbors.
- Rendered with **3DTilesRendererJS** in our react-three-fiber scene; we place
  design objects in the same geographic coordinate space so new plants/hardscape
  sit correctly against the real house.
- Coverage: excellent in metros/suburbs, patchy rural. Metered Google billing.
- This is the single biggest "wow" and the closest match to "what their
  property really looks like in 3D."

### 3.6 Street-level facade (for AI redesign)
- **Google Street View Static API.**
- Auto-pulls the front-of-house image from the address → drops straight into the
  AI Photo module as the "before."
- Designer masks the yard, prompts, gets photoreal redesigns — no client photo
  needed.

### 3.7 Terrain / slope (later)
- **Google Elevation API** or **Mapbox Terrain-RGB**.
- Drives a real sloped ground plane in 3D instead of a flat plane; matters for
  retaining walls, drainage, steps.

---

## 4. The unified workflow after this lands

1. Designer types the client's address.
2. App geocodes it and, in parallel, fetches: aerial tile, parcel polygon,
   building footprint, Street View image, and (on the 3D tab) the 3D tiles.
3. **2D plan** opens with the lot line and house already drawn over hi-res
   aerial. Designer adds plants/hardscape/water.
4. **3D scene** shows the real textured house; the design from 2D appears in the
   same space. Sun by date/time.
5. **AI photo** is pre-loaded with the Street View facade; mask + prompt →
   photoreal before/after.
6. Save → client opens a read-only share link in their browser.

---

## 5. Phased build order

**Phase A — Web app foundation**
- New Next.js app (we can scaffold alongside, or migrate the repo).
- Supabase project: auth, `projects` table, image storage bucket.
- Server routes (`/api/...`) that proxy Geocoding, Mapbox, Replicate with keys
  in server env vars.
- Port the existing AI Photo + before/after UI to the web app, talking to the
  proxy instead of Electron IPC.

**Phase B — Real 2D from an address**
- MapLibre base with satellite.
- `/api/parcel` (Regrid) → auto lot line; `/api/footprint` (MS Buildings) →
  auto house outline.
- Plant/hardscape/water drawing on the geo map; plant schedule + areas.

**Phase C — Real 3D house**
- `/api/3dtiles` session proxy for Google Photorealistic 3D Tiles.
- 3DTilesRendererJS in the r3f scene; align design objects to geo coordinates.
- Sun position by date/time/lat-lng.

**Phase D — Street View into AI**
- `/api/streetview` → facade image auto-loaded into AI Photo.
- Tie pinned AI results to the project record.

**Phase E — Client share & polish**
- Read-only public project links.
- PDF plan export; cost estimator.

---

## 6. Cost & licensing reality (important)

- These are **paid, metered APIs**, not scraping. Budget for usage:
  - Google Maps Platform (geocoding, 3D tiles, Street View, elevation) — has a
    monthly free credit, then per-call pricing. 3D Tiles and Street View are the
    bigger line items.
  - Regrid parcels — subscription/per-call.
  - Nearmap — B2B contract (skip until needed; Google/Mapbox aerial is fine to
    start).
  - Replicate — per-second GPU billing for AI renders.
- **Terms of service:** rendering Google 3D Tiles / Street View requires showing
  Google attribution and following their display rules. We'll build that in.
- **Pricing model suggestion:** bundle an included monthly quota into the
  designer's subscription; meter heavy AI/3D usage above it to cover COGS.

---

## 7. Decisions I need from you

1. **Migrate or parallel?** Turn this repo's app into the Next.js web app, or
   build the web app in a new `webapp/` folder beside the current code?
2. **Which keys can you get?** Google Maps Platform is the unlock for 3D + Street
   View. Regrid for parcels. Tell me what you can sign up for and I'll wire mocks
   for the rest so the app still runs.
3. **Accounts now or later?** Add Supabase auth + cloud save in Phase A, or keep
   it keyless/local until the data integrations are proven?
4. **Start point:** confirm Phase A first (web foundation), since every real-data
   source needs the secure server proxy before it can work in a browser.

---

Once you answer #1–#4 I'll start on Phase A and keep the README changelog +
FULL_SOURCE bundle updated as usual.
````

---

<a id="package-json"></a>
## `package.json`

````json
{
  "name": "landscape-studio",
  "version": "0.2.0",
  "private": true,
  "description": "Web app for landscape design — real aerial, 2D site plan, 3D scene, and AI photo redesign.",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@react-three/drei": "^9.114.0",
    "@react-three/fiber": "^8.17.10",
    "lucide-react": "^0.460.0",
    "nanoid": "^5.0.7",
    "next": "^14.2.15",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "replicate": "^1.0.1",
    "three": "^0.169.0",
    "zustand": "^5.0.1"
  },
  "devDependencies": {
    "@types/node": "^22.8.1",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@types/three": "^0.169.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "typescript": "^5.6.3"
  }
}
````

---

<a id="next-config-mjs"></a>
## `next.config.mjs`

````
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // three.js ships ESM that Next can transpile cleanly.
  transpilePackages: ['three'],
}

export default nextConfig
````

---

<a id="tsconfig-json"></a>
## `tsconfig.json`

````json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "web-demo"]
}
````

---

<a id="tailwind-config-ts"></a>
## `tailwind.config.ts`

````typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        moss: { 500: '#5a8a4a', 600: '#467036', 700: '#365a28' },
      },
    },
  },
  plugins: [],
}
export default config
````

---

<a id="postcss-config-mjs"></a>
## `postcss.config.mjs`

````
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
````

---

<a id="-env-example"></a>
## `.env.example`

````
# Copy to .env.local and fill in. These stay server-side only — they are NEVER
# exposed to the browser (no NEXT_PUBLIC_ prefix), so your keys can't be stolen
# from client-side code.

# Google Maps Platform key. Enable these APIs on the key:
#   - Geocoding API            (address -> lat/lng)
#   - Maps Static API          (top-down aerial imagery)
#   - Street View Static API   (front-of-house facade)
#   - Map Tiles API            (Photorealistic 3D Tiles — phase C)
GOOGLE_MAPS_API_KEY=

# Replicate token for AI photo redesigns (Stable Diffusion + ControlNet).
# Without it, the app returns mock variants so the UI still works.
REPLICATE_API_TOKEN=
````

---

<a id="-gitignore"></a>
## `.gitignore`

````
node_modules/
.next/
out/
build/
dist/
.DS_Store
*.log
.env
.env.local
.env.*.local
next-env.d.ts
*.tsbuildinfo
.vercel
.idea/
.vscode/
````

---

<a id="lib-types-ts"></a>
## `lib/types.ts`

````typescript
export type LatLng = { lat: number; lng: number }
export type Point = { x: number; y: number } // meters relative to site center

export type Plant = {
  kind: 'plant'
  id: string
  plantId: string
  x: number
  y: number
  radius: number
  height: number
}

export type Hardscape = {
  kind: 'hardscape'
  id: string
  material: string
  color: string
  polygon: Point[]
}

export type Water = {
  kind: 'water'
  id: string
  polygon: Point[]
}

export type DesignObject = Plant | Hardscape | Water

export type Site = {
  address?: string
  center: LatLng
  zoom: number
  propertyPolygon: Point[]
  housePolygon: Point[]
  scaleCalibration: number
}

export type AIVariant = {
  id: string
  url: string
  seed: number
  pinned?: boolean
}

export type AISession = {
  id: string
  createdAt: string
  sourceUrl: string
  prompt: string
  controlnet: string
  variants: AIVariant[]
}

export type Project = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  site: Site
  design: DesignObject[]
  aiSessions: AISession[]
}

export function newProject(name: string, address?: string): Project {
  const now = new Date().toISOString()
  return {
    id: Math.random().toString(36).slice(2, 10),
    name: name || 'Untitled project',
    createdAt: now,
    updatedAt: now,
    site: {
      address,
      center: { lat: 37.7749, lng: -122.4194 },
      zoom: 20,
      propertyPolygon: [],
      housePolygon: [],
      scaleCalibration: 1,
    },
    design: [],
    aiSessions: [],
  }
}
````

---

<a id="lib-palette-ts"></a>
## `lib/palette.ts`

````typescript
export type PlantSpec = {
  id: string
  name: string
  radius: number
  height: number
  color: string
  category: 'tree' | 'shrub' | 'grass' | 'perennial' | 'groundcover'
}

export const PLANTS: PlantSpec[] = [
  { id: 'oak',      name: 'Coast Live Oak', radius: 6,   height: 12,  color: '#3e6b2a', category: 'tree' },
  { id: 'maple',    name: 'Japanese Maple', radius: 2.5, height: 4,   color: '#a14b2a', category: 'tree' },
  { id: 'olive',    name: 'Olive Tree',     radius: 3.5, height: 6,   color: '#7a8a52', category: 'tree' },
  { id: 'myrtle',   name: 'Crepe Myrtle',   radius: 2,   height: 5,   color: '#a05a7a', category: 'tree' },
  { id: 'box',      name: 'Boxwood',        radius: 0.6, height: 1,   color: '#4a7044', category: 'shrub' },
  { id: 'rosemary', name: 'Rosemary',       radius: 0.7, height: 0.8, color: '#5a7a5a', category: 'shrub' },
  { id: 'lavender', name: 'Lavender',       radius: 0.5, height: 0.6, color: '#7a6aa0', category: 'perennial' },
  { id: 'agave',    name: 'Century Plant',  radius: 1.2, height: 1.5, color: '#6a8a6a', category: 'shrub' },
  { id: 'fescue',   name: 'Blue Fescue',    radius: 0.3, height: 0.3, color: '#6a8aa0', category: 'grass' },
  { id: 'sedum',    name: 'Stonecrop',      radius: 0.4, height: 0.5, color: '#7a8a4a', category: 'groundcover' },
]

export const plantById = (id: string) => PLANTS.find((p) => p.id === id)

export type MaterialSpec = { id: string; name: string; color: string }

export const MATERIALS: MaterialSpec[] = [
  { id: 'flagstone', name: 'Flagstone', color: '#a09b8a' },
  { id: 'concrete',  name: 'Concrete',  color: '#c8c8c0' },
  { id: 'pavers',    name: 'Pavers',    color: '#8a7a6a' },
  { id: 'gravel',    name: 'Gravel',    color: '#b0a890' },
  { id: 'turf',      name: 'Turf',      color: '#5a8a4a' },
  { id: 'mulch',     name: 'Mulch',     color: '#5a3e22' },
  { id: 'deck',      name: 'Wood deck', color: '#7a5a3a' },
]

export const STYLE_PRESETS = [
  { label: 'Modern xeriscape', prompt: 'modern xeriscape, drought-tolerant plants, decomposed granite, board-formed concrete planters, golden hour' },
  { label: 'Tropical resort',  prompt: 'tropical resort backyard, palm trees, monstera, lush ferns, teak deck, soft evening light' },
  { label: 'English cottage',  prompt: 'english cottage garden, lavender, roses, foxglove, stone path, soft overcast light' },
  { label: 'Japanese zen',     prompt: 'japanese zen garden, raked gravel, moss, stone lanterns, japanese maple, koi pond' },
  { label: 'Mediterranean',    prompt: 'mediterranean courtyard, olive trees, terracotta pavers, rosemary, citrus, stucco walls' },
  { label: 'Desert modern',    prompt: 'desert modern landscape, agave, ocotillo, saguaro, rusted steel planters, gravel, dramatic shadows' },
]
````

---

<a id="lib-store-ts"></a>
## `lib/store.ts`

````typescript
'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Project, DesignObject, AISession, Site } from './types'
import { newProject } from './types'

type State = {
  projects: Record<string, Project>
}

type Actions = {
  create: (name: string, address?: string) => Project
  remove: (id: string) => void
  get: (id: string) => Project | undefined
  rename: (id: string, name: string) => void
  setSite: (id: string, patch: Partial<Site>) => void
  upsertObject: (id: string, obj: DesignObject) => void
  removeObject: (id: string, objId: string) => void
  clearDesign: (id: string) => void
  addSession: (id: string, s: AISession) => void
  updateSession: (id: string, sessionId: string, patch: Partial<AISession>) => void
}

export const useStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      projects: {},

      create(name, address) {
        const p = newProject(name, address)
        set((s) => ({ projects: { ...s.projects, [p.id]: p } }))
        return p
      },

      remove(id) {
        set((s) => {
          const next = { ...s.projects }
          delete next[id]
          return { projects: next }
        })
      },

      get(id) {
        return get().projects[id]
      },

      rename(id, name) {
        patch(set, id, (p) => ({ ...p, name }))
      },

      setSite(id, sitePatch) {
        patch(set, id, (p) => ({ ...p, site: { ...p.site, ...sitePatch } }))
      },

      upsertObject(id, obj) {
        patch(set, id, (p) => {
          const idx = p.design.findIndex((o) => o.id === obj.id)
          const design = idx >= 0 ? p.design.map((o, i) => (i === idx ? obj : o)) : [...p.design, obj]
          return { ...p, design }
        })
      },

      removeObject(id, objId) {
        patch(set, id, (p) => ({ ...p, design: p.design.filter((o) => o.id !== objId) }))
      },

      clearDesign(id) {
        patch(set, id, (p) => ({ ...p, design: [] }))
      },

      addSession(id, s) {
        patch(set, id, (p) => ({ ...p, aiSessions: [s, ...p.aiSessions] }))
      },

      updateSession(id, sessionId, sPatch) {
        patch(set, id, (p) => ({
          ...p,
          aiSessions: p.aiSessions.map((s) => (s.id === sessionId ? { ...s, ...sPatch } : s)),
        }))
      },
    }),
    { name: 'landscape-studio-v2' },
  ),
)

function patch(
  set: (fn: (s: State) => Partial<State>) => void,
  id: string,
  fn: (p: Project) => Project,
) {
  set((s) => {
    const p = s.projects[id]
    if (!p) return {}
    const updated = { ...fn(p), updatedAt: new Date().toISOString() }
    return { projects: { ...s.projects, [id]: updated } }
  })
}
````

---

<a id="lib-apiClient-ts"></a>
## `lib/apiClient.ts`

````typescript
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
````

---

<a id="app-layout-tsx"></a>
## `app/layout.tsx`

````typescript
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Landscape Studio',
  description: 'Design outdoor spaces from a real address — 2D plan, 3D scene, and AI photo redesign.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="h-full">{children}</body>
    </html>
  )
}
````

---

<a id="app-globals-css"></a>
## `app/globals.css`

````css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body { height: 100%; background: #020617; color: #f1f5f9; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; }

::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 4px; }
::-webkit-scrollbar-track { background: transparent; }
````

---

<a id="app-page-tsx"></a>
## `app/page.tsx`

````typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, MapPin, Trash2, Trees } from 'lucide-react'
import { useStore } from '@/lib/store'

export default function Home() {
  const router = useRouter()
  const projects = useStore((s) => s.projects)
  const create = useStore((s) => s.create)
  const remove = useStore((s) => s.remove)
  const [mounted, setMounted] = useState(false)
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')

  useEffect(() => setMounted(true), [])

  const list = Object.values(projects).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  function doCreate() {
    const p = create(name || 'Untitled project', address || undefined)
    router.push(`/project/${p.id}`)
  }

  return (
    <div className="min-h-screen">
      <header className="flex items-center gap-2 px-5 h-12 border-b border-slate-800 bg-slate-900/60 font-semibold">
        <Trees className="w-5 h-5 text-moss-500" />
        Landscape Studio
        <span className="text-xs font-normal text-slate-500 ml-2">web</span>
      </header>

      <div className="max-w-5xl mx-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Your projects</h1>
          <button onClick={() => setCreating(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-moss-600 hover:bg-moss-500 rounded-md text-sm font-medium">
            <Plus className="w-4 h-4" /> New project
          </button>
        </div>

        {creating && (
          <div className="mb-6 p-4 rounded-lg border border-slate-800 bg-slate-900/40 space-y-3">
            <input autoFocus placeholder="Project name (e.g. Smith residence)"
              value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm" />
            <input placeholder="Client address (used for aerial, Street View, 3D)"
              value={address} onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') doCreate() }}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setCreating(false)} className="px-3 py-1.5 text-sm text-slate-400 hover:text-slate-100">Cancel</button>
              <button onClick={doCreate} className="px-3 py-1.5 text-sm bg-moss-600 hover:bg-moss-500 rounded-md">Create</button>
            </div>
          </div>
        )}

        {!mounted ? null : list.length === 0 ? (
          <div className="text-center py-20 text-slate-500">No projects yet. Create one to get started.</div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((p) => (
              <li key={p.id} className="group relative rounded-lg border border-slate-800 bg-slate-900/40 hover:border-moss-600 transition">
                <button onClick={() => router.push(`/project/${p.id}`)} className="block w-full text-left p-4">
                  <div className="font-medium mb-1 truncate">{p.name}</div>
                  {p.site.address && (
                    <div className="text-xs text-slate-400 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3" /> {p.site.address}
                    </div>
                  )}
                  <div className="text-xs text-slate-500 mt-2">Updated {new Date(p.updatedAt).toLocaleString()}</div>
                </button>
                <button onClick={() => { if (confirm('Delete this project?')) remove(p.id) }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
````

---

<a id="app-project-[id]-page-tsx"></a>
## `app/project/[id]/page.tsx`

````typescript
import Editor from '@/components/Editor'

export default function ProjectPage({ params }: { params: { id: string } }) {
  return <Editor projectId={params.id} />
}
````

---

<a id="app-api-config-route-ts"></a>
## `app/api/config/route.ts`

````typescript
import { NextResponse } from 'next/server'

// Tells the client which providers are configured, WITHOUT leaking keys.
export async function GET() {
  return NextResponse.json({
    hasGoogle: !!process.env.GOOGLE_MAPS_API_KEY,
    hasReplicate: !!process.env.REPLICATE_API_TOKEN,
  })
}
````

---

<a id="app-api-geocode-route-ts"></a>
## `app/api/geocode/route.ts`

````typescript
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
````

---

<a id="app-api-aerial-route-ts"></a>
## `app/api/aerial/route.ts`

````typescript
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
````

---

<a id="app-api-streetview-route-ts"></a>
## `app/api/streetview/route.ts`

````typescript
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
````

---

<a id="app-api-parcel-route-ts"></a>
## `app/api/parcel/route.ts`

````typescript
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
````

---

<a id="app-api-ai-route-ts"></a>
## `app/api/ai/route.ts`

````typescript
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 120 // allow time for Replicate to finish

const MODEL_VERSIONS: Record<string, `${string}/${string}:${string}`> = {
  canny: 'jagilley/controlnet-canny:aff48af9c68d162388d230a2ab003f68d2638d88307bdaf1c2f1ac95079c9613',
  depth: 'jagilley/controlnet-depth2img:922c7f7b1d72f02cc99ce9aabe687e3f86e890ed27d75c2d49b1de2eb84e7b8a',
  seg: 'jagilley/controlnet-seg:f967b165f4cd2e151d11e7450a8214e5d22ad2007f042f2f891ca3981dbfba0d',
  none: 'stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc',
}

type Body = {
  sourceImageDataUrl: string
  maskImageDataUrl?: string
  prompt: string
  negativePrompt?: string
  controlnet?: keyof typeof MODEL_VERSIONS
  variantCount?: number
}

export async function POST(req: NextRequest) {
  let body: Body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  if (!body.sourceImageDataUrl || !body.prompt) {
    return NextResponse.json({ error: 'Missing image or prompt' }, { status: 400 })
  }

  const token = process.env.REPLICATE_API_TOKEN
  // No token → echo the source back as "variants" so the UI flow still works.
  if (!token) {
    return NextResponse.json({
      mocked: true,
      variants: Array.from({ length: body.variantCount ?? 4 }, (_, i) => ({
        url: body.sourceImageDataUrl,
        seed: i + 1,
      })),
    })
  }

  try {
    const { default: Replicate } = await import('replicate')
    const replicate = new Replicate({ auth: token })
    const version = MODEL_VERSIONS[body.controlnet ?? 'canny'] ?? MODEL_VERSIONS.canny

    const input: Record<string, unknown> = {
      image: body.sourceImageDataUrl,
      prompt: body.prompt,
      num_outputs: body.variantCount ?? 4,
      num_inference_steps: 30,
    }
    if (body.negativePrompt) input.negative_prompt = body.negativePrompt
    if (body.maskImageDataUrl) input.mask = body.maskImageDataUrl

    const output = (await replicate.run(version, { input })) as unknown
    const urls: string[] = Array.isArray(output)
      ? (output as string[])
      : typeof output === 'string'
        ? [output]
        : []

    return NextResponse.json({
      variants: urls.map((url, i) => ({ url, seed: i })),
    })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 502 })
  }
}
````

---

<a id="components-Editor-tsx"></a>
## `components/Editor.tsx`

````typescript
'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft, ImageIcon, Map, Box } from 'lucide-react'
import { useStore } from '@/lib/store'
import PlanCanvas from './PlanCanvas'
import AIPhotoStudio from './AIPhotoStudio'

// three.js can't render on the server — load the scene client-only.
const SceneViewer = dynamic(() => import('./SceneViewer'), {
  ssr: false,
  loading: () => <div className="h-full grid place-items-center text-slate-500">Loading 3D…</div>,
})

type Tab = 'photo' | 'plan' | 'scene'

export default function Editor({ projectId }: { projectId: string }) {
  const project = useStore((s) => s.projects[projectId])
  const rename = useStore((s) => s.rename)
  const [tab, setTab] = useState<Tab>('plan')
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null
  if (!project) {
    return (
      <div className="h-screen grid place-items-center text-slate-500">
        Project not found. <Link href="/" className="text-moss-500 underline ml-1">Back to projects</Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center gap-3 px-3 h-12 border-b border-slate-800 bg-slate-900/40">
        <Link href="/" className="text-slate-400 hover:text-slate-100"><ArrowLeft className="w-4 h-4" /></Link>
        <input value={project.name} onChange={(e) => rename(projectId, e.target.value)}
          className="bg-transparent text-sm font-medium outline-none focus:bg-slate-800 px-1 rounded" />
        <div className="ml-auto flex items-center gap-1">
          <TabBtn icon={<ImageIcon className="w-4 h-4" />} label="AI photo" active={tab === 'photo'} onClick={() => setTab('photo')} />
          <TabBtn icon={<Map className="w-4 h-4" />} label="2D plan" active={tab === 'plan'} onClick={() => setTab('plan')} />
          <TabBtn icon={<Box className="w-4 h-4" />} label="3D scene" active={tab === 'scene'} onClick={() => setTab('scene')} />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {tab === 'photo' && <AIPhotoStudio projectId={projectId} />}
        {tab === 'plan' && <PlanCanvas projectId={projectId} />}
        {tab === 'scene' && <SceneViewer projectId={projectId} />}
      </div>
    </div>
  )
}

function TabBtn({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition ${active ? 'bg-moss-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
      {icon} {label}
    </button>
  )
}
````

---

<a id="components-PlanCanvas-tsx"></a>
## `components/PlanCanvas.tsx`

````typescript
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import { MousePointer2, Trees, Square, Waves, Hexagon, Ruler, Search, Download, Loader2 } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PLANTS, MATERIALS, plantById, type PlantSpec } from '@/lib/palette'
import { aerialUrl, geocode, fetchParcel } from '@/lib/apiClient'
import type { Point, Plant, Hardscape, Water, DesignObject } from '@/lib/types'

type Tool = 'select' | 'plant' | 'hardscape' | 'water' | 'property' | 'calibrate'

function groundMeters(lat: number, zoom: number, sizeLogical = 640) {
  return (sizeLogical * 156543.03392 * Math.cos((lat * Math.PI) / 180)) / Math.pow(2, zoom)
}

export default function PlanCanvas({ projectId }: { projectId: string }) {
  const project = useStore((s) => s.projects[projectId])
  const setSite = useStore((s) => s.setSite)
  const upsertObject = useStore((s) => s.upsertObject)
  const removeObject = useStore((s) => s.removeObject)
  const clearDesign = useStore((s) => s.clearDesign)

  const [tool, setTool] = useState<Tool>('plant')
  const [activePlant, setActivePlant] = useState<PlantSpec>(PLANTS[0])
  const [activeMaterial, setActiveMaterial] = useState(MATERIALS[0])
  const [draft, setDraft] = useState<number[]>([])
  const [calib, setCalib] = useState<number[]>([])
  const [calibInput, setCalibInput] = useState('')
  const [addr, setAddr] = useState('')
  const [busy, setBusy] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [aerial, setAerial] = useState<HTMLImageElement | null>(null)

  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [size, setSize] = useState({ w: 1000, h: 700 })

  const site = project?.site

  // load aerial whenever the site location/zoom changes
  useEffect(() => {
    if (!site) return
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => setAerial(img)
    img.src = aerialUrl(site.center.lat, site.center.lng, site.zoom)
  }, [site?.center.lat, site?.center.lng, site?.zoom])

  useEffect(() => {
    function resize() {
      const r = wrapRef.current?.getBoundingClientRect()
      if (r) setSize({ w: r.width, h: r.height })
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  useEffect(() => { setDraft([]); setCalib([]); setCalibInput('') }, [tool])

  const side = Math.min(size.w, size.h)
  const pxPerMeter = useMemo(() => {
    if (!site) return 25
    const gm = groundMeters(site.center.lat, site.zoom)
    return (side / gm) * site.scaleCalibration
  }, [site?.center.lat, site?.zoom, site?.scaleCalibration, side])

  const cx = size.w / 2
  const cy = size.h / 2
  const m2px = (p: Point) => ({ x: cx + p.x * pxPerMeter, y: cy + p.y * pxPerMeter })
  const px2m = (p: { x: number; y: number }): Point => ({ x: (p.x - cx) / pxPerMeter, y: (p.y - cy) / pxPerMeter })

  // render
  useEffect(() => {
    const c = canvasRef.current
    if (!c || !project || !site) return
    c.width = size.w; c.height = size.h
    const g = c.getContext('2d')!
    g.fillStyle = '#0f172a'; g.fillRect(0, 0, size.w, size.h)
    if (aerial) {
      g.drawImage(aerial, cx - side / 2, cy - side / 2, side, side)
    }

    drawPoly(g, site.propertyPolygon, m2px, { stroke: '#facc15', fill: 'rgba(250,204,21,0.08)', dash: [8, 6] })
    if (tool === 'property') drawHandles(g, site.propertyPolygon, m2px, '#facc15')
    drawPoly(g, site.housePolygon, m2px, { stroke: '#f87171', fill: 'rgba(248,113,113,0.12)', dash: [] })

    for (const o of project.design) {
      if (o.kind === 'hardscape') {
        drawPoly(g, o.polygon, m2px, { stroke: '#000', fill: o.color + 'a0', dash: [] })
      } else if (o.kind === 'water') {
        drawPoly(g, o.polygon, m2px, { stroke: '#1a3a60', fill: 'rgba(58,122,160,0.85)', dash: [] })
      } else if (o.kind === 'plant') {
        const q = m2px({ x: o.x, y: o.y })
        const spec = plantById(o.plantId)
        const sel = selected === o.id
        g.beginPath(); g.arc(q.x, q.y, o.radius * pxPerMeter, 0, Math.PI * 2)
        g.fillStyle = (spec?.color ?? '#5a8a4a') + '88'; g.fill()
        g.strokeStyle = sel ? '#fff' : (spec?.color ?? '#5a8a4a'); g.lineWidth = sel ? 2 : 1; g.stroke()
        g.beginPath(); g.arc(q.x, q.y, 3, 0, Math.PI * 2); g.fillStyle = '#fff'; g.fill()
      }
    }

    if (draft.length >= 2) {
      g.beginPath()
      for (let i = 0; i < draft.length; i += 2) i === 0 ? g.moveTo(draft[i], draft[i + 1]) : g.lineTo(draft[i], draft[i + 1])
      g.strokeStyle = tool === 'property' ? '#facc15' : '#5a8a4a'; g.lineWidth = 2; g.setLineDash([4, 4]); g.stroke(); g.setLineDash([])
    }
    if (calib.length >= 2) {
      g.beginPath(); g.moveTo(calib[0], calib[1]); if (calib.length >= 4) g.lineTo(calib[2], calib[3])
      g.strokeStyle = '#38bdf8'; g.lineWidth = 2; g.setLineDash([6, 4]); g.stroke(); g.setLineDash([])
      for (let i = 0; i < calib.length; i += 2) { g.beginPath(); g.arc(calib[i], calib[i + 1], 4, 0, Math.PI * 2); g.fillStyle = '#38bdf8'; g.fill() }
      if (calib.length >= 4) {
        const d = Math.hypot(calib[2] - calib[0], calib[3] - calib[1]) / pxPerMeter
        g.fillStyle = '#38bdf8'; g.font = '12px sans-serif'
        g.fillText(`${d.toFixed(2)} m`, (calib[0] + calib[2]) / 2 + 8, (calib[1] + calib[3]) / 2 - 6)
      }
    }

    // scale bar
    g.fillStyle = '#fff'; g.fillRect(20, size.h - 28, 5 * pxPerMeter, 4)
    g.font = '11px sans-serif'; g.fillText('5 m', 20, size.h - 36)
  }, [project, site, aerial, draft, calib, tool, selected, pxPerMeter, size, side])

  function onClick(e: React.MouseEvent) {
    if (!site) return
    const r = canvasRef.current!.getBoundingClientRect()
    const pos = { x: e.clientX - r.left, y: e.clientY - r.top }
    const m = px2m(pos)
    if (tool === 'plant') {
      const plant: Plant = { kind: 'plant', id: nanoid(8), plantId: activePlant.id, x: m.x, y: m.y, radius: activePlant.radius, height: activePlant.height }
      upsertObject(projectId, plant)
    } else if (tool === 'hardscape' || tool === 'water' || tool === 'property') {
      setDraft((d) => [...d, pos.x, pos.y])
    } else if (tool === 'calibrate') {
      setCalib((c) => (c.length >= 4 ? [pos.x, pos.y] : [...c, pos.x, pos.y]))
    } else if (tool === 'select') {
      // hit test plants
      let hit: string | null = null
      for (const o of project!.design) {
        if (o.kind === 'plant') {
          const q = m2px({ x: o.x, y: o.y })
          if (Math.hypot(pos.x - q.x, pos.y - q.y) <= o.radius * pxPerMeter) hit = o.id
        }
      }
      setSelected(hit)
    }
  }

  function finishPoly() {
    if (draft.length < 6) return setDraft([])
    const pts: Point[] = []
    for (let i = 0; i < draft.length; i += 2) pts.push(px2m({ x: draft[i], y: draft[i + 1] }))
    if (tool === 'property') setSite(projectId, { propertyPolygon: pts })
    else if (tool === 'hardscape') upsertObject(projectId, { kind: 'hardscape', id: nanoid(8), material: activeMaterial.id, color: activeMaterial.color, polygon: pts } as Hardscape)
    else upsertObject(projectId, { kind: 'water', id: nanoid(8), polygon: pts } as Water)
    setDraft([])
  }

  function applyCalibration() {
    const real = parseFloat(calibInput)
    if (!real || calib.length < 4 || !site) return
    const px = Math.hypot(calib[2] - calib[0], calib[3] - calib[1])
    const gm = groundMeters(site.center.lat, site.zoom)
    const base = side / gm
    setSite(projectId, { scaleCalibration: px / (real * base) })
    setCalib([]); setCalibInput(''); setTool('select')
  }

  async function doGeocode() {
    if (!addr) return
    setBusy(true)
    try {
      const r = await geocode(addr)
      setSite(projectId, { address: r.label, center: { lat: r.lat, lng: r.lng } })
    } catch (e) { alert((e as Error).message) } finally { setBusy(false) }
  }

  async function autoTrace() {
    if (!site) return
    setBusy(true)
    try {
      const { lot, house, mocked } = await fetchParcel(site.center.lat, site.center.lng)
      setSite(projectId, { propertyPolygon: lot, housePolygon: house })
      if (mocked) alert('Parcel data is mocked for now (rectangular lot + house). Wire Regrid + building footprints for real geometry.')
    } catch (e) { alert((e as Error).message) } finally { setBusy(false) }
  }

  if (!project || !site) return null

  const propertyArea = polyArea(site.propertyPolygon)
  const propertyPerim = polyPerim(site.propertyPolygon)

  return (
    <div className="grid grid-cols-[260px_1fr_280px] h-full">
      <aside className="border-r border-slate-800 bg-slate-900/60 p-3 overflow-y-auto">
        <div className="grid grid-cols-3 gap-1 mb-3">
          {([['select','Select',MousePointer2],['property','Lot',Hexagon],['calibrate','Scale',Ruler],['plant','Plant',Trees],['hardscape','Hard',Square],['water','Water',Waves]] as const)
            .map(([id, label, Icon]) => (
              <button key={id} onClick={() => setTool(id)}
                className={`px-2 py-1.5 rounded flex flex-col items-center gap-0.5 text-[10px] ${tool === id ? 'bg-moss-600' : 'bg-slate-800 hover:bg-slate-700'}`}>
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
        </div>

        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Address</h3>
        <div className="flex gap-1 mb-2">
          <input value={addr} onChange={(e) => setAddr(e.target.value)}
            placeholder={site.address || 'Search address'}
            onKeyDown={(e) => { if (e.key === 'Enter') doGeocode() }}
            className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm" />
          <button onClick={doGeocode} className="px-2 bg-slate-800 hover:bg-slate-700 rounded">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </button>
        </div>
        <button onClick={autoTrace}
          className="w-full text-sm px-3 py-1.5 mb-3 bg-slate-800 hover:bg-slate-700 rounded flex items-center justify-center gap-2">
          <Download className="w-3.5 h-3.5" /> Auto-trace lot &amp; house
        </button>
        <label className="text-xs text-slate-400 block mb-1">Zoom: {site.zoom}</label>
        <input type="range" min={17} max={21} value={site.zoom}
          onChange={(e) => setSite(projectId, { zoom: parseInt(e.target.value) })} className="w-full mb-4" />

        {tool === 'property' && (
          <ToolBox>
            <p className="text-xs text-slate-400 mb-2">Click each corner, then Finish. Or use Auto-trace above.</p>
            {site.propertyPolygon.length > 0 && <button onClick={() => setSite(projectId, { propertyPolygon: [] })} className="w-full text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded mb-1">Clear trace</button>}
            {draft.length >= 6 && <button onClick={finishPoly} className="w-full text-sm px-3 py-2 bg-moss-600 hover:bg-moss-500 rounded mt-1">Finish ({draft.length / 2} pts)</button>}
            {draft.length > 0 && <button onClick={() => setDraft([])} className="w-full text-xs text-slate-400 hover:text-slate-100 mt-1">Cancel</button>}
          </ToolBox>
        )}

        {tool === 'calibrate' && (
          <ToolBox>
            <p className="text-xs text-slate-400 mb-2">Click two ends of a known-length feature, then enter its real meters.</p>
            <div className="text-xs text-slate-500 mb-2">1 m = {pxPerMeter.toFixed(1)} px{site.scaleCalibration !== 1 && <span className="text-amber-400"> (×{site.scaleCalibration.toFixed(3)})</span>}</div>
            {calib.length >= 4 && (<>
              <label className="text-xs text-slate-400">Actual length (m):</label>
              <input type="number" step="0.01" autoFocus value={calibInput} onChange={(e) => setCalibInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') applyCalibration() }}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm mt-1" />
              <button onClick={applyCalibration} disabled={!calibInput} className="w-full mt-2 px-3 py-1.5 bg-moss-600 hover:bg-moss-500 disabled:bg-slate-800 rounded text-sm">Apply</button>
            </>)}
            {site.scaleCalibration !== 1 && <button onClick={() => setSite(projectId, { scaleCalibration: 1 })} className="w-full mt-2 px-3 py-1 text-xs text-slate-400 hover:text-slate-100">Reset scale</button>}
          </ToolBox>
        )}

        {tool === 'plant' && (
          <>
            <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Plants</h3>
            <div className="space-y-1">
              {PLANTS.map((p) => (
                <button key={p.id} onClick={() => setActivePlant(p)}
                  className={`w-full text-left text-sm px-2 py-1.5 rounded flex items-center gap-2 ${activePlant.id === p.id ? 'bg-moss-600' : 'bg-slate-800 hover:bg-slate-700'}`}>
                  <span className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                  <span className="flex-1 truncate">{p.name}</span><span className="text-xs text-slate-400">{p.radius}m</span>
                </button>
              ))}
            </div>
          </>
        )}

        {tool === 'hardscape' && (
          <>
            <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Materials</h3>
            <div className="space-y-1">
              {MATERIALS.map((m) => (
                <button key={m.id} onClick={() => setActiveMaterial(m)}
                  className={`w-full text-left text-sm px-2 py-1.5 rounded flex items-center gap-2 ${activeMaterial.id === m.id ? 'bg-moss-600' : 'bg-slate-800 hover:bg-slate-700'}`}>
                  <span className="w-3 h-3 rounded" style={{ background: m.color }} />{m.name}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3">Click to add vertices, then Finish.</p>
          </>
        )}

        {(tool === 'hardscape' || tool === 'water') && draft.length >= 6 && (
          <button onClick={finishPoly} className="w-full mt-3 px-3 py-2 bg-moss-600 hover:bg-moss-500 rounded text-sm">Finish ({draft.length / 2} pts)</button>
        )}
        {(tool === 'hardscape' || tool === 'water') && draft.length > 0 && (
          <button onClick={() => setDraft([])} className="w-full mt-1 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-100">Cancel</button>
        )}
      </aside>

      <div ref={wrapRef} className="bg-slate-950 relative">
        <canvas ref={canvasRef} onClick={onClick} className="cursor-crosshair" />
      </div>

      <aside className="border-l border-slate-800 bg-slate-900/60 p-3 overflow-y-auto">
        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Property</h3>
        {site.propertyPolygon.length >= 3 ? (
          <div className="text-sm space-y-1 mb-4">
            <Row label="Area" value={`${propertyArea.toFixed(0)} m² (${(propertyArea * 10.764).toFixed(0)} ft²)`} />
            <Row label="Perimeter" value={`${propertyPerim.toFixed(1)} m`} />
            <Row label="Vertices" value={`${site.propertyPolygon.length}`} />
          </div>
        ) : <p className="text-xs text-slate-500 mb-4">Trace with the <span className="text-yellow-400">Lot</span> tool or Auto-trace.</p>}

        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Plant schedule</h3>
        <PlantSchedule design={project.design} />

        {selected && (
          <button onClick={() => { removeObject(projectId, selected); setSelected(null) }}
            className="w-full mt-4 text-sm px-3 py-1.5 bg-red-900/40 hover:bg-red-900/70 rounded">Delete selected plant</button>
        )}
        {project.design.length > 0 && (
          <button onClick={() => { if (confirm('Clear the whole design?')) clearDesign(projectId) }}
            className="w-full mt-2 px-3 py-1.5 text-sm bg-slate-800 hover:bg-red-900/60 rounded">Clear design</button>
        )}
      </aside>
    </div>
  )
}

function ToolBox({ children }: { children: React.ReactNode }) {
  return <div className="p-2 mb-3 rounded bg-slate-950/60 border border-slate-800">{children}</div>
}
function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><span className="text-slate-400">{label}</span><span className="font-mono">{value}</span></div>
}

function PlantSchedule({ design }: { design: DesignObject[] }) {
  const counts = new Map<string, number>()
  for (const o of design) if (o.kind === 'plant') counts.set(o.plantId, (counts.get(o.plantId) || 0) + 1)
  if (counts.size === 0) return <p className="text-xs text-slate-500">No plants placed yet.</p>
  return (
    <ul className="text-sm space-y-1">
      {[...counts.entries()].map(([id, n]) => {
        const p = plantById(id)
        return <li key={id} className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: p?.color }} /><span className="flex-1 truncate">{p?.name}</span><span className="text-slate-400 text-xs">×{n}</span></li>
      })}
    </ul>
  )
}

function drawPoly(
  g: CanvasRenderingContext2D, poly: Point[], m2px: (p: Point) => { x: number; y: number },
  style: { stroke: string; fill: string; dash: number[] },
) {
  if (poly.length < 2) return
  g.beginPath()
  poly.forEach((p, i) => { const q = m2px(p); i === 0 ? g.moveTo(q.x, q.y) : g.lineTo(q.x, q.y) })
  g.closePath()
  g.fillStyle = style.fill; g.fill()
  g.strokeStyle = style.stroke; g.lineWidth = 2; g.setLineDash(style.dash); g.stroke(); g.setLineDash([])
}
function drawHandles(g: CanvasRenderingContext2D, poly: Point[], m2px: (p: Point) => { x: number; y: number }, color: string) {
  for (const p of poly) { const q = m2px(p); g.beginPath(); g.arc(q.x, q.y, 6, 0, Math.PI * 2); g.fillStyle = color; g.fill(); g.strokeStyle = '#000'; g.lineWidth = 1; g.stroke() }
}
function polyArea(poly: Point[]) {
  if (poly.length < 3) return 0
  let a = 0
  for (let i = 0; i < poly.length; i++) { const j = (i + 1) % poly.length; a += poly[i].x * poly[j].y - poly[j].x * poly[i].y }
  return Math.abs(a / 2)
}
function polyPerim(poly: Point[]) {
  if (poly.length < 2) return 0
  let p = 0
  for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length]; p += Math.hypot(b.x - a.x, b.y - a.y) }
  return p
}
````

---

<a id="components-AIPhotoStudio-tsx"></a>
## `components/AIPhotoStudio.tsx`

````typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import { Sparkles, Upload, Brush, Eraser, Loader2, MapPin, SplitSquareHorizontal } from 'lucide-react'
import { useStore } from '@/lib/store'
import { STYLE_PRESETS } from '@/lib/palette'
import { generateAI, streetViewDataUrl, getConfig } from '@/lib/apiClient'
import type { AISession } from '@/lib/types'
import BeforeAfter from './BeforeAfter'

export default function AIPhotoStudio({ projectId }: { projectId: string }) {
  const project = useStore((s) => s.projects[projectId])
  const addSession = useStore((s) => s.addSession)
  const updateSession = useStore((s) => s.updateSession)

  const [source, setSource] = useState<string | null>(null)
  const [prompt, setPrompt] = useState(STYLE_PRESETS[0].prompt)
  const [negative, setNegative] = useState('cluttered, low quality, deformed, blurry, watermark')
  const [controlnet, setControlnet] = useState('canny')
  const [busy, setBusy] = useState(false)
  const [svBusy, setSvBusy] = useState(false)
  const [tool, setTool] = useState<'brush' | 'erase'>('brush')
  const [brush, setBrush] = useState(40)
  const [compare, setCompare] = useState<{ sId: string; vId: string } | null>(null)
  const [cfg, setCfg] = useState<{ hasGoogle: boolean; hasReplicate: boolean }>({ hasGoogle: false, hasReplicate: false })

  const fileRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const maskRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)

  useEffect(() => { getConfig().then(setCfg) }, [])

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const fr = new FileReader()
    fr.onload = () => setSource(fr.result as string)
    fr.readAsDataURL(f)
  }

  async function pullStreetView() {
    if (!project) return
    setSvBusy(true)
    try {
      const url = await streetViewDataUrl(project.site.center.lat, project.site.center.lng)
      setSource(url)
    } catch (e) { alert((e as Error).message) } finally { setSvBusy(false) }
  }

  function syncCanvas() {
    const img = imgRef.current, c = maskRef.current
    if (!img || !c) return
    if (c.width !== img.clientWidth || c.height !== img.clientHeight) { c.width = img.clientWidth; c.height = img.clientHeight }
  }
  function paint(e: React.PointerEvent) {
    const c = maskRef.current!, r = c.getBoundingClientRect()
    const p = { x: e.clientX - r.left, y: e.clientY - r.top }
    const g = c.getContext('2d')!
    g.globalCompositeOperation = tool === 'brush' ? 'source-over' : 'destination-out'
    g.fillStyle = 'rgba(90,138,74,0.55)'
    g.beginPath(); g.arc(p.x, p.y, brush / 2, 0, Math.PI * 2); g.fill()
  }
  function exportMask(): string | undefined {
    const c = maskRef.current
    if (!c) return undefined
    const g = c.getContext('2d')!
    const data = g.getImageData(0, 0, c.width, c.height).data
    let any = false
    for (let i = 3; i < data.length; i += 4) if (data[i] > 10) { any = true; break }
    if (!any) return undefined
    const out = document.createElement('canvas'); out.width = c.width; out.height = c.height
    const o = out.getContext('2d')!; o.fillStyle = '#000'; o.fillRect(0, 0, out.width, out.height)
    const id = g.getImageData(0, 0, c.width, c.height), od = o.getImageData(0, 0, out.width, out.height)
    for (let i = 0; i < id.data.length; i += 4) { const v = id.data[i + 3] > 10 ? 255 : 0; od.data[i] = od.data[i + 1] = od.data[i + 2] = v; od.data[i + 3] = 255 }
    o.putImageData(od, 0, 0)
    return out.toDataURL('image/png')
  }

  async function generate() {
    if (!source || !project) return
    setBusy(true)
    try {
      const res = await generateAI({ sourceImageDataUrl: source, maskImageDataUrl: exportMask(), prompt, negativePrompt: negative, controlnet, variantCount: 4 })
      const session: AISession = {
        id: nanoid(8), createdAt: new Date().toISOString(), sourceUrl: source, prompt, controlnet,
        variants: res.variants.map((v) => ({ id: nanoid(8), url: v.url, seed: v.seed })),
      }
      addSession(projectId, session)
    } catch (e) { alert((e as Error).message) } finally { setBusy(false) }
  }

  function togglePin(sId: string, vId: string) {
    const s = project!.aiSessions.find((x) => x.id === sId)
    if (!s) return
    updateSession(projectId, sId, { variants: s.variants.map((v) => (v.id === vId ? { ...v, pinned: !v.pinned } : v)) })
  }

  if (!project) return null
  const session = compare ? project.aiSessions.find((s) => s.id === compare.sId) : null
  const variant = session?.variants.find((v) => v.id === compare?.vId)

  return (
    <div className="grid grid-cols-[1fr_320px] h-full">
      <div className="bg-slate-900/30 relative overflow-auto p-6">
        {!source ? (
          <div className="w-full h-full min-h-[400px] rounded-lg border-2 border-dashed border-slate-700 flex flex-col items-center justify-center gap-4 text-slate-400">
            <Upload className="w-10 h-10" />
            <div>Upload a yard photo, or pull the front of the house from Street View</div>
            <div className="flex gap-2">
              <button onClick={() => fileRef.current?.click()} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-sm">Upload photo</button>
              <button onClick={pullStreetView} disabled={svBusy} className="px-3 py-1.5 bg-moss-600 hover:bg-moss-500 rounded text-sm flex items-center gap-1">
                {svBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />} Street View
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative inline-block max-w-full">
              <img ref={imgRef} src={source} onLoad={syncCanvas} className="max-w-full rounded-lg border border-slate-800" alt="source" />
              <canvas ref={maskRef} className="absolute inset-0 cursor-crosshair rounded-lg"
                onPointerDown={(e) => { drawing.current = true; (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId); paint(e) }}
                onPointerMove={(e) => { if (drawing.current) paint(e) }}
                onPointerUp={(e) => { drawing.current = false; (e.target as HTMLCanvasElement).releasePointerCapture(e.pointerId) }} />
            </div>
            {project.aiSessions.map((s) => (
              <div key={s.id} className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                <div className="text-xs text-slate-400 mb-2 truncate"><span className="uppercase tracking-wider text-slate-500 mr-2">{s.controlnet}</span>{s.prompt}</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {s.variants.map((v) => (
                    <div key={v.id} className="relative group">
                      <button onClick={() => setCompare({ sId: s.id, vId: v.id })} className="block w-full">
                        <img src={v.url} alt="variant" className="w-full aspect-square object-cover rounded border border-slate-800 group-hover:border-moss-500 transition" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition grid place-items-center rounded">
                          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-moss-600"><SplitSquareHorizontal className="w-3.5 h-3.5" /> Compare</span>
                        </div>
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); togglePin(s.id, v.id) }}
                        className={`absolute top-1 right-1 p-1 rounded text-xs ${v.pinned ? 'bg-moss-600' : 'bg-black/60 opacity-0 group-hover:opacity-100'}`}>{v.pinned ? '★' : '☆'}</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
      </div>

      <aside className="border-l border-slate-800 bg-slate-900/60 p-4 overflow-y-auto">
        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Source</h3>
        <div className="grid grid-cols-2 gap-1 mb-4">
          <button onClick={() => fileRef.current?.click()} className="text-sm px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded flex items-center justify-center gap-1"><Upload className="w-4 h-4" /> Upload</button>
          <button onClick={pullStreetView} disabled={svBusy} className="text-sm px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded flex items-center justify-center gap-1">{svBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />} Street View</button>
        </div>

        {source && (<>
          <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Mask</h3>
          <div className="flex gap-1 mb-2">
            <button onClick={() => setTool('brush')} className={`flex-1 px-2 py-1.5 rounded text-sm flex items-center justify-center gap-1 ${tool === 'brush' ? 'bg-moss-600' : 'bg-slate-800'}`}><Brush className="w-3.5 h-3.5" /> Brush</button>
            <button onClick={() => setTool('erase')} className={`flex-1 px-2 py-1.5 rounded text-sm flex items-center justify-center gap-1 ${tool === 'erase' ? 'bg-moss-600' : 'bg-slate-800'}`}><Eraser className="w-3.5 h-3.5" /> Erase</button>
          </div>
          <label className="text-xs text-slate-400">Brush: {brush}px</label>
          <input type="range" min={4} max={120} value={brush} onChange={(e) => setBrush(parseInt(e.target.value))} className="w-full mb-4" />
        </>)}

        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Style presets</h3>
        <div className="grid grid-cols-2 gap-1 mb-3">
          {STYLE_PRESETS.map((p) => (
            <button key={p.label} onClick={() => setPrompt(p.prompt)} title={p.prompt} className="text-xs px-2 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-left truncate">{p.label}</button>
          ))}
        </div>

        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Prompt</h3>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm mb-3" />
        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Negative</h3>
        <textarea value={negative} onChange={(e) => setNegative(e.target.value)} rows={2} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm mb-3" />

        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Model</h3>
        <select value={controlnet} onChange={(e) => setControlnet(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm mb-4">
          <option value="canny">ControlNet — Canny (keep structure, restyle)</option>
          <option value="depth">ControlNet — Depth (replace objects)</option>
          <option value="seg">ControlNet — Seg (swap by category)</option>
          <option value="none">SDXL (concept board, no input control)</option>
        </select>

        <button onClick={generate} disabled={!source || busy}
          className="w-full px-3 py-2 bg-moss-600 hover:bg-moss-500 disabled:bg-slate-800 disabled:text-slate-500 rounded text-sm font-medium flex items-center justify-center gap-2">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}{busy ? 'Generating…' : 'Generate 4 variants'}
        </button>
        {!cfg.hasReplicate && <p className="text-xs text-amber-400 mt-3">No Replicate key set — generation returns the source as mock variants. Add REPLICATE_API_TOKEN for real renders.</p>}
        {!cfg.hasGoogle && <p className="text-xs text-amber-400 mt-2">No Google key set — Street View is unavailable. Add GOOGLE_MAPS_API_KEY.</p>}
      </aside>

      {session && variant && (
        <BeforeAfter beforeUrl={session.sourceUrl} afterUrl={variant.url} prompt={session.prompt} pinned={!!variant.pinned}
          onTogglePin={() => togglePin(session.id, variant.id)} onClose={() => setCompare(null)} />
      )}
    </div>
  )
}
````

---

<a id="components-BeforeAfter-tsx"></a>
## `components/BeforeAfter.tsx`

````typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import { X, ArrowLeftRight } from 'lucide-react'

export default function BeforeAfter({
  beforeUrl, afterUrl, prompt, pinned, onClose, onTogglePin,
}: {
  beforeUrl: string
  afterUrl: string
  prompt?: string
  pinned?: boolean
  onClose: () => void
  onTogglePin?: () => void
}) {
  const [pos, setPos] = useState(50)
  const [swap, setSwap] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  useEffect(() => {
    function k(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 2))
      if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 2))
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])

  function fromX(x: number) {
    const r = wrap.current!.getBoundingClientRect()
    setPos(Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100)))
  }

  const left = swap ? afterUrl : beforeUrl
  const right = swap ? beforeUrl : afterUrl

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex flex-col">
      <div className="flex items-center gap-3 px-4 h-12 border-b border-slate-800">
        <span className="text-sm font-medium">Before / after</span>
        {prompt && <span className="text-xs text-slate-400 truncate flex-1">{prompt}</span>}
        <button onClick={() => setSwap((s) => !s)} className="text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded flex items-center gap-1"><ArrowLeftRight className="w-3.5 h-3.5" /> Swap</button>
        {onTogglePin && <button onClick={onTogglePin} className={`text-xs px-2 py-1 rounded ${pinned ? 'bg-moss-600' : 'bg-slate-800 hover:bg-slate-700'}`}>{pinned ? '★ Pinned' : '☆ Pin'}</button>}
        <button onClick={onClose} className="text-slate-400 hover:text-slate-100"><X className="w-5 h-5" /></button>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
        <div ref={wrap} className="relative max-w-full max-h-full select-none cursor-ew-resize"
          onPointerDown={(e) => { dragging.current = true; (e.target as HTMLElement).setPointerCapture(e.pointerId); fromX(e.clientX) }}
          onPointerMove={(e) => { if (dragging.current) fromX(e.clientX) }}
          onPointerUp={(e) => { dragging.current = false; (e.target as HTMLElement).releasePointerCapture(e.pointerId) }}>
          <img src={left} alt="before" className="block max-w-[90vw] max-h-[80vh] pointer-events-none" draggable={false} />
          <img src={right} alt="after" className="absolute inset-0 w-full h-full pointer-events-none" draggable={false} style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
          <div className="absolute top-2 left-2 text-[10px] uppercase tracking-wider font-semibold bg-black/70 px-2 py-0.5 rounded">{swap ? 'After' : 'Before'}</div>
          <div className="absolute top-2 right-2 text-[10px] uppercase tracking-wider font-semibold bg-moss-600 px-2 py-0.5 rounded">{swap ? 'Before' : 'After'}</div>
          <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}>
            <div className="w-0.5 h-full bg-white shadow-lg" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-lg grid place-items-center text-slate-900"><ArrowLeftRight className="w-4 h-4" /></div>
          </div>
        </div>
      </div>
      <div className="px-6 pb-4 flex items-center gap-3 text-xs text-slate-400">
        <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(parseInt(e.target.value))} className="flex-1" />
        <span className="w-10 text-right font-mono">{Math.round(pos)}%</span>
      </div>
    </div>
  )
}
````

---

<a id="components-SceneViewer-tsx"></a>
## `components/SceneViewer.tsx`

````typescript
'use client'

import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, Sky, Environment, Grid, Line } from '@react-three/drei'
import { TextureLoader, type Texture } from 'three'
import { Suspense, useMemo, useState } from 'react'
import { Sun, Crosshair } from 'lucide-react'
import { useStore } from '@/lib/store'
import { aerialUrl } from '@/lib/apiClient'
import PlantModel from './PlantModel'
import type { DesignObject, Point } from '@/lib/types'

function groundMeters(lat: number, zoom: number, sizeLogical = 640) {
  return (sizeLogical * 156543.03392 * Math.cos((lat * Math.PI) / 180)) / Math.pow(2, zoom)
}

export default function SceneViewer({ projectId }: { projectId: string }) {
  const project = useStore((s) => s.projects[projectId])
  const [time, setTime] = useState(13)
  const [azimuth, setAzimuth] = useState(160)
  const [recenter, setRecenter] = useState(0)

  const sun = useMemo(() => {
    const t = (time - 6) / 12
    const elev = Math.sin(t * Math.PI)
    const az = (azimuth * Math.PI) / 180
    return [Math.sin(az) * 100, Math.max(2, elev * 80), Math.cos(az) * 100] as [number, number, number]
  }, [time, azimuth])

  const target = useMemo<[number, number, number]>(() => {
    const poly = project?.site.propertyPolygon
    if (!poly || poly.length < 3) return [0, 1, 0]
    let sx = 0, sy = 0
    for (const p of poly) { sx += p.x; sy += p.y }
    return [sx / poly.length, 1, sy / poly.length]
  }, [project?.site.propertyPolygon])

  if (!project) return null
  const site = project.site
  const gm = groundMeters(site.center.lat, site.zoom)

  return (
    <div className="grid grid-cols-[1fr_260px] h-full">
      <div className="bg-slate-950 relative">
        <Canvas key={recenter} camera={{ position: [25, 18, 25], fov: 50 }} shadows>
          <Suspense fallback={null}>
            <Sky sunPosition={sun} turbidity={6} rayleigh={1} />
            <ambientLight intensity={0.35} />
            <directionalLight position={sun} intensity={1.1} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
              shadow-camera-left={-50} shadow-camera-right={50} shadow-camera-top={50} shadow-camera-bottom={-50} />
            <SatelliteGround lat={site.center.lat} lng={site.center.lng} zoom={site.zoom} sizeMeters={gm} />
            <Grid args={[80, 80]} cellColor="#2a3a2a" sectionColor="#3a5a3a" fadeDistance={60} infiniteGrid position={[0, 0.011, 0]} />
            <Outline polygon={site.propertyPolygon} color="#facc15" />
            <Outline polygon={site.housePolygon} color="#f87171" />
            <House polygon={site.housePolygon} />
            {project.design.map((o) => <SceneObject key={o.id} obj={o} />)}
            <Environment preset="park" background={false} />
            <OrbitControls enableDamping target={target} maxPolarAngle={Math.PI / 2.1} />
          </Suspense>
        </Canvas>
        {project.design.length === 0 && (
          <div className="absolute inset-0 grid place-items-center text-slate-500 text-sm pointer-events-none">Add objects on the 2D plan to see them here.</div>
        )}
      </div>

      <aside className="border-l border-slate-800 bg-slate-900/60 p-3 overflow-y-auto">
        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1"><Sun className="w-3.5 h-3.5" /> Sun</h3>
        <label className="text-xs text-slate-400">Time of day: {time}:00</label>
        <input type="range" min={6} max={20} value={time} onChange={(e) => setTime(parseInt(e.target.value))} className="w-full mb-3" />
        <label className="text-xs text-slate-400">Azimuth: {azimuth}°</label>
        <input type="range" min={0} max={360} value={azimuth} onChange={(e) => setAzimuth(parseInt(e.target.value))} className="w-full mb-4" />

        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Camera</h3>
        <button onClick={() => setRecenter((r) => r + 1)} className="w-full text-sm px-3 py-1.5 mb-2 bg-slate-800 hover:bg-slate-700 rounded flex items-center justify-center gap-2"><Crosshair className="w-3.5 h-3.5" /> Recenter on property</button>
        <p className="text-xs text-slate-500">Drag = orbit · Scroll = zoom · Right-drag = pan</p>

        <h3 className="text-xs uppercase tracking-wider text-slate-500 mt-6 mb-2">Status</h3>
        <ul className="text-xs text-slate-400 space-y-0.5">
          <li>{project.design.filter((o) => o.kind === 'plant').length} plants</li>
          <li>{project.design.filter((o) => o.kind === 'hardscape').length} hardscape areas</li>
          <li>{project.design.filter((o) => o.kind === 'water').length} water features</li>
          <li>{site.propertyPolygon.length >= 3 ? 'Property line set' : 'No property line'}</li>
          <li>{site.housePolygon.length >= 3 ? 'House footprint set' : 'No house footprint'}</li>
        </ul>
        <p className="text-[11px] text-slate-500 mt-4">Phase C will swap this stylized ground for Google Photorealistic 3D Tiles — the real textured house.</p>
      </aside>
    </div>
  )
}

function SatelliteGround({ lat, lng, zoom, sizeMeters }: { lat: number; lng: number; zoom: number; sizeMeters: number }) {
  const tex = useLoader(TextureLoader, aerialUrl(lat, lng, zoom)) as Texture
  tex.anisotropy = 8
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[Math.max(40, sizeMeters), Math.max(40, sizeMeters)]} />
      <meshStandardMaterial map={tex} roughness={1} />
    </mesh>
  )
}

function Outline({ polygon, color }: { polygon: Point[]; color: string }) {
  if (polygon.length < 3) return null
  const pts = polygon.map((p) => [p.x, 0.03, p.y] as [number, number, number])
  pts.push(pts[0])
  return <Line points={pts} color={color} lineWidth={2} />
}

function House({ polygon }: { polygon: Point[] }) {
  if (polygon.length < 3) return null
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  for (const p of polygon) { if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x; if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y }
  const w = maxX - minX, d = maxY - minY
  const cx = (minX + maxX) / 2, cz = (minY + maxY) / 2
  const h = 5
  return (
    <group position={[cx, 0, cz]}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[Math.max(w, 1), h, Math.max(d, 1)]} />
        <meshStandardMaterial color="#d8d2c4" roughness={0.9} />
      </mesh>
      <mesh position={[0, h + 0.6, 0]} castShadow>
        <coneGeometry args={[Math.max(w, d) * 0.72, 1.4, 4]} />
        <meshStandardMaterial color="#8a4b3a" roughness={0.9} />
      </mesh>
    </group>
  )
}

function SceneObject({ obj }: { obj: DesignObject }) {
  if (obj.kind === 'plant') return <PlantModel plant={obj} />
  const [cx, cz] = centroid(obj.polygon)
  const { w, d } = bbox(obj.polygon)
  const water = obj.kind === 'water'
  return (
    <mesh position={[cx, water ? 0.04 : 0.02, cz]} receiveShadow>
      <boxGeometry args={[Math.max(w, 0.5), water ? 0.08 : 0.04, Math.max(d, 0.5)]} />
      <meshStandardMaterial color={water ? '#3a7aa0' : (obj.kind === 'hardscape' ? obj.color : '#888')} roughness={water ? 0.15 : 0.9} metalness={water ? 0.2 : 0} />
    </mesh>
  )
}

function centroid(poly: Point[]): [number, number] { let sx = 0, sy = 0; for (const p of poly) { sx += p.x; sy += p.y } return [sx / poly.length, sy / poly.length] }
function bbox(poly: Point[]) { let mnX = Infinity, mxX = -Infinity, mnY = Infinity, mxY = -Infinity; for (const p of poly) { if (p.x < mnX) mnX = p.x; if (p.x > mxX) mxX = p.x; if (p.y < mnY) mnY = p.y; if (p.y > mxY) mxY = p.y } return { w: mxX - mnX, d: mxY - mnY } }
````

---

<a id="components-PlantModel-tsx"></a>
## `components/PlantModel.tsx`

````typescript
'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, Group } from 'three'
import type { Plant } from '@/lib/types'
import { plantById } from '@/lib/palette'

function seed(id: string) { let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0; return ((h >>> 0) % 1000) / 1000 }
function tint(hex: string, amt: number) { const c = new Color(hex); c.r = Math.min(1, c.r + amt); c.g = Math.min(1, c.g + amt); c.b = Math.min(1, c.b + amt); return `#${c.getHexString()}` }

export default function PlantModel({ plant }: { plant: Plant }) {
  const spec = plantById(plant.plantId)
  const cat = spec?.category ?? 'shrub'
  const color = spec?.color ?? '#5a8a4a'
  const s = seed(plant.id)
  return (
    <group position={[plant.x, 0, plant.y]}>
      {cat === 'tree' && <Tree plant={plant} color={color} s={s} />}
      {cat === 'shrub' && <Shrub plant={plant} color={color} s={s} />}
      {cat === 'grass' && <Grass plant={plant} color={color} />}
      {cat === 'perennial' && <Perennial plant={plant} color={color} />}
      {cat === 'groundcover' && <GroundCover plant={plant} color={color} />}
    </group>
  )
}

function Tree({ plant, color, s }: { plant: Plant; color: string; s: number }) {
  const r = plant.radius
  const trunkH = Math.max(0.6, plant.height * 0.45)
  const sway = useRef<Group>(null)
  useFrame(({ clock }) => { if (sway.current) { const t = clock.elapsedTime + s * 6; sway.current.rotation.x = Math.sin(t * 0.6) * 0.012; sway.current.rotation.z = Math.cos(t * 0.5) * 0.015 } })
  return (
    <group>
      <mesh position={[0, trunkH / 2, 0]} castShadow>
        <cylinderGeometry args={[Math.max(0.06, r * 0.07), Math.max(0.09, r * 0.1), trunkH, 10]} />
        <meshStandardMaterial color="#5a3e22" roughness={0.95} />
      </mesh>
      <group ref={sway} position={[0, trunkH, 0]}>
        <mesh position={[0, r * 0.8, 0]} castShadow><sphereGeometry args={[r, 18, 14]} /><meshStandardMaterial color={color} roughness={0.85} /></mesh>
        <mesh position={[r * 0.35, r * 1.1, r * 0.1]} castShadow><sphereGeometry args={[r * 0.72, 14, 12]} /><meshStandardMaterial color={tint(color, 0.05)} roughness={0.9} /></mesh>
        <mesh position={[-r * 0.4, r * 0.9, r * 0.25]} castShadow><sphereGeometry args={[r * 0.65, 14, 12]} /><meshStandardMaterial color={tint(color, -0.05)} roughness={0.9} /></mesh>
      </group>
    </group>
  )
}

function Shrub({ plant, color, s }: { plant: Plant; color: string; s: number }) {
  const r = plant.radius
  const offs: [number, number, number, number][] = [[0, r * 0.6, 0, 1], [r * 0.5, r * 0.5, r * 0.1, 0.75], [-r * 0.45, r * 0.45, r * 0.2, 0.7], [r * 0.1, r * 0.4, -r * 0.5, 0.65]]
  return <group>{offs.map(([x, y, z, sc], i) => <mesh key={i} position={[x + s * 0.02, y, z]} castShadow><sphereGeometry args={[r * sc, 12, 10]} /><meshStandardMaterial color={i % 2 ? tint(color, 0.04) : tint(color, -0.04)} roughness={0.9} /></mesh>)}</group>
}

function Grass({ plant, color }: { plant: Plant; color: string }) {
  const r = plant.radius, h = Math.max(0.25, plant.height)
  const blades = useMemo(() => Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; const dr = r * (0.2 + Math.random() * 0.6); return { x: Math.cos(a) * dr, z: Math.sin(a) * dr, ry: Math.random() * Math.PI * 2, tilt: (Math.random() - 0.5) * 0.4 } }), [plant.id, r])
  return <group>{blades.map((b, i) => <mesh key={i} position={[b.x, h / 2, b.z]} rotation={[b.tilt, b.ry, 0]} castShadow><coneGeometry args={[r * 0.06, h, 5]} /><meshStandardMaterial color={color} roughness={0.9} /></mesh>)}</group>
}

function Perennial({ plant, color }: { plant: Plant; color: string }) {
  const r = plant.radius, h = Math.max(0.2, plant.height)
  return <group>
    <mesh position={[0, h * 0.4, 0]} castShadow><sphereGeometry args={[r, 14, 10]} /><meshStandardMaterial color={color} roughness={0.95} /></mesh>
    <mesh position={[0, h * 0.9, 0]} castShadow><sphereGeometry args={[r * 0.6, 12, 8]} /><meshStandardMaterial color={tint(color, 0.25)} roughness={0.7} /></mesh>
  </group>
}

function GroundCover({ plant, color }: { plant: Plant; color: string }) {
  return <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[plant.radius, 20]} /><meshStandardMaterial color={color} roughness={0.95} /></mesh>
}
````

---

<a id="web-demo-index-html"></a>
## `web-demo/index.html`

````html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Landscape Studio — Web Demo</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    html, body, #app { height: 100%; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; }
    canvas { display: block; }
    .cursor-ew-resize { cursor: ew-resize; }
    .cursor-crosshair { cursor: crosshair; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100">
  <div id="app"></div>

  <script type="module">
    import { html, render, useState, useEffect, useRef, useMemo, useCallback }
      from 'https://esm.sh/htm@3.1.1/preact/standalone'
    import * as THREE from 'https://esm.sh/three@0.169.0'
    import { OrbitControls } from 'https://esm.sh/three@0.169.0/examples/jsm/controls/OrbitControls.js'

    /* ---------- catalog ---------- */
    const PLANTS = [
      { id: 'oak',      name: 'Coast Live Oak',   radius: 6,   height: 12,  color: '#3e6b2a', category: 'tree' },
      { id: 'maple',    name: 'Japanese Maple',   radius: 2.5, height: 4,   color: '#a14b2a', category: 'tree' },
      { id: 'olive',    name: 'Olive Tree',       radius: 3.5, height: 6,   color: '#7a8a52', category: 'tree' },
      { id: 'myrtle',   name: 'Crepe Myrtle',     radius: 2,   height: 5,   color: '#a05a7a', category: 'tree' },
      { id: 'box',      name: 'Boxwood',          radius: 0.6, height: 1,   color: '#4a7044', category: 'shrub' },
      { id: 'rosemary', name: 'Rosemary',         radius: 0.7, height: 0.8, color: '#5a7a5a', category: 'shrub' },
      { id: 'lavender', name: 'Lavender',         radius: 0.5, height: 0.6, color: '#7a6aa0', category: 'perennial' },
      { id: 'agave',    name: 'Century Plant',    radius: 1.2, height: 1.5, color: '#6a8a6a', category: 'shrub' },
      { id: 'fescue',   name: 'Blue Fescue',      radius: 0.3, height: 0.3, color: '#6a8aa0', category: 'grass' },
      { id: 'sedum',    name: 'Stonecrop',        radius: 0.4, height: 0.5, color: '#7a8a4a', category: 'groundcover' },
    ]
    const plantById = (id) => PLANTS.find(p => p.id === id)

    const MATERIALS = [
      { id: 'flagstone', name: 'Flagstone', color: '#a09b8a' },
      { id: 'concrete',  name: 'Concrete',  color: '#c8c8c0' },
      { id: 'pavers',    name: 'Pavers',    color: '#8a7a6a' },
      { id: 'gravel',    name: 'Gravel',    color: '#b0a890' },
      { id: 'turf',      name: 'Turf',      color: '#5a8a4a' },
      { id: 'mulch',     name: 'Mulch',     color: '#5a3e22' },
      { id: 'deck',      name: 'Wood deck', color: '#7a5a3a' },
    ]

    const STYLE_PRESETS = [
      { label: 'Modern xeriscape',
        prompt: 'desert-adapted, gravel, agave, golden hour',
        filter: 'saturate(0.85) hue-rotate(-15deg) brightness(1.1) contrast(1.05)' },
      { label: 'Tropical resort',
        prompt: 'palms, monstera, lush ferns, soft evening light',
        filter: 'saturate(1.4) hue-rotate(20deg) brightness(1.08) contrast(1.05)' },
      { label: 'English cottage',
        prompt: 'lavender, roses, foxglove, stone path',
        filter: 'saturate(1.15) hue-rotate(8deg) brightness(1.05)' },
      { label: 'Japanese zen',
        prompt: 'raked gravel, moss, stone lanterns, japanese maple',
        filter: 'saturate(0.75) sepia(0.15) brightness(1.02) contrast(1.1)' },
      { label: 'Mediterranean',
        prompt: 'olive trees, terracotta, rosemary, stucco walls',
        filter: 'saturate(1.2) hue-rotate(-8deg) brightness(1.06) contrast(1.05)' },
      { label: 'Desert modern',
        prompt: 'saguaro, ocotillo, rusted steel planters, dramatic shadows',
        filter: 'saturate(0.95) hue-rotate(-25deg) brightness(1.12) contrast(1.15)' },
    ]

    const nid = () => Math.random().toString(36).slice(2, 10)

    /* ---------- root app ---------- */
    function App() {
      const [tab, setTab] = useState('plan')
      const [design, setDesign] = useState([])
      const [property, setProperty] = useState([])
      const [scale, setScale] = useState(1) // calibration multiplier
      const [photoSource, setPhotoSource] = useState(null)
      const [photoSessions, setPhotoSessions] = useState([])

      const ctx = { design, setDesign, property, setProperty, scale, setScale,
                    photoSource, setPhotoSource, photoSessions, setPhotoSessions }

      return html`
        <div class="flex flex-col h-screen">
          <header class="flex items-center justify-between px-4 h-12 border-b border-slate-800 bg-slate-900/60">
            <div class="flex items-center gap-2 font-semibold">
              <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22V12M5 12s2-7 7-7 7 7 7 7M5 12c0 4 3 7 7 7s7-3 7-7M5 12c0 2 1 4 3 5M19 12c0 2-1 4-3 5"
                  stroke-linecap="round" stroke-linejoin="round" class="text-green-500"/>
              </svg>
              Landscape Studio
              <span class="text-xs text-slate-500 ml-2 font-normal">Web preview</span>
            </div>
            <nav class="flex items-center gap-1">
              ${[
                ['photo', 'AI photo'],
                ['plan',  '2D plan'],
                ['scene', '3D scene'],
              ].map(([id, label]) => html`
                <button onClick=${() => setTab(id)}
                  class="px-3 py-1.5 rounded text-sm transition ${tab === id ? 'bg-green-700 text-white' : 'text-slate-300 hover:bg-slate-800'}">
                  ${label}
                </button>
              `)}
            </nav>
            <a href="https://github.com/porterjohn911/landscape" target="_blank"
               class="text-xs text-slate-400 hover:text-slate-100">source on GitHub →</a>
          </header>
          <main class="flex-1 overflow-hidden">
            ${tab === 'plan'  ? html`<${PlanView} ...${ctx} />` : ''}
            ${tab === 'scene' ? html`<${SceneView} ...${ctx} />` : ''}
            ${tab === 'photo' ? html`<${PhotoView} ...${ctx} />` : ''}
          </main>
        </div>
      `
    }

    /* =========================================================================
       2D PLAN
       ========================================================================= */
    function PlanView({ design, setDesign, property, setProperty, scale, setScale }) {
      const [tool, setTool] = useState('plant')
      const [activePlant, setActivePlant] = useState(PLANTS[0])
      const [activeMaterial, setActiveMaterial] = useState(MATERIALS[0])
      const [draftPoly, setDraftPoly] = useState([])
      const [calibPts, setCalibPts] = useState([])
      const [calibInput, setCalibInput] = useState('')
      const wrapRef = useRef(null)
      const canvasRef = useRef(null)
      const [size, setSize] = useState({ w: 1000, h: 700 })

      const pxPerMeter = 25 * scale
      const cx = size.w / 2
      const cy = size.h / 2
      const m2px = (p) => ({ x: cx + p.x * pxPerMeter, y: cy + p.y * pxPerMeter })
      const px2m = (p) => ({ x: (p.x - cx) / pxPerMeter, y: (p.y - cy) / pxPerMeter })

      useEffect(() => {
        function resize() {
          const r = wrapRef.current?.getBoundingClientRect()
          if (r) setSize({ w: r.width, h: r.height })
        }
        resize()
        window.addEventListener('resize', resize)
        return () => window.removeEventListener('resize', resize)
      }, [])

      useEffect(() => { setDraftPoly([]); setCalibPts([]); setCalibInput('') }, [tool])

      // re-render the canvas every time anything visible changes
      useEffect(() => {
        const c = canvasRef.current
        if (!c) return
        c.width = size.w
        c.height = size.h
        const g = c.getContext('2d')
        // background: faux satellite (mottled greens)
        const grad = g.createLinearGradient(0, 0, size.w, size.h)
        grad.addColorStop(0, '#2e4628'); grad.addColorStop(1, '#4a6238')
        g.fillStyle = grad; g.fillRect(0, 0, size.w, size.h)
        // soft noise blobs
        for (let i = 0; i < 80; i++) {
          g.fillStyle = `rgba(${30 + Math.random()*40}, ${70 + Math.random()*40}, ${30 + Math.random()*30}, 0.4)`
          const x = Math.random() * size.w, y = Math.random() * size.h
          const r = 20 + Math.random() * 60
          g.beginPath(); g.arc(x, y, r, 0, Math.PI*2); g.fill()
        }
        // grid
        g.strokeStyle = 'rgba(255,255,255,0.05)'; g.lineWidth = 1
        for (let x = (cx % pxPerMeter); x < size.w; x += pxPerMeter) { g.beginPath(); g.moveTo(x,0); g.lineTo(x,size.h); g.stroke() }
        for (let y = (cy % pxPerMeter); y < size.h; y += pxPerMeter) { g.beginPath(); g.moveTo(0,y); g.lineTo(size.w,y); g.stroke() }
        // property polygon
        if (property.length >= 3) {
          g.beginPath()
          property.forEach((p, i) => {
            const q = m2px(p); if (i === 0) g.moveTo(q.x, q.y); else g.lineTo(q.x, q.y)
          })
          g.closePath()
          g.fillStyle = 'rgba(250, 204, 21, 0.08)'; g.fill()
          g.strokeStyle = '#facc15'; g.lineWidth = 2; g.setLineDash([8, 6]); g.stroke(); g.setLineDash([])
          if (tool === 'property') {
            property.forEach(p => {
              const q = m2px(p)
              g.beginPath(); g.arc(q.x, q.y, 6, 0, Math.PI*2)
              g.fillStyle = '#facc15'; g.fill()
              g.strokeStyle = '#000'; g.lineWidth = 1; g.stroke()
            })
          }
        }
        // design
        for (const o of design) {
          if (o.kind === 'hardscape') {
            g.beginPath()
            o.polygon.forEach((p, i) => { const q = m2px(p); if (i===0) g.moveTo(q.x,q.y); else g.lineTo(q.x,q.y) })
            g.closePath()
            g.fillStyle = o.color + 'a0'; g.fill()
            g.strokeStyle = '#000'; g.lineWidth = 1; g.stroke()
          } else if (o.kind === 'water') {
            g.beginPath()
            o.polygon.forEach((p, i) => { const q = m2px(p); if (i===0) g.moveTo(q.x,q.y); else g.lineTo(q.x,q.y) })
            g.closePath()
            g.fillStyle = 'rgba(58, 122, 160, 0.85)'; g.fill()
            g.strokeStyle = '#1a3a60'; g.lineWidth = 1; g.stroke()
          } else if (o.kind === 'plant') {
            const q = m2px({ x: o.x, y: o.y })
            const spec = plantById(o.plantId)
            g.beginPath(); g.arc(q.x, q.y, o.radius * pxPerMeter, 0, Math.PI*2)
            g.fillStyle = (spec?.color ?? '#5a8a4a') + '88'; g.fill()
            g.strokeStyle = spec?.color ?? '#5a8a4a'; g.lineWidth = 1; g.stroke()
            g.beginPath(); g.arc(q.x, q.y, 3, 0, Math.PI*2)
            g.fillStyle = '#fff'; g.fill()
          }
        }
        // in-progress polygon
        if (draftPoly.length >= 2) {
          g.beginPath()
          for (let i = 0; i < draftPoly.length; i += 2) {
            if (i === 0) g.moveTo(draftPoly[i], draftPoly[i+1])
            else         g.lineTo(draftPoly[i], draftPoly[i+1])
          }
          g.strokeStyle = tool === 'property' ? '#facc15' : '#5a8a4a'
          g.lineWidth = 2; g.setLineDash([4,4]); g.stroke(); g.setLineDash([])
        }
        // calibration line
        if (calibPts.length >= 2) {
          g.beginPath(); g.moveTo(calibPts[0], calibPts[1])
          if (calibPts.length >= 4) g.lineTo(calibPts[2], calibPts[3])
          g.strokeStyle = '#38bdf8'; g.lineWidth = 2; g.setLineDash([6,4]); g.stroke(); g.setLineDash([])
          for (let i = 0; i < calibPts.length; i += 2) {
            g.beginPath(); g.arc(calibPts[i], calibPts[i+1], 4, 0, Math.PI*2); g.fillStyle = '#38bdf8'; g.fill()
          }
          if (calibPts.length >= 4) {
            const d = Math.hypot(calibPts[2]-calibPts[0], calibPts[3]-calibPts[1]) / pxPerMeter
            g.fillStyle = '#38bdf8'; g.font = '12px sans-serif'
            g.fillText(`${d.toFixed(2)} m`,
              (calibPts[0]+calibPts[2])/2 + 8, (calibPts[1]+calibPts[3])/2 - 6)
          }
        }
        // scale bar
        g.fillStyle = '#fff'; g.fillRect(20, size.h - 28, 5 * pxPerMeter, 4)
        g.font = '11px sans-serif'; g.fillText('5 m', 20, size.h - 36)
      }, [design, property, draftPoly, calibPts, size, tool, scale])

      function onCanvasClick(e) {
        const r = canvasRef.current.getBoundingClientRect()
        const pos = { x: e.clientX - r.left, y: e.clientY - r.top }
        const m = px2m(pos)
        if (tool === 'plant') {
          setDesign(d => [...d, { id: nid(), kind: 'plant', plantId: activePlant.id,
            x: m.x, y: m.y, radius: activePlant.radius, height: activePlant.height }])
        } else if (tool === 'hardscape' || tool === 'water' || tool === 'property') {
          setDraftPoly(p => [...p, pos.x, pos.y])
        } else if (tool === 'calibrate') {
          setCalibPts(p => p.length >= 4 ? [pos.x, pos.y] : [...p, pos.x, pos.y])
        }
      }

      function finishPolygon() {
        if (draftPoly.length < 6) return setDraftPoly([])
        const pts = []
        for (let i = 0; i < draftPoly.length; i += 2)
          pts.push(px2m({ x: draftPoly[i], y: draftPoly[i+1] }))
        if (tool === 'property') {
          setProperty(pts)
        } else if (tool === 'hardscape') {
          setDesign(d => [...d, { id: nid(), kind: 'hardscape', material: activeMaterial.id,
            color: activeMaterial.color, polygon: pts }])
        } else {
          setDesign(d => [...d, { id: nid(), kind: 'water', polygon: pts }])
        }
        setDraftPoly([])
      }

      function applyCalibration() {
        const real = parseFloat(calibInput)
        if (!real || calibPts.length < 4) return
        const px = Math.hypot(calibPts[2]-calibPts[0], calibPts[3]-calibPts[1])
        const target = px / real // desired pxPerMeter
        setScale(target / 25)
        setCalibPts([]); setCalibInput(''); setTool('plant')
      }

      const propertyArea = polyArea(property)
      const propertyPerim = polyPerim(property)

      return html`
        <div class="grid grid-cols-[260px_1fr_280px] h-full">
          <aside class="border-r border-slate-800 bg-slate-900/60 p-3 overflow-y-auto">
            <div class="grid grid-cols-3 gap-1 mb-3">
              ${[['select','Select'],['property','Lot'],['calibrate','Scale'],['plant','Plant'],['hardscape','Hard'],['water','Water']]
                .map(([id, label]) => html`
                  <button onClick=${() => setTool(id)}
                    class="px-2 py-1.5 rounded text-xs ${tool === id ? 'bg-green-700' : 'bg-slate-800 hover:bg-slate-700'}">
                    ${label}
                  </button>
                `)}
            </div>

            ${tool === 'property' && html`
              <div class="p-2 mb-3 rounded bg-slate-950/60 border border-slate-800">
                <p class="text-xs text-slate-400 mb-2">Click each corner of the property. Finish to commit a closed polygon.</p>
                ${property.length > 0 && html`<button onClick=${() => setProperty([])}
                  class="w-full text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded mb-1">Clear existing trace</button>`}
                ${draftPoly.length >= 6 && html`<button onClick=${finishPolygon}
                  class="w-full text-sm px-3 py-2 bg-green-700 hover:bg-green-600 rounded mt-1">
                  Finish property (${draftPoly.length / 2} vertices)</button>`}
                ${draftPoly.length > 0 && html`<button onClick=${() => setDraftPoly([])}
                  class="w-full text-xs text-slate-400 hover:text-slate-100 mt-1">Cancel</button>`}
              </div>
            `}

            ${tool === 'calibrate' && html`
              <div class="p-2 mb-3 rounded bg-slate-950/60 border border-slate-800">
                <p class="text-xs text-slate-400 mb-2">Click two ends of something with a known length, then enter its real-world meters.</p>
                <div class="text-xs text-slate-500 mb-2">Current scale: 1 m = ${pxPerMeter.toFixed(1)} px${scale !== 1 ? html` <span class="text-amber-400">(×${scale.toFixed(3)})</span>` : ''}</div>
                ${calibPts.length >= 4 && html`
                  <label class="text-xs text-slate-400">Actual length (m):</label>
                  <input type="number" step="0.01" min="0.01" autofocus
                    value=${calibInput} onInput=${(e) => setCalibInput(e.target.value)}
                    onKeyDown=${(e) => { if (e.key === 'Enter') applyCalibration() }}
                    class="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm mt-1" />
                  <button onClick=${applyCalibration} disabled=${!calibInput}
                    class="w-full mt-2 px-3 py-1.5 bg-green-700 hover:bg-green-600 disabled:bg-slate-800 disabled:text-slate-500 rounded text-sm">
                    Apply calibration</button>
                `}
                ${scale !== 1 && html`<button onClick=${() => setScale(1)}
                  class="w-full mt-2 px-3 py-1 text-xs text-slate-400 hover:text-slate-100">Reset scale</button>`}
              </div>
            `}

            ${tool === 'plant' && html`
              <h3 class="text-xs uppercase tracking-wider text-slate-500 mb-2">Plants</h3>
              <div class="space-y-1">
                ${PLANTS.map(p => html`
                  <button onClick=${() => setActivePlant(p)}
                    class="w-full text-left text-sm px-2 py-1.5 rounded flex items-center gap-2 ${activePlant.id === p.id ? 'bg-green-700' : 'bg-slate-800 hover:bg-slate-700'}">
                    <span class="w-3 h-3 rounded-full" style="background: ${p.color}"></span>
                    <span class="flex-1 truncate">${p.name}</span>
                    <span class="text-xs text-slate-400">${p.radius}m</span>
                  </button>
                `)}
              </div>
            `}

            ${tool === 'hardscape' && html`
              <h3 class="text-xs uppercase tracking-wider text-slate-500 mb-2">Materials</h3>
              <div class="space-y-1">
                ${MATERIALS.map(m => html`
                  <button onClick=${() => setActiveMaterial(m)}
                    class="w-full text-left text-sm px-2 py-1.5 rounded flex items-center gap-2 ${activeMaterial.id === m.id ? 'bg-green-700' : 'bg-slate-800 hover:bg-slate-700'}">
                    <span class="w-3 h-3 rounded" style="background: ${m.color}"></span>
                    ${m.name}
                  </button>
                `)}
              </div>
              <p class="text-xs text-slate-400 mt-3">Click on the canvas to add vertices, then Finish.</p>
            `}

            ${(tool === 'hardscape' || tool === 'water') && draftPoly.length >= 6 && html`
              <button onClick=${finishPolygon} class="w-full mt-3 px-3 py-2 bg-green-700 hover:bg-green-600 rounded text-sm">
                Finish polygon (${draftPoly.length / 2} vertices)
              </button>
            `}
            ${(tool === 'hardscape' || tool === 'water') && draftPoly.length > 0 && html`
              <button onClick=${() => setDraftPoly([])} class="w-full mt-1 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-100">Cancel</button>
            `}
          </aside>

          <div ref=${wrapRef} class="bg-slate-950 relative">
            <canvas ref=${canvasRef} onClick=${onCanvasClick} class="cursor-crosshair" />
          </div>

          <aside class="border-l border-slate-800 bg-slate-900/60 p-3 overflow-y-auto">
            <h3 class="text-xs uppercase tracking-wider text-slate-500 mb-2">Property</h3>
            ${property.length >= 3 ? html`
              <div class="text-sm space-y-1 mb-4">
                <div class="flex justify-between"><span class="text-slate-400">Area</span>
                  <span class="font-mono">${propertyArea.toFixed(0)} m² (${(propertyArea*10.764).toFixed(0)} ft²)</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Perimeter</span>
                  <span class="font-mono">${propertyPerim.toFixed(1)} m</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Vertices</span>
                  <span class="font-mono">${property.length}</span></div>
              </div>
            ` : html`<p class="text-xs text-slate-500 mb-4">Use the <span class="text-yellow-400">Lot</span> tool to trace the property line.</p>`}

            <h3 class="text-xs uppercase tracking-wider text-slate-500 mb-2">Plant schedule</h3>
            <${PlantSchedule} design=${design} />

            ${design.length > 0 && html`
              <button onClick=${() => { if (confirm('Clear the design?')) setDesign([]) }}
                class="w-full mt-6 px-3 py-1.5 text-sm bg-slate-800 hover:bg-red-900/60 rounded">
                Clear design
              </button>
            `}
          </aside>
        </div>
      `
    }

    function PlantSchedule({ design }) {
      const counts = new Map()
      for (const o of design) if (o.kind === 'plant') counts.set(o.plantId, (counts.get(o.plantId)||0) + 1)
      if (counts.size === 0) return html`<p class="text-xs text-slate-500">No plants placed yet.</p>`
      return html`<ul class="text-sm space-y-1">
        ${[...counts.entries()].map(([id, n]) => {
          const p = plantById(id)
          return html`<li class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full" style="background: ${p?.color}"></span>
            <span class="flex-1 truncate">${p?.name}</span>
            <span class="text-slate-400 text-xs">×${n}</span>
          </li>`
        })}
      </ul>`
    }

    /* =========================================================================
       3D SCENE
       ========================================================================= */
    function SceneView({ design, property }) {
      const wrapRef = useRef(null)
      const stateRef = useRef(null) // { scene, camera, renderer, controls, objectsRoot, sunLight }
      const [time, setTime] = useState(13)
      const [azimuth, setAzimuth] = useState(160)

      // init three.js once
      useEffect(() => {
        const wrap = wrapRef.current
        if (!wrap) return
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        renderer.setSize(wrap.clientWidth, wrap.clientHeight)
        wrap.appendChild(renderer.domElement)

        const scene = new THREE.Scene()
        scene.background = new THREE.Color('#9ec5e8')
        scene.fog = new THREE.Fog('#9ec5e8', 60, 180)

        const camera = new THREE.PerspectiveCamera(50, wrap.clientWidth / wrap.clientHeight, 0.1, 500)
        camera.position.set(25, 18, 25)

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.target.set(0, 1, 0)
        controls.maxPolarAngle = Math.PI / 2.1

        scene.add(new THREE.AmbientLight(0xffffff, 0.4))
        const sun = new THREE.DirectionalLight(0xffffff, 1.1)
        sun.castShadow = true
        sun.shadow.mapSize.set(2048, 2048)
        sun.shadow.camera.left = -50; sun.shadow.camera.right = 50
        sun.shadow.camera.top  =  50; sun.shadow.camera.bottom = -50
        scene.add(sun)
        scene.add(sun.target)

        const ground = new THREE.Mesh(
          new THREE.PlaneGeometry(200, 200),
          new THREE.MeshStandardMaterial({ color: '#3e5a32', roughness: 0.95 })
        )
        ground.rotation.x = -Math.PI / 2
        ground.receiveShadow = true
        scene.add(ground)

        // subtle grid
        const grid = new THREE.GridHelper(80, 80, '#3a5a3a', '#2a3a2a')
        grid.position.y = 0.01
        scene.add(grid)

        const objectsRoot = new THREE.Group()
        scene.add(objectsRoot)

        const propertyRoot = new THREE.Group()
        scene.add(propertyRoot)

        let raf
        function loop() {
          controls.update()
          renderer.render(scene, camera)
          raf = requestAnimationFrame(loop)
        }
        loop()

        function onResize() {
          if (!wrap) return
          renderer.setSize(wrap.clientWidth, wrap.clientHeight)
          camera.aspect = wrap.clientWidth / wrap.clientHeight
          camera.updateProjectionMatrix()
        }
        const ro = new ResizeObserver(onResize); ro.observe(wrap)

        stateRef.current = { scene, camera, renderer, controls, objectsRoot, propertyRoot, sun }

        return () => {
          cancelAnimationFrame(raf)
          ro.disconnect()
          renderer.dispose()
          wrap.removeChild(renderer.domElement)
        }
      }, [])

      // sun position
      useEffect(() => {
        const s = stateRef.current
        if (!s) return
        const t = (time - 6) / 12
        const elev = Math.sin(t * Math.PI)
        const az = (azimuth * Math.PI) / 180
        const dist = 80
        const y = Math.max(2, elev * 70)
        s.sun.position.set(Math.sin(az) * dist, y, Math.cos(az) * dist)
        const sky = elev > 0.3 ? '#9ec5e8' : elev > 0 ? '#dba879' : '#1a2840'
        s.scene.background = new THREE.Color(sky)
        s.scene.fog.color = new THREE.Color(sky)
      }, [time, azimuth])

      // rebuild design objects when design changes
      useEffect(() => {
        const s = stateRef.current
        if (!s) return
        // clear
        while (s.objectsRoot.children.length) s.objectsRoot.remove(s.objectsRoot.children[0])
        for (const o of design) {
          if (o.kind === 'plant') s.objectsRoot.add(buildPlantMesh(o))
          else if (o.kind === 'hardscape' || o.kind === 'water') s.objectsRoot.add(buildPadMesh(o))
        }
      }, [design])

      // property outline in 3D
      useEffect(() => {
        const s = stateRef.current
        if (!s) return
        while (s.propertyRoot.children.length) s.propertyRoot.remove(s.propertyRoot.children[0])
        if (property.length >= 3) {
          const pts = property.map(p => new THREE.Vector3(p.x, 0.04, p.y))
          pts.push(pts[0].clone())
          const geo = new THREE.BufferGeometry().setFromPoints(pts)
          const mat = new THREE.LineBasicMaterial({ color: 0xfacc15 })
          s.propertyRoot.add(new THREE.Line(geo, mat))
        }
      }, [property])

      function recenter() {
        const s = stateRef.current
        if (!s) return
        if (property.length >= 3) {
          let sx = 0, sy = 0
          for (const p of property) { sx += p.x; sy += p.y }
          s.controls.target.set(sx / property.length, 1, sy / property.length)
        } else {
          s.controls.target.set(0, 1, 0)
        }
      }

      return html`
        <div class="grid grid-cols-[1fr_260px] h-full">
          <div ref=${wrapRef} class="relative bg-slate-950">
            ${design.length === 0 && html`
              <div class="absolute inset-0 flex items-center justify-center text-slate-500 text-sm pointer-events-none">
                Drop objects on the 2D plan to see them here.
              </div>`}
          </div>
          <aside class="border-l border-slate-800 bg-slate-900/60 p-3 overflow-y-auto">
            <h3 class="text-xs uppercase tracking-wider text-slate-500 mb-2">Sun</h3>
            <label class="text-xs text-slate-400">Time of day: ${time}:00</label>
            <input type="range" min="6" max="20" value=${time} onInput=${(e) => setTime(+e.target.value)} class="w-full mb-3" />
            <label class="text-xs text-slate-400">Azimuth: ${azimuth}°</label>
            <input type="range" min="0" max="360" value=${azimuth} onInput=${(e) => setAzimuth(+e.target.value)} class="w-full mb-4" />

            <h3 class="text-xs uppercase tracking-wider text-slate-500 mb-2">Camera</h3>
            <button onClick=${recenter} class="w-full text-sm px-3 py-1.5 mb-2 bg-slate-800 hover:bg-slate-700 rounded">
              Recenter on property
            </button>
            <p class="text-xs text-slate-500">Drag = orbit · Scroll = zoom · Right-drag = pan</p>

            <h3 class="text-xs uppercase tracking-wider text-slate-500 mt-6 mb-2">Status</h3>
            <ul class="text-xs text-slate-400 space-y-0.5">
              <li>${design.filter(o => o.kind === 'plant').length} plants</li>
              <li>${design.filter(o => o.kind === 'hardscape').length} hardscape areas</li>
              <li>${design.filter(o => o.kind === 'water').length} water features</li>
              <li>${property.length >= 3 ? 'Property line set' : 'No property line'}</li>
            </ul>
          </aside>
        </div>
      `
    }

    function buildPlantMesh(plant) {
      const spec = plantById(plant.plantId)
      const cat = spec?.category ?? 'shrub'
      const color = spec?.color ?? '#5a8a4a'
      const g = new THREE.Group()
      g.position.set(plant.x, 0, plant.y)

      if (cat === 'tree') {
        const trunkH = plant.height * 0.45
        const trunk = new THREE.Mesh(
          new THREE.CylinderGeometry(plant.radius * 0.08, plant.radius * 0.1, trunkH, 10),
          new THREE.MeshStandardMaterial({ color: '#5a3e22', roughness: 0.95 })
        )
        trunk.position.y = trunkH / 2; trunk.castShadow = true
        g.add(trunk)
        const canopyY = trunkH + plant.radius * 0.8
        const positions = [
          [0, canopyY, 0, 1.0],
          [plant.radius * 0.35, canopyY + plant.radius * 0.2, plant.radius * 0.1, 0.72],
          [-plant.radius * 0.4, canopyY,                       plant.radius * 0.25, 0.65],
          [plant.radius * 0.1,  canopyY - plant.radius * 0.2, -plant.radius * 0.35, 0.55],
        ]
        for (const [x, y, z, s] of positions) {
          const m = new THREE.Mesh(
            new THREE.SphereGeometry(plant.radius * s, 14, 10),
            new THREE.MeshStandardMaterial({ color, roughness: 0.9 })
          )
          m.position.set(x, y, z); m.castShadow = true
          g.add(m)
        }
      } else if (cat === 'shrub') {
        const positions = [
          [0, plant.radius * 0.6, 0, 1.0],
          [plant.radius*0.5,  plant.radius*0.5, plant.radius*0.1,  0.75],
          [-plant.radius*0.45,plant.radius*0.45,plant.radius*0.2,  0.7],
          [plant.radius*0.1,  plant.radius*0.4,-plant.radius*0.5,  0.65],
        ]
        for (const [x, y, z, s] of positions) {
          const m = new THREE.Mesh(
            new THREE.SphereGeometry(plant.radius * s, 12, 10),
            new THREE.MeshStandardMaterial({ color, roughness: 0.95 })
          )
          m.position.set(x, y, z); m.castShadow = true
          g.add(m)
        }
      } else if (cat === 'grass') {
        for (let i = 0; i < 10; i++) {
          const a = (i / 10) * Math.PI * 2
          const dr = plant.radius * (0.2 + Math.random() * 0.6)
          const blade = new THREE.Mesh(
            new THREE.ConeGeometry(plant.radius * 0.07, plant.height, 5),
            new THREE.MeshStandardMaterial({ color, roughness: 0.9 })
          )
          blade.position.set(Math.cos(a) * dr, plant.height / 2, Math.sin(a) * dr)
          blade.rotation.z = (Math.random() - 0.5) * 0.4
          blade.castShadow = true
          g.add(blade)
        }
      } else if (cat === 'perennial') {
        const base = new THREE.Mesh(
          new THREE.SphereGeometry(plant.radius, 12, 10),
          new THREE.MeshStandardMaterial({ color, roughness: 0.95 })
        )
        base.position.y = plant.height * 0.4; base.castShadow = true; g.add(base)
        const flower = new THREE.Mesh(
          new THREE.SphereGeometry(plant.radius * 0.6, 10, 8),
          new THREE.MeshStandardMaterial({ color: tintColor(color, 0.3), roughness: 0.7 })
        )
        flower.position.y = plant.height * 0.9; flower.castShadow = true; g.add(flower)
      } else {
        const disk = new THREE.Mesh(
          new THREE.CircleGeometry(plant.radius, 20),
          new THREE.MeshStandardMaterial({ color, roughness: 0.95 })
        )
        disk.rotation.x = -Math.PI / 2; disk.position.y = 0.05; disk.receiveShadow = true
        g.add(disk)
      }
      return g
    }

    function buildPadMesh(o) {
      const [cx, cz] = centroid(o.polygon)
      const { w, d } = bbox(o.polygon)
      const isWater = o.kind === 'water'
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(Math.max(w, 0.5), isWater ? 0.08 : 0.04, Math.max(d, 0.5)),
        new THREE.MeshStandardMaterial({
          color: isWater ? '#3a7aa0' : (o.color ?? '#888'),
          roughness: isWater ? 0.15 : 0.9,
          metalness: isWater ? 0.2 : 0,
        })
      )
      m.position.set(cx, isWater ? 0.04 : 0.02, cz)
      m.receiveShadow = true
      return m
    }

    function tintColor(hex, amt) {
      const c = new THREE.Color(hex)
      c.r = Math.min(1, c.r + amt); c.g = Math.min(1, c.g + amt); c.b = Math.min(1, c.b + amt)
      return '#' + c.getHexString()
    }
    function centroid(poly) {
      let sx = 0, sy = 0; for (const p of poly) { sx += p.x; sy += p.y }
      return [sx / poly.length, sy / poly.length]
    }
    function bbox(poly) {
      let mnX = Infinity, mxX = -Infinity, mnY = Infinity, mxY = -Infinity
      for (const p of poly) { if (p.x<mnX)mnX=p.x;if(p.x>mxX)mxX=p.x;if(p.y<mnY)mnY=p.y;if(p.y>mxY)mxY=p.y }
      return { w: mxX-mnX, d: mxY-mnY }
    }
    function polyArea(poly) {
      if (poly.length < 3) return 0
      let a = 0
      for (let i = 0; i < poly.length; i++) {
        const j = (i+1) % poly.length
        a += poly[i].x * poly[j].y - poly[j].x * poly[i].y
      }
      return Math.abs(a / 2)
    }
    function polyPerim(poly) {
      if (poly.length < 2) return 0
      let p = 0
      for (let i = 0; i < poly.length; i++) {
        const a = poly[i], b = poly[(i+1) % poly.length]
        p += Math.hypot(b.x - a.x, b.y - a.y)
      }
      return p
    }

    /* =========================================================================
       AI PHOTO
       ========================================================================= */
    function PhotoView({ photoSource, setPhotoSource, photoSessions, setPhotoSessions }) {
      const [prompt, setPrompt] = useState(STYLE_PRESETS[0].prompt)
      const [filter, setFilter] = useState(STYLE_PRESETS[0].filter)
      const [busy, setBusy] = useState(false)
      const [compare, setCompare] = useState(null) // { sessionId, variantId }
      const fileRef = useRef(null)
      const imgRef = useRef(null)
      const maskRef = useRef(null)
      const drawing = useRef(false)
      const [tool, setTool] = useState('brush')
      const [brushSize, setBrushSize] = useState(40)

      function onUpload(e) {
        const f = e.target.files?.[0]
        if (!f) return
        const reader = new FileReader()
        reader.onload = () => setPhotoSource(reader.result)
        reader.readAsDataURL(f)
      }

      function syncCanvas() {
        const img = imgRef.current, c = maskRef.current
        if (!img || !c) return
        if (c.width !== img.clientWidth || c.height !== img.clientHeight) {
          c.width = img.clientWidth; c.height = img.clientHeight
        }
      }

      function paint(e) {
        const c = maskRef.current
        const r = c.getBoundingClientRect()
        const p = { x: e.clientX - r.left, y: e.clientY - r.top }
        const g = c.getContext('2d')
        g.globalCompositeOperation = tool === 'brush' ? 'source-over' : 'destination-out'
        g.fillStyle = 'rgba(90, 138, 74, 0.55)'
        g.beginPath(); g.arc(p.x, p.y, brushSize / 2, 0, Math.PI * 2); g.fill()
      }

      async function generate() {
        if (!photoSource) return
        setBusy(true)
        await new Promise(r => setTimeout(r, 900)) // fake latency
        // bake the selected filter + 3 small variations
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = photoSource
        await new Promise(r => { img.onload = r })
        const filters = [
          filter,
          filter + ' brightness(0.97)',
          filter + ' contrast(1.08)',
          filter + ' brightness(1.04) saturate(0.95)',
        ]
        const variants = filters.map((f, i) => ({
          id: nid(),
          url: applyFilterToImage(img, f),
          seed: i + 1,
          pinned: false,
        }))
        const session = { id: nid(), prompt, filter, variants, sourceUrl: photoSource }
        setPhotoSessions(s => [session, ...s])
        setBusy(false)
      }

      function togglePin(sessionId, variantId) {
        setPhotoSessions(sessions => sessions.map(s => s.id !== sessionId ? s : {
          ...s, variants: s.variants.map(v => v.id !== variantId ? v : { ...v, pinned: !v.pinned })
        }))
      }

      const session = compare ? photoSessions.find(s => s.id === compare.sessionId) : null
      const variant = session?.variants.find(v => v.id === compare.variantId)

      return html`
        <div class="grid grid-cols-[1fr_320px] h-full">
          <div class="bg-slate-900/30 relative overflow-auto p-6">
            ${!photoSource ? html`
              <button onClick=${() => fileRef.current.click()}
                class="w-full h-full min-h-[400px] rounded-lg border-2 border-dashed border-slate-700 hover:border-green-600 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-slate-200">
                <svg class="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
                <div>Click to upload a photo of the client's yard</div>
                <div class="text-xs">For the demo, any landscape photo works. Try a yard, a backyard, a building exterior.</div>
              </button>
            ` : html`
              <div class="space-y-6">
                <div class="relative inline-block max-w-full">
                  <img ref=${imgRef} src=${photoSource} onLoad=${syncCanvas}
                       class="max-w-full rounded-lg border border-slate-800" />
                  <canvas ref=${maskRef} class="absolute inset-0 cursor-crosshair rounded-lg"
                    onPointerDown=${e => { drawing.current = true; e.target.setPointerCapture(e.pointerId); paint(e) }}
                    onPointerMove=${e => { if (drawing.current) paint(e) }}
                    onPointerUp=${e => { drawing.current = false; e.target.releasePointerCapture(e.pointerId) }} />
                </div>
                ${photoSessions.map(s => html`
                  <div class="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                    <div class="text-xs text-slate-400 mb-2 truncate">${s.prompt}</div>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                      ${s.variants.map(v => html`
                        <div class="relative group">
                          <button onClick=${() => setCompare({ sessionId: s.id, variantId: v.id })}
                            class="block w-full text-left">
                            <img src=${v.url} class="w-full aspect-square object-cover rounded border border-slate-800 group-hover:border-green-500 transition" />
                            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded">
                              <span class="text-xs px-2 py-1 rounded bg-green-700 text-white">Compare</span>
                            </div>
                          </button>
                          <button onClick=${(e) => { e.stopPropagation(); togglePin(s.id, v.id) }}
                            class="absolute top-1 right-1 p-1 rounded text-xs ${v.pinned ? 'bg-green-700 text-white' : 'bg-black/60 text-slate-300 opacity-0 group-hover:opacity-100'}">
                            ${v.pinned ? '★' : '☆'}
                          </button>
                        </div>
                      `)}
                    </div>
                  </div>
                `)}
              </div>
            `}
            <input ref=${fileRef} type="file" accept="image/*" onChange=${onUpload} class="hidden" />
          </div>

          <aside class="border-l border-slate-800 bg-slate-900/60 p-4 overflow-y-auto">
            <h3 class="text-xs uppercase tracking-wider text-slate-500 mb-2">Source</h3>
            <button onClick=${() => fileRef.current.click()}
              class="w-full text-sm px-3 py-2 mb-4 bg-slate-800 hover:bg-slate-700 rounded">
              ${photoSource ? 'Replace photo' : 'Upload photo'}
            </button>

            ${photoSource && html`
              <h3 class="text-xs uppercase tracking-wider text-slate-500 mb-2">Mask</h3>
              <div class="flex gap-1 mb-2">
                <button onClick=${() => setTool('brush')}
                  class="flex-1 px-2 py-1.5 rounded text-sm ${tool === 'brush' ? 'bg-green-700' : 'bg-slate-800'}">Brush</button>
                <button onClick=${() => setTool('erase')}
                  class="flex-1 px-2 py-1.5 rounded text-sm ${tool === 'erase' ? 'bg-green-700' : 'bg-slate-800'}">Erase</button>
              </div>
              <label class="text-xs text-slate-400">Brush: ${brushSize}px</label>
              <input type="range" min="4" max="120" value=${brushSize} onInput=${e => setBrushSize(+e.target.value)} class="w-full mb-4" />
            `}

            <h3 class="text-xs uppercase tracking-wider text-slate-500 mb-2">Style presets</h3>
            <div class="grid grid-cols-2 gap-1 mb-3">
              ${STYLE_PRESETS.map(p => html`
                <button onClick=${() => { setPrompt(p.prompt); setFilter(p.filter) }}
                  class="text-xs px-2 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-left truncate">
                  ${p.label}
                </button>
              `)}
            </div>

            <h3 class="text-xs uppercase tracking-wider text-slate-500 mb-2">Prompt</h3>
            <textarea rows="4" value=${prompt} onInput=${e => setPrompt(e.target.value)}
              class="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm mb-3" />

            <button onClick=${generate} disabled=${!photoSource || busy}
              class="w-full px-3 py-2 bg-green-700 hover:bg-green-600 disabled:bg-slate-800 disabled:text-slate-500 rounded text-sm font-medium">
              ${busy ? 'Generating…' : 'Generate 4 variants'}
            </button>
            <p class="text-xs text-amber-400 mt-3">
              Web demo: AI variants are simulated with image filters. The desktop app calls Replicate ControlNet for real photoreal redesigns.
            </p>
          </aside>

          ${session && variant && html`<${BeforeAfter}
            before=${session.sourceUrl} after=${variant.url} prompt=${session.prompt}
            pinned=${variant.pinned}
            onTogglePin=${() => togglePin(session.id, variant.id)}
            onClose=${() => setCompare(null)} />`}
        </div>
      `
    }

    function applyFilterToImage(img, filter) {
      const c = document.createElement('canvas')
      c.width = img.naturalWidth; c.height = img.naturalHeight
      const g = c.getContext('2d')
      g.filter = filter
      g.drawImage(img, 0, 0)
      return c.toDataURL('image/jpeg', 0.85)
    }

    function BeforeAfter({ before, after, prompt, pinned, onTogglePin, onClose }) {
      const [pos, setPos] = useState(50)
      const [swap, setSwap] = useState(false)
      const wrap = useRef(null)
      const dragging = useRef(false)
      useEffect(() => {
        function k(e) {
          if (e.key === 'Escape') onClose()
          if (e.key === 'ArrowLeft')  setPos(p => Math.max(0, p - 2))
          if (e.key === 'ArrowRight') setPos(p => Math.min(100, p + 2))
        }
        window.addEventListener('keydown', k)
        return () => window.removeEventListener('keydown', k)
      }, [onClose])
      function fromX(x) {
        const r = wrap.current.getBoundingClientRect()
        setPos(Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100)))
      }
      const left = swap ? after : before
      const right = swap ? before : after
      return html`
        <div class="fixed inset-0 z-50 bg-black/85 flex flex-col">
          <div class="flex items-center gap-3 px-4 h-12 border-b border-slate-800">
            <span class="text-sm font-medium">Before / after</span>
            <span class="text-xs text-slate-400 truncate flex-1">${prompt}</span>
            <button onClick=${() => setSwap(s => !s)} class="text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded">Swap sides</button>
            <button onClick=${onTogglePin} class="text-xs px-2 py-1 rounded ${pinned ? 'bg-green-700' : 'bg-slate-800 hover:bg-slate-700'}">${pinned ? '★ Pinned' : '☆ Pin favorite'}</button>
            <button onClick=${onClose} class="text-slate-400 hover:text-slate-100 text-xl leading-none">×</button>
          </div>
          <div class="flex-1 flex items-center justify-center p-6 overflow-hidden">
            <div ref=${wrap} class="relative max-w-full max-h-full select-none cursor-ew-resize"
              onPointerDown=${e => { dragging.current = true; e.target.setPointerCapture(e.pointerId); fromX(e.clientX) }}
              onPointerMove=${e => { if (dragging.current) fromX(e.clientX) }}
              onPointerUp=${e => { dragging.current = false; e.target.releasePointerCapture(e.pointerId) }}>
              <img src=${left} class="block max-w-[90vw] max-h-[80vh] pointer-events-none" />
              <img src=${right} class="absolute inset-0 w-full h-full pointer-events-none"
                style="clip-path: inset(0 ${100 - pos}% 0 0)" />
              <div class="absolute top-2 left-2 text-[10px] uppercase tracking-wider font-semibold bg-black/70 text-white px-2 py-0.5 rounded">${swap ? 'After' : 'Before'}</div>
              <div class="absolute top-2 right-2 text-[10px] uppercase tracking-wider font-semibold bg-green-700 text-white px-2 py-0.5 rounded">${swap ? 'Before' : 'After'}</div>
              <div class="absolute top-0 bottom-0 pointer-events-none" style="left: ${pos}%; transform: translateX(-50%)">
                <div class="w-0.5 h-full bg-white shadow-lg"></div>
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-900 font-bold">⇆</div>
              </div>
            </div>
          </div>
          <div class="px-6 pb-4 flex items-center gap-3 text-xs text-slate-400">
            <input type="range" min="0" max="100" value=${pos} onInput=${e => setPos(+e.target.value)} class="flex-1" />
            <span class="w-10 text-right font-mono">${Math.round(pos)}%</span>
          </div>
        </div>
      `
    }

    /* ---------- mount ---------- */
    render(html`<${App} />`, document.getElementById('app'))
  </script>
</body>
</html>
````

---

<a id="scripts-build-bundle-sh"></a>
## `scripts/build-bundle.sh`

````bash
#!/usr/bin/env bash
# Regenerates FULL_SOURCE.md by concatenating every source file in the repo
# into a single scrollable Markdown document. Invoked from the
# "Update FULL_SOURCE.md" GitHub Actions workflow and runnable locally.
set -euo pipefail

cd "$(dirname "$0")/.."

files=(
  README.md
  DESIGN.md
  WEB_APP_PLAN.md
  package.json
  next.config.mjs
  tsconfig.json
  tailwind.config.ts
  postcss.config.mjs
  .env.example
  .gitignore
  lib/types.ts
  lib/palette.ts
  lib/store.ts
  lib/apiClient.ts
  app/layout.tsx
  app/globals.css
  app/page.tsx
  app/project/[id]/page.tsx
  app/api/config/route.ts
  app/api/geocode/route.ts
  app/api/aerial/route.ts
  app/api/streetview/route.ts
  app/api/parcel/route.ts
  app/api/ai/route.ts
  components/Editor.tsx
  components/PlanCanvas.tsx
  components/AIPhotoStudio.tsx
  components/BeforeAfter.tsx
  components/SceneViewer.tsx
  components/PlantModel.tsx
  web-demo/index.html
  scripts/build-bundle.sh
  .github/workflows/pages.yml
  .github/workflows/bundle.yml
)

anchor() {
  echo "$1" | tr '/.' '--' | tr -d '_'
}

lang_for() {
  case "${1##*.}" in
    ts|tsx)   echo typescript ;;
    js|jsx)   echo javascript ;;
    json)     echo json ;;
    yml|yaml) echo yaml ;;
    html)     echo html ;;
    css)      echo css ;;
    md)       echo markdown ;;
    sh)       echo bash ;;
    *)        echo "" ;;
  esac
}

OUT=FULL_SOURCE.md

{
  echo "# Landscape Studio — Full source bundle"
  echo ""
  echo "Every source file in the repository concatenated into one place. Useful for code review or LLM ingestion. To actually **run** the app you still need the repository's directory structure — see the repo home page."
  echo ""
  echo "Regenerated automatically on every push to \`main\` by [\`scripts/build-bundle.sh\`](./scripts/build-bundle.sh)."
  echo ""
  echo "Generated from commit \`$(git rev-parse --short HEAD)\` on $(date -u +%Y-%m-%d)."
  echo ""
  echo "## Files included"
  echo ""

  for f in "${files[@]}"; do
    if [ -f "$f" ]; then
      lines=$(wc -l < "$f" | tr -d ' ')
      echo "- [\`$f\`](#$(anchor "$f")) — $lines lines"
    fi
  done

  echo ""

  for f in "${files[@]}"; do
    [ -f "$f" ] || continue
    echo ""
    echo "---"
    echo ""
    echo "<a id=\"$(anchor "$f")\"></a>"
    echo "## \`$f\`"
    echo ""
    echo '````'"$(lang_for "$f")"
    cat "$f"
    echo '````'
  done
} > "$OUT"

echo "Wrote $OUT ($(wc -l < "$OUT" | tr -d ' ') lines)"
````

---

<a id="-github-workflows-pages-yml"></a>
## `.github/workflows/pages.yml`

````yaml
name: Deploy web demo to Pages

on:
  push:
    branches: [main]
    paths: ['web-demo/**', '.github/workflows/pages.yml']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: web-demo
      - id: deployment
        uses: actions/deploy-pages@v4
````

---

<a id="-github-workflows-bundle-yml"></a>
## `.github/workflows/bundle.yml`

````yaml
name: Update FULL_SOURCE.md

on:
  push:
    branches: [main]
    # Skip when the workflow's own commit is what triggered the push, and
    # ignore docs that don't belong in the bundle.
    paths-ignore:
      - 'FULL_SOURCE.md'
  workflow_dispatch:

permissions:
  contents: write

concurrency:
  group: bundle
  cancel-in-progress: true

jobs:
  bundle:
    # Skip the workflow's own automated commits to avoid an infinite loop.
    if: github.actor != 'github-actions[bot]'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Regenerate bundle
        run: bash scripts/build-bundle.sh

      - name: Commit if changed
        run: |
          if [[ -n "$(git status --porcelain FULL_SOURCE.md)" ]]; then
            git config user.name  'github-actions[bot]'
            git config user.email '41898282+github-actions[bot]@users.noreply.github.com'
            git add FULL_SOURCE.md
            git commit -m "chore: regenerate FULL_SOURCE.md for ${GITHUB_SHA::7}"
            git push
          else
            echo "FULL_SOURCE.md already up to date."
          fi
````
