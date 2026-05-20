# Landscape Studio — Full source bundle

Every source file in the repository concatenated into one place. Useful for code review or LLM ingestion. To actually **run** the app you still need the repository's directory structure — see the repo home page.

Generated from commit `a23cd01` on 2026-05-20.

## Files included

- [`README.md`](#README-md) — 125 lines
- [`DESIGN.md`](#DESIGN-md) — 247 lines
- [`package.json`](#package-json) — 73 lines
- [`tsconfig.json`](#tsconfig-json) — 27 lines
- [`tsconfig.node.json`](#tsconfig-node-json) — 11 lines
- [`vite.config.ts`](#vite-config-ts) — 35 lines
- [`tailwind.config.js`](#tailwind-config-js) — 13 lines
- [`postcss.config.js`](#postcss-config-js) — 3 lines
- [`index.html`](#index-html) — 12 lines
- [`.gitignore`](#-gitignore) — 13 lines
- [`shared/types.ts`](#shared-types-ts) — 160 lines
- [`electron/main.ts`](#electron-main-ts) — 58 lines
- [`electron/preload.ts`](#electron-preload-ts) — 28 lines
- [`electron/store.ts`](#electron-store-ts) — 59 lines
- [`electron/ipc/config.ts`](#electron-ipc-config-ts) — 24 lines
- [`electron/ipc/projects.ts`](#electron-ipc-projects-ts) — 104 lines
- [`electron/ipc/ai.ts`](#electron-ipc-ai-ts) — 153 lines
- [`electron/ipc/satellite.ts`](#electron-ipc-satellite-ts) — 96 lines
- [`src/main.tsx`](#src-main-tsx) — 22 lines
- [`src/App.tsx`](#src-App-tsx) — 28 lines
- [`src/styles.css`](#src-styles-css) — 14 lines
- [`src/lib/api.ts`](#src-lib-api-ts) — 51 lines
- [`src/lib/store.ts`](#src-lib-store-ts) — 118 lines
- [`src/routes/ProjectList.tsx`](#src-routes-ProjectList-tsx) — 107 lines
- [`src/routes/Editor.tsx`](#src-routes-Editor-tsx) — 74 lines
- [`src/routes/Settings.tsx`](#src-routes-Settings-tsx) — 97 lines
- [`src/modules/ai-photo/AIPhotoStudio.tsx`](#src-modules-ai-photo-AIPhotoStudio-tsx) — 389 lines
- [`src/modules/ai-photo/BeforeAfter.tsx`](#src-modules-ai-photo-BeforeAfter-tsx) — 135 lines
- [`src/modules/plan-2d/PlanCanvas.tsx`](#src-modules-plan-2d-PlanCanvas-tsx) — 645 lines
- [`src/modules/plan-2d/palette.ts`](#src-modules-plan-2d-palette-ts) — 44 lines
- [`src/modules/scene-3d/SceneViewer.tsx`](#src-modules-scene-3d-SceneViewer-tsx) — 223 lines
- [`src/modules/scene-3d/PlantModel.tsx`](#src-modules-scene-3d-PlantModel-tsx) — 195 lines
- [`src/modules/scene-3d/models.ts`](#src-modules-scene-3d-models-ts) — 34 lines
- [`web-demo/index.html`](#web-demo-index-html) — 962 lines
- [`.github/workflows/build.yml`](#-github-workflows-build-yml) — 85 lines
- [`.github/workflows/pages.yml`](#-github-workflows-pages-yml) — 31 lines


---

<a id="README-md"></a>
## `README.md`

````markdown
# Landscape Studio

A desktop landscape design application — 2D site plan, 3D walk-through, and
AI photo redesign — in the spirit of DynaScape and Structure Studios. Built
for landscape designers to take a client from a satellite image of their
property to a presentation-ready render.

---

## Try it now

| | Link | What it is |
|---|---|---|
| 🌐 | **[Live web demo](https://porterjohn911.github.io/landscape/)** | Single-page preview. Open in any browser, no install. AI is simulated. |
| 💻 | **[Download the desktop app](https://github.com/porterjohn911/landscape/releases/tag/latest)** | Real installers for Mac / Windows / Linux. Rebuilt on every push. |
| 📄 | [Design doc](./DESIGN.md) | Architecture, data model, and roadmap. |

> First time on the desktop app? Builds are unsigned, so macOS users
> right-click → Open the first time, and Windows users click "More info" →
> "Run anyway" past SmartScreen.

---

## What's in the app today

Three integrated views of a single project:

- **AI Photo Studio** — upload a yard photo, paint a mask over what to
  change, pick a style preset, generate four ControlNet variants via
  Replicate. Pin favorites, compare any variant against the source with
  a draggable before/after slider.
- **2D Plan** — drop plants, hardscape, and water features onto a
  Mapbox satellite tile. Trace the property line with the **Lot** tool;
  calibrate the canvas scale by clicking two ends of a known-length
  feature with the **Scale** tool. Live area, perimeter, and plant
  schedule update as you work.
- **3D Scene** — the same design rendered in three.js with
  category-specific procedural plants (trees sway in the wind), the
  satellite tile painted onto the ground plane, the traced property
  line as a dashed yellow outline, sun position by time of day, and
  optional GLB model loading per species.

Settings panel stores Replicate and Mapbox tokens locally. Without
tokens, the app still runs — AI returns mock variants and satellite is
a placeholder green tile.

---

## Running locally (dev mode)

```bash
git clone https://github.com/porterjohn911/landscape.git
cd landscape
npm install
npm run dev          # vite + electron with hot reload
```

Or build installers yourself:

```bash
npm run dist         # builds for your current OS into release/
```

---

## Changelog

### `aeaa1c6` — Before / after slider in AI photo
- Click any AI variant to wipe between source and result with a
  draggable divider; swap sides; pin from inside the modal; arrow keys
  and a range input work too.
- Source image now persists alongside the session so comparisons
  survive a project reopen.

### `f47b612` — 3D scene upgrades
- Procedural plants branch by category (tree / shrub / grass /
  perennial / groundcover); trees have layered canopies and gentle
  wind sway driven by `useFrame`.
- Optional GLB model registry — drop in CC0 / licensed models per
  species and `useGLTF` takes over with a procedural Suspense fallback.
- Satellite tile painted onto the 3D ground plane sized to the Mapbox
  bbox in meters; falls back to plain green when no tile.
- Property polygon now renders in 3D as a dashed yellow outline; new
  "Recenter on property" button.

### `4010f6d` — Property polygon + scale calibration
- **Lot** tool: click corners, "Finish property" closes the polygon.
  Vertices become draggable handles. Renders as a dashed yellow outline
  with a soft fill, visible under the design.
- **Scale** tool: click two ends of a known-length feature, enter the
  real meters, the canvas pxPerMeter calibrates against the Mapbox
  tile. Stored as `Site.scaleCalibration`.
- Right inspector shows property area (m² + ft²), perimeter, and
  vertex count.

### `7629196` — Initial scaffold
- Electron + Vite + React + TypeScript shell.
- Typed IPC bridge with `projects`, `ai`, `satellite`, `config`
  namespaces; secrets stay in the main process.
- Project list + create-project flow with JSON persistence in
  `app.getPath('userData')`.
- Editor with three tabs (AI Photo / 2D Plan / 3D Scene) sharing one
  design tree via a Zustand store.
- Replicate client wired up with mock fallback when no token is set.
- Mapbox Static Images integration with on-disk tile caching.

### Tooling
- `9f62cb4` — Single-file web demo + GitHub Pages deploy workflow.
- `f2546e7` — GitHub Actions pipeline that builds unsigned installers
  for macOS / Windows / Linux on every push to `main` and publishes
  them to the rolling "Latest build" release.

---

## Roadmap (next up)

- **PDF & client share** — exportable plan PDF with title block,
  legend, and plant schedule. Read-only web bundle published to a
  shareable URL.
- **Irrigation layer** — drip / spray heads, lateral lines, GPM totals.
- **Lighting layer** — fixture placement with a night-view 3D render.
- **Plant model marketplace** — wire the GLB registry to a curated
  pack of CC0 species and let designers add their own.

See [DESIGN.md](./DESIGN.md) for the full phased plan and architecture.
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

<a id="package-json"></a>
## `package.json`

````json
{
  "name": "landscape-studio",
  "version": "0.1.0",
  "description": "Desktop landscape design app — 2D site plan, 3D scene, and AI photo redesign.",
  "private": true,
  "type": "module",
  "main": "dist-electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "dist": "vite build && electron-builder --publish=never",
    "dist:mac": "vite build && electron-builder --mac --publish=never",
    "dist:win": "vite build && electron-builder --win --publish=never",
    "dist:linux": "vite build && electron-builder --linux --publish=never",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "start": "electron ."
  },
  "dependencies": {
    "@react-three/drei": "^9.114.0",
    "@react-three/fiber": "^8.17.10",
    "konva": "^9.3.16",
    "lucide-react": "^0.460.0",
    "nanoid": "^5.0.7",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-konva": "^18.2.10",
    "react-router-dom": "^6.27.0",
    "replicate": "^1.0.1",
    "three": "^0.169.0",
    "zustand": "^5.0.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@types/three": "^0.169.0",
    "@vitejs/plugin-react": "^4.3.3",
    "autoprefixer": "^10.4.20",
    "electron": "^33.0.2",
    "electron-builder": "^25.1.8",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "typescript": "^5.6.3",
    "vite": "^5.4.10",
    "vite-plugin-electron": "^0.28.8",
    "vite-plugin-electron-renderer": "^0.14.6"
  },
  "build": {
    "appId": "com.landscapestudio.app",
    "productName": "Landscape Studio",
    "directories": { "output": "release" },
    "files": ["dist/**/*", "dist-electron/**/*", "package.json"],
    "mac": {
      "category": "public.app-category.graphics-design",
      "target": [{ "target": "dmg", "arch": ["x64", "arm64"] }],
      "identity": null,
      "hardenedRuntime": false,
      "gatekeeperAssess": false
    },
    "win": {
      "target": [{ "target": "nsis", "arch": ["x64"] }]
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "perMachine": false
    },
    "linux": {
      "target": [{ "target": "AppImage", "arch": ["x64"] }],
      "category": "Graphics"
    }
  }
}
````

---

<a id="tsconfig-json"></a>
## `tsconfig.json`

````json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "useDefineForClassFields": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@shared/*": ["shared/*"]
    }
  },
  "include": ["src", "shared", "electron"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
````

---

<a id="tsconfig-node-json"></a>
## `tsconfig.node.json`

````json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["vite.config.ts"]
}
````

---

<a id="vite-config-ts"></a>
## `vite.config.ts`

````typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@shared': path.resolve(__dirname, 'shared'),
    },
  },
  plugins: [
    react(),
    electron([
      {
        entry: 'electron/main.ts',
        vite: {
          build: {
            outDir: 'dist-electron',
            rollupOptions: { external: ['electron', 'replicate'] },
          },
        },
      },
      {
        entry: 'electron/preload.ts',
        onstart(args) { args.reload() },
        vite: { build: { outDir: 'dist-electron' } },
      },
    ]),
    renderer(),
  ],
  server: { port: 5173 },
})
````

---

<a id="tailwind-config-js"></a>
## `tailwind.config.js`

````javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        moss: { 500: '#5a8a4a', 600: '#467036', 700: '#365a28' },
        bark: { 500: '#6b5642', 700: '#3e3024' },
      },
    },
  },
  plugins: [],
}
````

---

<a id="postcss-config-js"></a>
## `postcss.config.js`

````javascript
export default {
  plugins: { tailwindcss: {}, autoprefixer: {} },
}
````

---

<a id="index-html"></a>
## `index.html`

````html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Landscape Studio</title>
  </head>
  <body class="bg-slate-950 text-slate-100">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
````

---

<a id="-gitignore"></a>
## `.gitignore`

````
node_modules/
dist/
dist-electron/
release/
.vite/
.DS_Store
*.log
.env
.env.local
.env.*.local
.idea/
.vscode/
*.tsbuildinfo
````

---

<a id="shared-types-ts"></a>
## `shared/types.ts`

````typescript
// Shared between Electron main and renderer. No runtime imports of node here.

export type LatLng = { lat: number; lng: number }
export type Point = { x: number; y: number } // meters, relative to site center

export type ControlNetKind = 'canny' | 'depth' | 'mlsd' | 'seg' | 'none'

export type Plant = {
  kind: 'plant'
  id: string
  species: string // common name
  x: number
  y: number
  radius: number // mature canopy radius, meters
  height: number // meters
}

export type Hardscape = {
  kind: 'hardscape'
  id: string
  material: 'flagstone' | 'concrete' | 'pavers' | 'gravel' | 'turf' | 'mulch' | 'deck'
  polygon: Point[]
}

export type Water = {
  kind: 'water'
  id: string
  shape: 'pool' | 'spa' | 'pond'
  polygon: Point[]
  depth: number // meters
}

export type Structure = {
  kind: 'structure'
  id: string
  type: 'pergola' | 'fence' | 'wall' | 'firepit' | 'shed'
  polygon: Point[]
  height: number
}

export type Light = {
  kind: 'light'
  id: string
  fixture: 'path' | 'spot' | 'wash' | 'string'
  x: number
  y: number
  lumens: number
}

export type DesignObject = Plant | Hardscape | Water | Structure | Light

export type Site = {
  address?: string
  center: LatLng
  zoom: number
  // Property line stored in meters relative to site.center, same frame as
  // every DesignObject. Empty until the designer traces it.
  propertyPolygon: Point[]
  northRotation: number
  // Multiplier applied to the satellite-derived pxPerMeter. Defaults to 1.0;
  // designers refine it with the calibrate tool (click two points, enter
  // their real-world length).
  scaleCalibration?: number
}

export type AIPhotoVariant = {
  id: string
  localPath: string // file path relative to project assets dir
  seed: number
  createdAt: string
  pinned?: boolean
}

export type AIPhotoSession = {
  id: string
  createdAt: string
  sourceImagePath: string
  maskImagePath?: string
  prompt: string
  negativePrompt?: string
  controlnet: ControlNetKind
  variants: AIPhotoVariant[]
}

export type Project = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  site: Site
  design: DesignObject[]
  photoSessions: AIPhotoSession[]
  thumbnail?: string
}

export type ProjectSummary = Pick<Project, 'id' | 'name' | 'updatedAt' | 'thumbnail'> & {
  address?: string
}

export type Result<T> = { ok: true; data: T } | { ok: false; error: string }

// IPC channel names — keep in sync with electron/ipc/* and src/lib/ipc.ts
export const IPC = {
  projects: {
    list: 'projects:list',
    get: 'projects:get',
    create: 'projects:create',
    save: 'projects:save',
    delete: 'projects:delete',
  },
  ai: {
    generate: 'ai:generate',
    listModels: 'ai:listModels',
    hasToken: 'ai:hasToken',
  },
  satellite: {
    fetch: 'satellite:fetch',
    geocode: 'satellite:geocode',
    hasToken: 'satellite:hasToken',
  },
  config: {
    get: 'config:get',
    set: 'config:set',
  },
} as const

export type GenerateRequest = {
  projectId: string
  sourceImageDataUrl: string
  maskImageDataUrl?: string
  prompt: string
  negativePrompt?: string
  controlnet: ControlNetKind
  variantCount?: number
  seed?: number
}

export type GenerateResponse = {
  sessionId: string
  sourceImagePath: string
  variants: AIPhotoVariant[]
}

export type SatelliteRequest = {
  center: LatLng
  zoom: number
  width: number
  height: number
}

export type SatelliteResponse = {
  localPath: string
  bboxMeters: { width: number; height: number }
}

export type AppConfig = {
  replicateToken?: string
  mapboxToken?: string
  defaultControlNet: ControlNetKind
}
````

---

<a id="electron-main-ts"></a>
## `electron/main.ts`

````typescript
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { registerProjectHandlers } from './ipc/projects.js'
import { registerAIHandlers } from './ipc/ai.js'
import { registerSatelliteHandlers } from './ipc/satellite.js'
import { registerConfigHandlers } from './ipc/config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isDev = !!process.env.VITE_DEV_SERVER_URL

let mainWindow: BrowserWindow | null = null

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1480,
    height: 920,
    minWidth: 1100,
    minHeight: 720,
    backgroundColor: '#0b1220',
    title: 'Landscape Studio',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    await mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(async () => {
  registerConfigHandlers(ipcMain)
  registerProjectHandlers(ipcMain)
  registerAIHandlers(ipcMain)
  registerSatelliteHandlers(ipcMain)
  await createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
````

---

<a id="electron-preload-ts"></a>
## `electron/preload.ts`

````typescript
import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from '../shared/types.js'

const invoke = (channel: string, ...args: unknown[]) => ipcRenderer.invoke(channel, ...args)

contextBridge.exposeInMainWorld('api', {
  projects: {
    list: () => invoke(IPC.projects.list),
    get: (id: string) => invoke(IPC.projects.get, id),
    create: (name: string, address?: string) => invoke(IPC.projects.create, { name, address }),
    save: (project: unknown) => invoke(IPC.projects.save, project),
    delete: (id: string) => invoke(IPC.projects.delete, id),
  },
  ai: {
    generate: (req: unknown) => invoke(IPC.ai.generate, req),
    listModels: () => invoke(IPC.ai.listModels),
    hasToken: () => invoke(IPC.ai.hasToken),
  },
  satellite: {
    fetch: (req: unknown) => invoke(IPC.satellite.fetch, req),
    geocode: (q: string) => invoke(IPC.satellite.geocode, q),
    hasToken: () => invoke(IPC.satellite.hasToken),
  },
  config: {
    get: () => invoke(IPC.config.get),
    set: (patch: unknown) => invoke(IPC.config.set, patch),
  },
})
````

---

<a id="electron-store-ts"></a>
## `electron/store.ts`

````typescript
import { app } from 'electron'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { AppConfig } from '../shared/types.js'

export function userDir() {
  return app.getPath('userData')
}

export function projectsDir() {
  return path.join(userDir(), 'projects')
}

export function assetsDir(projectId: string) {
  return path.join(userDir(), 'assets', projectId)
}

export function tilesDir() {
  return path.join(userDir(), 'tiles')
}

export function configPath() {
  return path.join(userDir(), 'config.json')
}

export async function ensureDirs() {
  await fs.mkdir(projectsDir(), { recursive: true })
  await fs.mkdir(tilesDir(), { recursive: true })
  await fs.mkdir(path.join(userDir(), 'assets'), { recursive: true })
}

const DEFAULT_CONFIG: AppConfig = {
  defaultControlNet: 'canny',
}

export async function readConfig(): Promise<AppConfig> {
  try {
    const raw = await fs.readFile(configPath(), 'utf8')
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_CONFIG }
  }
}

export async function writeConfig(patch: Partial<AppConfig>): Promise<AppConfig> {
  const current = await readConfig()
  const next = { ...current, ...patch }
  await ensureDirs()
  await fs.writeFile(configPath(), JSON.stringify(next, null, 2))
  return next
}

export function getReplicateToken(cfg: AppConfig): string | undefined {
  return cfg.replicateToken || process.env.REPLICATE_API_TOKEN
}

export function getMapboxToken(cfg: AppConfig): string | undefined {
  return cfg.mapboxToken || process.env.MAPBOX_TOKEN
}
````

---

<a id="electron-ipc-config-ts"></a>
## `electron/ipc/config.ts`

````typescript
import type { IpcMain } from 'electron'
import { IPC, type AppConfig } from '../../shared/types.js'
import { readConfig, writeConfig } from '../store.js'

export function registerConfigHandlers(ipc: IpcMain) {
  ipc.handle(IPC.config.get, async () => {
    const cfg = await readConfig()
    // Don't ship raw tokens to renderer; only signal presence.
    return {
      defaultControlNet: cfg.defaultControlNet,
      hasReplicateToken: !!(cfg.replicateToken || process.env.REPLICATE_API_TOKEN),
      hasMapboxToken: !!(cfg.mapboxToken || process.env.MAPBOX_TOKEN),
    }
  })

  ipc.handle(IPC.config.set, async (_e, patch: Partial<AppConfig>) => {
    const next = await writeConfig(patch)
    return {
      defaultControlNet: next.defaultControlNet,
      hasReplicateToken: !!(next.replicateToken || process.env.REPLICATE_API_TOKEN),
      hasMapboxToken: !!(next.mapboxToken || process.env.MAPBOX_TOKEN),
    }
  })
}
````

---

<a id="electron-ipc-projects-ts"></a>
## `electron/ipc/projects.ts`

````typescript
import type { IpcMain } from 'electron'
import fs from 'node:fs/promises'
import path from 'node:path'
import { IPC, type Project, type ProjectSummary, type Result } from '../../shared/types.js'
import { ensureDirs, projectsDir, assetsDir } from '../store.js'

function newId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

async function readProject(id: string): Promise<Project | null> {
  try {
    const raw = await fs.readFile(path.join(projectsDir(), `${id}.json`), 'utf8')
    return JSON.parse(raw) as Project
  } catch {
    return null
  }
}

async function writeProject(project: Project) {
  await ensureDirs()
  await fs.mkdir(assetsDir(project.id), { recursive: true })
  await fs.writeFile(
    path.join(projectsDir(), `${project.id}.json`),
    JSON.stringify(project, null, 2),
  )
}

export function registerProjectHandlers(ipc: IpcMain) {
  ipc.handle(IPC.projects.list, async (): Promise<Result<ProjectSummary[]>> => {
    try {
      await ensureDirs()
      const files = await fs.readdir(projectsDir())
      const summaries: ProjectSummary[] = []
      for (const f of files) {
        if (!f.endsWith('.json')) continue
        try {
          const raw = await fs.readFile(path.join(projectsDir(), f), 'utf8')
          const p = JSON.parse(raw) as Project
          summaries.push({
            id: p.id,
            name: p.name,
            updatedAt: p.updatedAt,
            thumbnail: p.thumbnail,
            address: p.site?.address,
          })
        } catch {
          /* skip corrupt */
        }
      }
      summaries.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      return { ok: true, data: summaries }
    } catch (err) {
      return { ok: false, error: (err as Error).message }
    }
  })

  ipc.handle(IPC.projects.get, async (_e, id: string): Promise<Result<Project>> => {
    const p = await readProject(id)
    if (!p) return { ok: false, error: 'Project not found' }
    return { ok: true, data: p }
  })

  ipc.handle(
    IPC.projects.create,
    async (_e, { name, address }: { name: string; address?: string }): Promise<Result<Project>> => {
      const now = new Date().toISOString()
      const project: Project = {
        id: newId(),
        name: name || 'Untitled project',
        createdAt: now,
        updatedAt: now,
        site: {
          address,
          center: { lat: 37.7749, lng: -122.4194 },
          zoom: 19,
          propertyPolygon: [],
          northRotation: 0,
        },
        design: [],
        photoSessions: [],
      }
      await writeProject(project)
      return { ok: true, data: project }
    },
  )

  ipc.handle(IPC.projects.save, async (_e, project: Project): Promise<Result<Project>> => {
    if (!project?.id) return { ok: false, error: 'Missing project id' }
    project.updatedAt = new Date().toISOString()
    await writeProject(project)
    return { ok: true, data: project }
  })

  ipc.handle(IPC.projects.delete, async (_e, id: string): Promise<Result<true>> => {
    try {
      await fs.unlink(path.join(projectsDir(), `${id}.json`))
      await fs.rm(assetsDir(id), { recursive: true, force: true })
      return { ok: true, data: true }
    } catch (err) {
      return { ok: false, error: (err as Error).message }
    }
  })
}
````

---

<a id="electron-ipc-ai-ts"></a>
## `electron/ipc/ai.ts`

````typescript
import type { IpcMain } from 'electron'
import fs from 'node:fs/promises'
import path from 'node:path'
import {
  IPC,
  type GenerateRequest,
  type GenerateResponse,
  type Result,
  type AIPhotoVariant,
} from '../../shared/types.js'
import { assetsDir, getReplicateToken, readConfig } from '../store.js'

// Replicate ControlNet model versions. These are stable, public model
// versions; update as needed. We deliberately pin versions so renders are
// reproducible across users.
const MODEL_VERSIONS: Record<string, string> = {
  canny: 'jagilley/controlnet-canny:aff48af9c68d162388d230a2ab003f68d2638d88307bdaf1c2f1ac95079c9613',
  depth: 'jagilley/controlnet-depth2img:922c7f7b1d72f02cc99ce9aabe687e3f86e890ed27d75c2d49b1de2eb84e7b8a',
  mlsd: 'jagilley/controlnet-hough:854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b',
  seg: 'jagilley/controlnet-seg:f967b165f4cd2e151d11e7450a8214e5d22ad2007f042f2f891ca3981dbfba0d',
  none: 'stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc',
}

function dataUrlToBuffer(dataUrl: string): { buffer: Buffer; mime: string } {
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl)
  if (!match) throw new Error('Invalid data URL')
  return { mime: match[1], buffer: Buffer.from(match[2], 'base64') }
}

async function downloadToFile(url: string, outPath: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download failed: ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await fs.writeFile(outPath, buf)
}

async function saveSource(
  projectId: string,
  sessionId: string,
  dataUrl: string,
): Promise<string> {
  const dir = assetsDir(projectId)
  await fs.mkdir(dir, { recursive: true })
  const { buffer } = dataUrlToBuffer(dataUrl)
  const localPath = path.join(dir, `${sessionId}_source.png`)
  await fs.writeFile(localPath, buffer)
  return localPath
}

async function mockGenerate(req: GenerateRequest): Promise<GenerateResponse> {
  const dir = assetsDir(req.projectId)
  await fs.mkdir(dir, { recursive: true })
  const sessionId = 's_' + Date.now().toString(36)
  const sourceImagePath = await saveSource(req.projectId, sessionId, req.sourceImageDataUrl)
  const { buffer } = dataUrlToBuffer(req.sourceImageDataUrl)
  const variants: AIPhotoVariant[] = []
  const count = req.variantCount ?? 4
  for (let i = 0; i < count; i++) {
    const fname = `${sessionId}_${i}.png`
    await fs.writeFile(path.join(dir, fname), buffer)
    variants.push({
      id: `${sessionId}_${i}`,
      localPath: path.join(dir, fname),
      seed: (req.seed ?? 1) + i,
      createdAt: new Date().toISOString(),
    })
  }
  return { sessionId, sourceImagePath, variants }
}

async function realGenerate(token: string, req: GenerateRequest): Promise<GenerateResponse> {
  const { default: Replicate } = await import('replicate')
  const replicate = new Replicate({ auth: token })
  const versionSpec = MODEL_VERSIONS[req.controlnet] ?? MODEL_VERSIONS.canny

  const { buffer: srcBuf, mime: srcMime } = dataUrlToBuffer(req.sourceImageDataUrl)
  const srcBlob = new Blob([srcBuf], { type: srcMime })
  const input: Record<string, unknown> = {
    image: srcBlob,
    prompt: req.prompt,
    num_outputs: req.variantCount ?? 4,
    num_inference_steps: 30,
  }
  if (req.negativePrompt) input.negative_prompt = req.negativePrompt
  if (req.seed != null) input.seed = req.seed
  if (req.maskImageDataUrl) {
    const { buffer: mBuf, mime: mMime } = dataUrlToBuffer(req.maskImageDataUrl)
    input.mask = new Blob([mBuf], { type: mMime })
  }

  const output = (await replicate.run(versionSpec as `${string}/${string}:${string}`, {
    input,
  })) as unknown

  const urls: string[] = Array.isArray(output)
    ? (output as string[])
    : typeof output === 'string'
      ? [output as string]
      : []

  const dir = assetsDir(req.projectId)
  await fs.mkdir(dir, { recursive: true })
  const sessionId = 's_' + Date.now().toString(36)
  const sourceImagePath = await saveSource(req.projectId, sessionId, req.sourceImageDataUrl)
  const variants: AIPhotoVariant[] = []
  for (let i = 0; i < urls.length; i++) {
    const local = path.join(dir, `${sessionId}_${i}.png`)
    await downloadToFile(urls[i], local)
    variants.push({
      id: `${sessionId}_${i}`,
      localPath: local,
      seed: (req.seed ?? 0) + i,
      createdAt: new Date().toISOString(),
    })
  }
  return { sessionId, sourceImagePath, variants }
}

export function registerAIHandlers(ipc: IpcMain) {
  ipc.handle(IPC.ai.hasToken, async () => {
    const cfg = await readConfig()
    return { hasToken: !!getReplicateToken(cfg) }
  })

  ipc.handle(IPC.ai.listModels, async () => {
    return {
      models: Object.keys(MODEL_VERSIONS).map((k) => ({
        id: k,
        label:
          k === 'canny'
            ? 'ControlNet — Canny (preserve edges, restyle materials)'
            : k === 'depth'
              ? 'ControlNet — Depth (replace objects, keep perspective)'
              : k === 'mlsd'
                ? 'ControlNet — MLSD (preserve straight lines / structures)'
                : k === 'seg'
                  ? 'ControlNet — Seg (swap by category, e.g. lawn → patio)'
                  : 'SDXL (concept board, no input photo control)',
      })),
    }
  })

  ipc.handle(IPC.ai.generate, async (_e, req: GenerateRequest): Promise<Result<GenerateResponse>> => {
    try {
      const cfg = await readConfig()
      const token = getReplicateToken(cfg)
      const data = token ? await realGenerate(token, req) : await mockGenerate(req)
      return { ok: true, data }
    } catch (err) {
      return { ok: false, error: (err as Error).message }
    }
  })
}
````

---

<a id="electron-ipc-satellite-ts"></a>
## `electron/ipc/satellite.ts`

````typescript
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
````

---

<a id="src-main-tsx"></a>
## `src/main.tsx`

````typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import ProjectList from './routes/ProjectList'
import Editor from './routes/Editor'
import Settings from './routes/Settings'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<ProjectList />} />
          <Route path="project/:id" element={<Editor />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>,
)
````

---

<a id="src-App-tsx"></a>
## `src/App.tsx`

````typescript
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Trees, Settings as SettingsIcon } from 'lucide-react'

export default function App() {
  const loc = useLocation()
  const inEditor = loc.pathname.startsWith('/project/')

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100">
      <header className="flex items-center justify-between px-4 h-11 border-b border-slate-800 bg-slate-900/60 select-none">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Trees className="w-5 h-5 text-moss-500" />
          Landscape Studio
        </Link>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          {!inEditor && (
            <Link to="/settings" className="hover:text-slate-100 flex items-center gap-1">
              <SettingsIcon className="w-4 h-4" /> Settings
            </Link>
          )}
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
````

---

<a id="src-styles-css"></a>
## `src/styles.css`

````css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root { height: 100%; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Subtle scrollbars */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 4px; }
::-webkit-scrollbar-track { background: transparent; }
````

---

<a id="src-lib-api-ts"></a>
## `src/lib/api.ts`

````typescript
import type {
  Project,
  ProjectSummary,
  Result,
  GenerateRequest,
  GenerateResponse,
  SatelliteRequest,
  SatelliteResponse,
  LatLng,
} from '@shared/types'

type ConfigStatus = {
  defaultControlNet: string
  hasReplicateToken: boolean
  hasMapboxToken: boolean
}

declare global {
  interface Window {
    api: {
      projects: {
        list: () => Promise<Result<ProjectSummary[]>>
        get: (id: string) => Promise<Result<Project>>
        create: (name: string, address?: string) => Promise<Result<Project>>
        save: (project: Project) => Promise<Result<Project>>
        delete: (id: string) => Promise<Result<true>>
      }
      ai: {
        generate: (req: GenerateRequest) => Promise<Result<GenerateResponse>>
        listModels: () => Promise<{ models: Array<{ id: string; label: string }> }>
        hasToken: () => Promise<{ hasToken: boolean }>
      }
      satellite: {
        fetch: (req: SatelliteRequest) => Promise<Result<SatelliteResponse>>
        geocode: (q: string) => Promise<Result<LatLng & { label: string }>>
        hasToken: () => Promise<{ hasToken: boolean }>
      }
      config: {
        get: () => Promise<ConfigStatus>
        set: (patch: Partial<{ replicateToken: string; mapboxToken: string; defaultControlNet: string }>) => Promise<ConfigStatus>
      }
    }
  }
}

export const api = (typeof window !== 'undefined' ? window.api : undefined) as Window['api']

export function unwrap<T>(r: Result<T>): T {
  if (!r.ok) throw new Error(r.error)
  return r.data
}
````

---

<a id="src-lib-store-ts"></a>
## `src/lib/store.ts`

````typescript
import { create } from 'zustand'
import type { Project, DesignObject, AIPhotoSession } from '@shared/types'
import { api, unwrap } from './api'

type EditorTab = 'photo' | 'plan' | 'scene'

type State = {
  project: Project | null
  tab: EditorTab
  selectedId: string | null
  dirty: boolean
}

type Actions = {
  load: (id: string) => Promise<void>
  setTab: (t: EditorTab) => void
  select: (id: string | null) => void
  upsertObject: (obj: DesignObject) => void
  removeObject: (id: string) => void
  addPhotoSession: (s: AIPhotoSession) => void
  updatePhotoSession: (id: string, patch: Partial<AIPhotoSession>) => void
  rename: (name: string) => void
  setSite: (patch: Partial<Project['site']>) => void
  save: () => Promise<void>
}

export const useProject = create<State & Actions>((set, get) => {
  let saveTimer: ReturnType<typeof setTimeout> | null = null

  const scheduleSave = () => {
    set({ dirty: true })
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      void get().save()
    }, 800)
  }

  return {
    project: null,
    tab: 'plan',
    selectedId: null,
    dirty: false,

    async load(id) {
      const p = unwrap(await api.projects.get(id))
      set({ project: p, dirty: false, selectedId: null })
    },

    setTab(tab) {
      set({ tab })
    },

    select(id) {
      set({ selectedId: id })
    },

    upsertObject(obj) {
      const p = get().project
      if (!p) return
      const idx = p.design.findIndex((o) => o.id === obj.id)
      const design = idx >= 0
        ? p.design.map((o, i) => (i === idx ? obj : o))
        : [...p.design, obj]
      set({ project: { ...p, design } })
      scheduleSave()
    },

    removeObject(id) {
      const p = get().project
      if (!p) return
      set({
        project: { ...p, design: p.design.filter((o) => o.id !== id) },
        selectedId: get().selectedId === id ? null : get().selectedId,
      })
      scheduleSave()
    },

    addPhotoSession(s) {
      const p = get().project
      if (!p) return
      set({ project: { ...p, photoSessions: [s, ...p.photoSessions] } })
      scheduleSave()
    },

    updatePhotoSession(id, patch) {
      const p = get().project
      if (!p) return
      set({
        project: {
          ...p,
          photoSessions: p.photoSessions.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        },
      })
      scheduleSave()
    },

    rename(name) {
      const p = get().project
      if (!p) return
      set({ project: { ...p, name } })
      scheduleSave()
    },

    setSite(patch) {
      const p = get().project
      if (!p) return
      set({ project: { ...p, site: { ...p.site, ...patch } } })
      scheduleSave()
    },

    async save() {
      const p = get().project
      if (!p) return
      await api.projects.save(p)
      set({ dirty: false })
    },
  }
})
````

---

<a id="src-routes-ProjectList-tsx"></a>
## `src/routes/ProjectList.tsx`

````typescript
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, MapPin, Trash2 } from 'lucide-react'
import { api, unwrap } from '../lib/api'
import type { ProjectSummary } from '@shared/types'

export default function ProjectList() {
  const [items, setItems] = useState<ProjectSummary[]>([])
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const nav = useNavigate()

  async function refresh() {
    const list = unwrap(await api.projects.list())
    setItems(list)
  }
  useEffect(() => {
    void refresh()
  }, [])

  async function create() {
    const p = unwrap(await api.projects.create(name || 'Untitled project', address || undefined))
    setCreating(false); setName(''); setAddress('')
    nav(`/project/${p.id}`)
  }

  async function remove(id: string) {
    if (!confirm('Delete this project? This cannot be undone.')) return
    await api.projects.delete(id)
    void refresh()
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Your projects</h1>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-moss-600 hover:bg-moss-500 rounded-md text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> New project
        </button>
      </div>

      {creating && (
        <div className="mb-6 p-4 rounded-lg border border-slate-800 bg-slate-900/40 space-y-3">
          <input
            autoFocus
            placeholder="Project name (e.g. Smith residence)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
          />
          <input
            placeholder="Address (optional, used for satellite imagery)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setCreating(false)} className="px-3 py-1.5 text-sm text-slate-400 hover:text-slate-100">
              Cancel
            </button>
            <button onClick={create} className="px-3 py-1.5 text-sm bg-moss-600 hover:bg-moss-500 rounded-md">
              Create
            </button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          No projects yet. Create one to get started.
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p) => (
            <li
              key={p.id}
              className="group relative rounded-lg border border-slate-800 bg-slate-900/40 hover:border-moss-600 transition"
            >
              <Link to={`/project/${p.id}`} className="block p-4">
                <div className="font-medium mb-1 truncate">{p.name}</div>
                {p.address && (
                  <div className="text-xs text-slate-400 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3" /> {p.address}
                  </div>
                )}
                <div className="text-xs text-slate-500 mt-2">
                  Updated {new Date(p.updatedAt).toLocaleString()}
                </div>
              </Link>
              <button
                onClick={() => remove(p.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400"
                title="Delete project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
````

---

<a id="src-routes-Editor-tsx"></a>
## `src/routes/Editor.tsx`

````typescript
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ImageIcon, Map, Box, Save } from 'lucide-react'
import { useProject } from '../lib/store'
import AIPhotoStudio from '../modules/ai-photo/AIPhotoStudio'
import PlanCanvas from '../modules/plan-2d/PlanCanvas'
import SceneViewer from '../modules/scene-3d/SceneViewer'

export default function Editor() {
  const { id } = useParams<{ id: string }>()
  const { project, tab, setTab, load, rename, dirty, save } = useProject()

  useEffect(() => {
    if (id) void load(id)
  }, [id, load])

  if (!project) {
    return <div className="p-10 text-slate-500">Loading…</div>
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-3 h-11 border-b border-slate-800 bg-slate-900/40">
        <Link to="/" className="text-slate-400 hover:text-slate-100" title="Back to projects">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <input
          value={project.name}
          onChange={(e) => rename(e.target.value)}
          className="bg-transparent text-sm font-medium outline-none focus:bg-slate-800 px-1 rounded"
        />
        <div className="ml-auto flex items-center gap-1">
          <TabButton icon={<ImageIcon className="w-4 h-4" />} label="AI photo" active={tab === 'photo'} onClick={() => setTab('photo')} />
          <TabButton icon={<Map className="w-4 h-4" />} label="2D plan" active={tab === 'plan'} onClick={() => setTab('plan')} />
          <TabButton icon={<Box className="w-4 h-4" />} label="3D scene" active={tab === 'scene'} onClick={() => setTab('scene')} />
        </div>
        <button
          onClick={() => void save()}
          className="ml-3 flex items-center gap-1 text-xs text-slate-400 hover:text-slate-100"
          title="Save now"
        >
          <Save className="w-3.5 h-3.5" />
          {dirty ? 'Unsaved' : 'Saved'}
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {tab === 'photo' && <AIPhotoStudio />}
        {tab === 'plan' && <PlanCanvas />}
        {tab === 'scene' && <SceneViewer />}
      </div>
    </div>
  )
}

function TabButton({
  icon, label, active, onClick,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition ${
        active ? 'bg-moss-600 text-white' : 'text-slate-300 hover:bg-slate-800'
      }`}
    >
      {icon} {label}
    </button>
  )
}
````

---

<a id="src-routes-Settings-tsx"></a>
## `src/routes/Settings.tsx`

````typescript
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import { api } from '../lib/api'

export default function Settings() {
  const [status, setStatus] = useState<{ hasReplicateToken: boolean; hasMapboxToken: boolean } | null>(null)
  const [replicate, setReplicate] = useState('')
  const [mapbox, setMapbox] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.config.get().then((s) => setStatus(s))
  }, [])

  async function save() {
    const patch: Record<string, string> = {}
    if (replicate) patch.replicateToken = replicate
    if (mapbox) patch.mapboxToken = mapbox
    const s = await api.config.set(patch)
    setStatus(s)
    setReplicate(''); setMapbox('')
    setSaved(true); setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <Link to="/" className="text-sm text-slate-400 hover:text-slate-100 flex items-center gap-1 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <h1 className="text-2xl font-semibold mb-2">Settings</h1>
      <p className="text-sm text-slate-400 mb-6">
        Tokens are stored locally in your user data directory. Leave a field blank to keep the existing value.
      </p>

      <Field
        label="Replicate API token"
        hint="Used for AI photo redesigns (Stable Diffusion + ControlNet). Without a token, the app returns mock variants so the UI still works."
        configured={!!status?.hasReplicateToken}
        value={replicate}
        onChange={setReplicate}
        placeholder="r8_..."
      />
      <Field
        label="Mapbox token"
        hint="Used for satellite imagery and address geocoding. Without a token, a placeholder tile is shown."
        configured={!!status?.hasMapboxToken}
        value={mapbox}
        onChange={setMapbox}
        placeholder="pk.eyJ..."
      />

      <div className="flex justify-end items-center gap-3 mt-6">
        {saved && <span className="text-xs text-moss-500">Saved.</span>}
        <button onClick={save} className="px-3 py-1.5 text-sm bg-moss-600 hover:bg-moss-500 rounded">
          Save tokens
        </button>
      </div>
    </div>
  )
}

function Field({
  label, hint, configured, value, onChange, placeholder,
}: {
  label: string
  hint: string
  configured: boolean
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-medium">{label}</label>
        {configured ? (
          <span className="text-xs text-moss-500 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Configured
          </span>
        ) : (
          <span className="text-xs text-amber-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Not set
          </span>
        )}
      </div>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm font-mono"
      />
      <p className="text-xs text-slate-500 mt-1">{hint}</p>
    </div>
  )
}
````

---

<a id="src-modules-ai-photo-AIPhotoStudio-tsx"></a>
## `src/modules/ai-photo/AIPhotoStudio.tsx`

````typescript
import { useEffect, useMemo, useRef, useState } from 'react'
import { Sparkles, Upload, Brush, Eraser, Loader2, Pin, PinOff, SplitSquareHorizontal } from 'lucide-react'
import { useProject } from '../../lib/store'
import { api, unwrap } from '../../lib/api'
import type { ControlNetKind, AIPhotoSession } from '@shared/types'
import BeforeAfter from './BeforeAfter'

const STYLE_PRESETS: Array<{ label: string; prompt: string }> = [
  { label: 'Modern xeriscape', prompt: 'modern xeriscape backyard with drought-tolerant plants, decomposed granite, board-formed concrete planters, golden hour' },
  { label: 'Tropical resort', prompt: 'tropical resort backyard with palm trees, monstera, lush ferns, infinity pool, teak deck, soft evening light' },
  { label: 'English cottage', prompt: 'english cottage garden with lavender, roses, foxglove, stone path, wrought iron, soft overcast light' },
  { label: 'Japanese zen', prompt: 'japanese zen garden with raked gravel, moss, weathered stone lanterns, japanese maple, koi pond' },
  { label: 'Mediterranean', prompt: 'mediterranean courtyard with olive trees, terracotta pavers, rosemary, citrus, stucco walls, warm afternoon light' },
  { label: 'Desert modern', prompt: 'desert modern landscape with agave, ocotillo, saguaro, rusted steel planters, gravel, dramatic shadows' },
]

export default function AIPhotoStudio() {
  const { project, addPhotoSession } = useProject()
  const [sourceImage, setSourceImage] = useState<string | null>(null)
  const [compare, setCompare] = useState<{ sessionId: string; variantId: string } | null>(null)
  const [prompt, setPrompt] = useState(STYLE_PRESETS[0].prompt)
  const [negative, setNegative] = useState('cluttered, low quality, deformed, blurry, watermark')
  const [controlnet, setControlnet] = useState<ControlNetKind>('canny')
  const [busy, setBusy] = useState(false)
  const [tool, setTool] = useState<'brush' | 'erase'>('brush')
  const [brushSize, setBrushSize] = useState(40)
  const [hasReplicate, setHasReplicate] = useState(false)
  const [models, setModels] = useState<Array<{ id: string; label: string }>>([])

  const fileInput = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const maskCanvas = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const lastPt = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    api.ai.hasToken().then((r) => setHasReplicate(r.hasToken))
    api.ai.listModels().then((r) => setModels(r.models))
  }, [])

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      setSourceImage(reader.result as string)
      // Reset mask
      requestAnimationFrame(() => {
        const c = maskCanvas.current
        if (!c) return
        const ctx = c.getContext('2d')!
        ctx.clearRect(0, 0, c.width, c.height)
      })
    }
    reader.readAsDataURL(f)
  }

  function syncCanvasSize() {
    const img = imgRef.current
    const c = maskCanvas.current
    if (!img || !c) return
    if (c.width !== img.clientWidth || c.height !== img.clientHeight) {
      c.width = img.clientWidth
      c.height = img.clientHeight
    }
  }

  function getPt(e: React.PointerEvent<HTMLCanvasElement>) {
    const r = maskCanvas.current!.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  function paint(p: { x: number; y: number }) {
    const c = maskCanvas.current!
    const ctx = c.getContext('2d')!
    ctx.globalCompositeOperation = tool === 'brush' ? 'source-over' : 'destination-out'
    ctx.fillStyle = 'rgba(90, 138, 74, 0.55)'
    ctx.beginPath()
    ctx.arc(p.x, p.y, brushSize / 2, 0, Math.PI * 2)
    ctx.fill()
    if (lastPt.current) {
      ctx.strokeStyle = ctx.fillStyle
      ctx.lineWidth = brushSize
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(lastPt.current.x, lastPt.current.y)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
    }
    lastPt.current = p
  }

  function exportMaskDataUrl(): string | undefined {
    const c = maskCanvas.current
    if (!c) return undefined
    const ctx = c.getContext('2d')!
    const data = ctx.getImageData(0, 0, c.width, c.height).data
    let anyPixel = false
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 0) { anyPixel = true; break }
    }
    if (!anyPixel) return undefined
    // Re-render as black-and-white mask
    const out = document.createElement('canvas')
    out.width = c.width; out.height = c.height
    const octx = out.getContext('2d')!
    octx.fillStyle = '#000'
    octx.fillRect(0, 0, out.width, out.height)
    const id = ctx.getImageData(0, 0, c.width, c.height)
    const od = octx.getImageData(0, 0, out.width, out.height)
    for (let i = 0; i < id.data.length; i += 4) {
      const a = id.data[i + 3]
      const v = a > 10 ? 255 : 0
      od.data[i] = v; od.data[i + 1] = v; od.data[i + 2] = v; od.data[i + 3] = 255
    }
    octx.putImageData(od, 0, 0)
    return out.toDataURL('image/png')
  }

  async function generate() {
    if (!project || !sourceImage) return
    setBusy(true)
    try {
      const res = unwrap(
        await api.ai.generate({
          projectId: project.id,
          sourceImageDataUrl: sourceImage,
          maskImageDataUrl: exportMaskDataUrl(),
          prompt,
          negativePrompt: negative,
          controlnet,
          variantCount: 4,
        }),
      )
      const session: AIPhotoSession = {
        id: res.sessionId,
        createdAt: new Date().toISOString(),
        sourceImagePath: res.sourceImagePath,
        prompt,
        negativePrompt: negative,
        controlnet,
        variants: res.variants,
      }
      addPhotoSession(session)
    } catch (err) {
      alert((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid grid-cols-[1fr_320px] h-full">
      {/* Canvas pane */}
      <div className="bg-slate-900/30 relative overflow-auto p-6">
        {!sourceImage ? (
          <button
            onClick={() => fileInput.current?.click()}
            className="w-full h-full min-h-[400px] rounded-lg border-2 border-dashed border-slate-700 hover:border-moss-500 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-slate-200"
          >
            <Upload className="w-10 h-10" />
            <div>Click to upload a photo of the client's yard</div>
            <div className="text-xs">JPG or PNG, ideally a single landscape orientation shot</div>
          </button>
        ) : (
          <div className="space-y-6">
            <div className="relative inline-block max-w-full">
              <img
                ref={imgRef}
                src={sourceImage}
                onLoad={syncCanvasSize}
                className="max-w-full rounded-lg border border-slate-800"
                alt="source"
              />
              <canvas
                ref={maskCanvas}
                className="absolute inset-0 cursor-crosshair rounded-lg"
                onPointerDown={(e) => {
                  drawing.current = true
                  lastPt.current = null
                  paint(getPt(e))
                  ;(e.target as HTMLCanvasElement).setPointerCapture(e.pointerId)
                }}
                onPointerMove={(e) => {
                  if (drawing.current) paint(getPt(e))
                }}
                onPointerUp={(e) => {
                  drawing.current = false
                  lastPt.current = null
                  ;(e.target as HTMLCanvasElement).releasePointerCapture(e.pointerId)
                }}
              />
            </div>

            {project && project.photoSessions.length > 0 && (
              <div className="space-y-4">
                {project.photoSessions.map((s) => (
                  <SessionGallery
                    key={s.id}
                    session={s}
                    onCompare={(variantId) => setCompare({ sessionId: s.id, variantId })}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        <input ref={fileInput} type="file" accept="image/*" onChange={onUpload} className="hidden" />
      </div>

      {/* Side panel */}
      <aside className="border-l border-slate-800 bg-slate-900/60 p-4 overflow-y-auto">
        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Source</h3>
        <button
          onClick={() => fileInput.current?.click()}
          className="w-full text-sm px-3 py-2 mb-4 bg-slate-800 hover:bg-slate-700 rounded flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" /> {sourceImage ? 'Replace photo' : 'Upload photo'}
        </button>

        {sourceImage && (
          <>
            <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Mask (paint what to change)</h3>
            <div className="flex gap-1 mb-2">
              <button
                onClick={() => setTool('brush')}
                className={`flex-1 px-2 py-1.5 rounded text-sm flex items-center justify-center gap-1 ${tool === 'brush' ? 'bg-moss-600' : 'bg-slate-800'}`}
              ><Brush className="w-3.5 h-3.5" /> Brush</button>
              <button
                onClick={() => setTool('erase')}
                className={`flex-1 px-2 py-1.5 rounded text-sm flex items-center justify-center gap-1 ${tool === 'erase' ? 'bg-moss-600' : 'bg-slate-800'}`}
              ><Eraser className="w-3.5 h-3.5" /> Erase</button>
            </div>
            <label className="text-xs text-slate-400">Brush size: {brushSize}px</label>
            <input
              type="range" min={4} max={120}
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-full mb-4"
            />
          </>
        )}

        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Style presets</h3>
        <div className="grid grid-cols-2 gap-1 mb-3">
          {STYLE_PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setPrompt(p.prompt)}
              className="text-xs px-2 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-left truncate"
              title={p.prompt}
            >
              {p.label}
            </button>
          ))}
        </div>

        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Prompt</h3>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm mb-3"
        />
        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Negative prompt</h3>
        <textarea
          value={negative}
          onChange={(e) => setNegative(e.target.value)}
          rows={2}
          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm mb-3"
        />

        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Model</h3>
        <select
          value={controlnet}
          onChange={(e) => setControlnet(e.target.value as ControlNetKind)}
          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm mb-4"
        >
          {models.map((m) => (
            <option key={m.id} value={m.id}>{m.label}</option>
          ))}
        </select>

        <button
          onClick={generate}
          disabled={!sourceImage || busy}
          className="w-full px-3 py-2 bg-moss-600 hover:bg-moss-500 disabled:bg-slate-800 disabled:text-slate-500 rounded text-sm font-medium flex items-center justify-center gap-2"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {busy ? 'Generating…' : 'Generate 4 variants'}
        </button>

        {!hasReplicate && (
          <p className="text-xs text-amber-400 mt-3">
            No Replicate token set — generation will return mock variants. Add a token in Settings for real renders.
          </p>
        )}
      </aside>

      {compare && project && <CompareLauncher compare={compare} onClose={() => setCompare(null)} />}
    </div>
  )
}

function CompareLauncher({
  compare, onClose,
}: {
  compare: { sessionId: string; variantId: string }
  onClose: () => void
}) {
  const { project, updatePhotoSession } = useProject()
  const session = useMemo(
    () => project?.photoSessions.find((s) => s.id === compare.sessionId),
    [project, compare.sessionId],
  )
  const variant = session?.variants.find((v) => v.id === compare.variantId)
  if (!session || !variant) return null
  return (
    <BeforeAfter
      beforeUrl={`file://${session.sourceImagePath}`}
      afterUrl={`file://${variant.localPath}`}
      prompt={session.prompt}
      pinned={!!variant.pinned}
      onTogglePin={() => {
        const variants = session.variants.map((v) =>
          v.id === variant.id ? { ...v, pinned: !v.pinned } : v,
        )
        updatePhotoSession(session.id, { variants })
      }}
      onClose={onClose}
    />
  )
}

function SessionGallery({
  session, onCompare,
}: {
  session: AIPhotoSession
  onCompare: (variantId: string) => void
}) {
  const { project, updatePhotoSession } = useProject()
  if (!project) return null

  function togglePin(variantId: string) {
    if (!project) return
    const variants = session.variants.map((v) =>
      v.id === variantId ? { ...v, pinned: !v.pinned } : v,
    )
    updatePhotoSession(session.id, { variants })
  }

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
      <div className="text-xs text-slate-400 mb-2 truncate" title={session.prompt}>
        <span className="text-slate-500 uppercase tracking-wider mr-2">{session.controlnet}</span>
        {session.prompt}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {session.variants.map((v) => (
          <div key={v.id} className="relative group">
            <button
              onClick={() => onCompare(v.id)}
              className="block w-full text-left"
              title="Open before / after comparison"
            >
              <img
                src={`file://${v.localPath}`}
                alt="variant"
                className="w-full aspect-square object-cover rounded border border-slate-800 group-hover:border-moss-500 transition"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded">
                <span className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-moss-600 text-white">
                  <SplitSquareHorizontal className="w-3.5 h-3.5" /> Compare
                </span>
              </div>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); togglePin(v.id) }}
              className={`absolute top-1 right-1 p-1 rounded ${v.pinned ? 'bg-moss-600 text-white' : 'bg-black/60 text-slate-300 opacity-0 group-hover:opacity-100'}`}
              title={v.pinned ? 'Unpin' : 'Pin favorite'}
            >
              {v.pinned ? <Pin className="w-3 h-3" /> : <PinOff className="w-3 h-3" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
````

---

<a id="src-modules-ai-photo-BeforeAfter-tsx"></a>
## `src/modules/ai-photo/BeforeAfter.tsx`

````typescript
import { useEffect, useRef, useState } from 'react'
import { X, ArrowLeftRight, Pin, PinOff } from 'lucide-react'

type Props = {
  beforeUrl: string
  afterUrl: string
  prompt?: string
  pinned?: boolean
  onClose: () => void
  onTogglePin?: () => void
}

export default function BeforeAfter({ beforeUrl, afterUrl, prompt, pinned, onClose, onTogglePin }: Props) {
  const [pos, setPos] = useState(50)
  const [swap, setSwap] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 2))
      if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 2))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function updateFromClientX(clientX: number) {
    const el = wrap.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = ((clientX - r.left) / r.width) * 100
    setPos(Math.max(0, Math.min(100, x)))
  }

  // The "before" image is the bottom layer (always fully visible). The
  // "after" image stacks on top with a clip-path that exposes the left
  // portion up to the slider position. The user effectively wipes the
  // after over the before by dragging right.
  const before = swap ? afterUrl : beforeUrl
  const after = swap ? beforeUrl : afterUrl

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex flex-col">
      <div className="flex items-center gap-3 px-4 h-12 border-b border-slate-800">
        <span className="text-sm font-medium">Before / after</span>
        {prompt && (
          <span className="text-xs text-slate-400 truncate flex-1" title={prompt}>{prompt}</span>
        )}
        <button
          onClick={() => setSwap((s) => !s)}
          className="flex items-center gap-1 text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" /> Swap sides
        </button>
        {onTogglePin && (
          <button
            onClick={onTogglePin}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${pinned ? 'bg-moss-600' : 'bg-slate-800 hover:bg-slate-700'}`}
          >
            {pinned ? <Pin className="w-3.5 h-3.5" /> : <PinOff className="w-3.5 h-3.5" />}
            {pinned ? 'Pinned' : 'Pin favorite'}
          </button>
        )}
        <button onClick={onClose} className="text-slate-400 hover:text-slate-100">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
        <div
          ref={wrap}
          className="relative max-w-full max-h-full select-none cursor-ew-resize"
          onPointerDown={(e) => {
            dragging.current = true
            ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
            updateFromClientX(e.clientX)
          }}
          onPointerMove={(e) => { if (dragging.current) updateFromClientX(e.clientX) }}
          onPointerUp={(e) => {
            dragging.current = false
            ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
          }}
        >
          <img
            src={before}
            alt="before"
            className="block max-w-[90vw] max-h-[80vh] pointer-events-none"
            draggable={false}
          />
          <img
            src={after}
            alt="after"
            className="absolute inset-0 w-full h-full pointer-events-none"
            draggable={false}
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          />

          {/* Labels */}
          <div className="absolute top-2 left-2 text-[10px] uppercase tracking-wider font-semibold bg-black/70 text-white px-2 py-0.5 rounded">
            {swap ? 'After' : 'Before'}
          </div>
          <div className="absolute top-2 right-2 text-[10px] uppercase tracking-wider font-semibold bg-moss-600 text-white px-2 py-0.5 rounded">
            {swap ? 'Before' : 'After'}
          </div>

          {/* Divider */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none"
            style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
          >
            <div className="w-0.5 h-full bg-white shadow-[0_0_8px_rgba(0,0,0,0.6)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center">
              <ArrowLeftRight className="w-4 h-4 text-slate-900" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-4 flex items-center gap-3 text-xs text-slate-400">
        <span>← →</span>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(parseInt(e.target.value))}
          className="flex-1"
        />
        <span className="w-10 text-right font-mono">{Math.round(pos)}%</span>
      </div>
    </div>
  )
}
````

---

<a id="src-modules-plan-2d-PlanCanvas-tsx"></a>
## `src/modules/plan-2d/PlanCanvas.tsx`

````typescript
import { useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Layer, Image as KImage, Circle, Line, Group, Text, Rect } from 'react-konva'
import { nanoid } from 'nanoid'
import {
  Trash2,
  MousePointer2,
  Trees,
  Square,
  Waves,
  Search,
  Hexagon,
  Ruler,
} from 'lucide-react'
import type Konva from 'konva'
import { useProject } from '../../lib/store'
import { api, unwrap } from '../../lib/api'
import { PLANTS, HARDSCAPE_MATERIALS, type PlantSpec } from './palette'
import type { Plant, Hardscape, Water, DesignObject, Point } from '@shared/types'

type Tool = 'select' | 'plant' | 'hardscape' | 'water' | 'property' | 'calibrate'

export default function PlanCanvas() {
  const { project, upsertObject, removeObject, selectedId, select, setSite } = useProject()
  const [tool, setTool] = useState<Tool>('select')
  const [activePlant, setActivePlant] = useState<PlantSpec>(PLANTS[0])
  const [activeMaterial, setActiveMaterial] = useState(HARDSCAPE_MATERIALS[0])
  const [polygonPts, setPolygonPts] = useState<number[]>([])
  const [calibrationPts, setCalibrationPts] = useState<number[]>([])
  const [calibrationInput, setCalibrationInput] = useState('')
  const [satellite, setSatellite] = useState<HTMLImageElement | null>(null)
  const [satBboxMeters, setSatBboxMeters] = useState<{ width: number; height: number } | null>(null)
  const [addressQuery, setAddressQuery] = useState('')
  const stageWrap = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 1000, h: 700 })

  useEffect(() => {
    function onResize() {
      const el = stageWrap.current
      if (!el) return
      setSize({ w: el.clientWidth, h: el.clientHeight })
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!project) return
    let cancelled = false
    ;(async () => {
      try {
        const r = unwrap(
          await api.satellite.fetch({
            center: project.site.center,
            zoom: project.site.zoom,
            width: 1024,
            height: 1024,
          }),
        )
        if (cancelled) return
        const img = new window.Image()
        img.onload = () => {
          if (!cancelled) {
            setSatellite(img)
            setSatBboxMeters(r.bboxMeters)
          }
        }
        img.src = `file://${r.localPath}`
      } catch (e) {
        console.warn('satellite fetch failed', e)
      }
    })()
    return () => { cancelled = true }
  }, [project?.site.center.lat, project?.site.center.lng, project?.site.zoom])

  // Reset any in-progress polygon when switching tools.
  useEffect(() => {
    setPolygonPts([])
    setCalibrationPts([])
    setCalibrationInput('')
  }, [tool])

  const basePxPerMeter = useMemo(() => {
    if (!satBboxMeters || !satellite) return 30
    return Math.min(size.w / satBboxMeters.width, size.h / satBboxMeters.height)
  }, [satBboxMeters, satellite, size])

  const scaleCalibration = project?.site.scaleCalibration ?? 1
  const pxPerMeter = basePxPerMeter * scaleCalibration

  const originX = size.w / 2
  const originY = size.h / 2

  function metersToPx(p: Point) {
    return { x: originX + p.x * pxPerMeter, y: originY + p.y * pxPerMeter }
  }
  function pxToMeters(p: { x: number; y: number }): Point {
    return { x: (p.x - originX) / pxPerMeter, y: (p.y - originY) / pxPerMeter }
  }

  function onStageMouseDown(e: Konva.KonvaEventObject<MouseEvent>) {
    if (!project) return
    const stage = e.target.getStage()
    if (!stage) return
    const pos = stage.getPointerPosition()
    if (!pos) return
    const m = pxToMeters(pos)

    if (tool === 'select') {
      if (e.target === stage) select(null)
      return
    }
    if (tool === 'plant') {
      const plant: Plant = {
        kind: 'plant',
        id: nanoid(8),
        species: activePlant.species,
        x: m.x,
        y: m.y,
        radius: activePlant.radius,
        height: activePlant.height,
      }
      upsertObject(plant)
      return
    }
    if (tool === 'hardscape' || tool === 'water' || tool === 'property') {
      setPolygonPts((prev) => [...prev, pos.x, pos.y])
      return
    }
    if (tool === 'calibrate') {
      setCalibrationPts((prev) => {
        if (prev.length >= 4) return [pos.x, pos.y] // restart on 3rd click
        return [...prev, pos.x, pos.y]
      })
    }
  }

  function commitPolygon() {
    if (!project || polygonPts.length < 6) {
      setPolygonPts([])
      return
    }
    const pts: Point[] = []
    for (let i = 0; i < polygonPts.length; i += 2) {
      pts.push(pxToMeters({ x: polygonPts[i], y: polygonPts[i + 1] }))
    }
    if (tool === 'hardscape') {
      upsertObject({
        kind: 'hardscape',
        id: nanoid(8),
        material: activeMaterial.id as Hardscape['material'],
        polygon: pts,
      })
    } else if (tool === 'water') {
      upsertObject({
        kind: 'water',
        id: nanoid(8),
        shape: 'pool',
        polygon: pts,
        depth: 1.5,
      } as Water)
    } else if (tool === 'property') {
      setSite({ propertyPolygon: pts })
    }
    setPolygonPts([])
  }

  function applyCalibration() {
    if (calibrationPts.length < 4) return
    const realMeters = parseFloat(calibrationInput)
    if (!isFinite(realMeters) || realMeters <= 0) return
    const dx = calibrationPts[2] - calibrationPts[0]
    const dy = calibrationPts[3] - calibrationPts[1]
    const pxDist = Math.hypot(dx, dy)
    if (pxDist < 1) return
    // We want pxPerMeter_new such that pxDist / pxPerMeter_new = realMeters.
    // pxPerMeter_new = basePxPerMeter * newScale ⇒ newScale = pxDist / (realMeters * basePxPerMeter).
    const newScale = pxDist / (realMeters * basePxPerMeter)
    setSite({ scaleCalibration: newScale })
    setCalibrationPts([])
    setCalibrationInput('')
    setTool('select')
  }

  function clearProperty() {
    setSite({ propertyPolygon: [] })
  }

  function clearCalibration() {
    setSite({ scaleCalibration: 1 })
  }

  async function geocode() {
    if (!addressQuery) return
    try {
      const r = unwrap(await api.satellite.geocode(addressQuery))
      setSite({ address: r.label, center: { lat: r.lat, lng: r.lng } })
    } catch (e) {
      alert((e as Error).message)
    }
  }

  function moveVertex(index: number, newPos: { x: number; y: number }) {
    if (!project) return
    const m = pxToMeters(newPos)
    const next = project.site.propertyPolygon.map((p, i) => (i === index ? m : p))
    setSite({ propertyPolygon: next })
  }

  if (!project) return null

  const propertyPolygon = project.site.propertyPolygon
  const propertyArea = polygonArea(propertyPolygon)
  const propertyPerimeter = polygonPerimeter(propertyPolygon)

  const calibrationPxDist =
    calibrationPts.length >= 4
      ? Math.hypot(
          calibrationPts[2] - calibrationPts[0],
          calibrationPts[3] - calibrationPts[1],
        )
      : 0
  const calibrationMeters = calibrationPxDist / pxPerMeter

  return (
    <div className="grid grid-cols-[260px_1fr_280px] h-full">
      {/* Left tool palette */}
      <aside className="border-r border-slate-800 bg-slate-900/60 p-3 overflow-y-auto">
        <div className="grid grid-cols-3 gap-1 mb-3">
          <ToolBtn icon={<MousePointer2 className="w-4 h-4" />} active={tool === 'select'} onClick={() => setTool('select')} label="Select" />
          <ToolBtn icon={<Hexagon className="w-4 h-4" />} active={tool === 'property'} onClick={() => setTool('property')} label="Lot" />
          <ToolBtn icon={<Ruler className="w-4 h-4" />} active={tool === 'calibrate'} onClick={() => setTool('calibrate')} label="Scale" />
          <ToolBtn icon={<Trees className="w-4 h-4" />} active={tool === 'plant'} onClick={() => setTool('plant')} label="Plant" />
          <ToolBtn icon={<Square className="w-4 h-4" />} active={tool === 'hardscape'} onClick={() => setTool('hardscape')} label="Hard" />
          <ToolBtn icon={<Waves className="w-4 h-4" />} active={tool === 'water'} onClick={() => setTool('water')} label="Water" />
        </div>

        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Site</h3>
        <div className="flex gap-1 mb-3">
          <input
            value={addressQuery}
            onChange={(e) => setAddressQuery(e.target.value)}
            placeholder={project.site.address || 'Search address'}
            className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm"
            onKeyDown={(e) => { if (e.key === 'Enter') geocode() }}
          />
          <button onClick={geocode} className="px-2 bg-slate-800 hover:bg-slate-700 rounded">
            <Search className="w-4 h-4" />
          </button>
        </div>
        <label className="text-xs text-slate-400 block mb-1">Zoom: {project.site.zoom}</label>
        <input
          type="range" min={16} max={21}
          value={project.site.zoom}
          onChange={(e) => setSite({ zoom: parseInt(e.target.value) })}
          className="w-full mb-4"
        />

        {tool === 'property' && (
          <div className="mb-4 p-2 rounded bg-slate-950/60 border border-slate-800">
            <p className="text-xs text-slate-400 mb-2">
              Click each corner of the property line. Finish to commit a closed polygon. Drag any vertex later to refine.
            </p>
            {propertyPolygon.length > 0 && (
              <button
                onClick={clearProperty}
                className="w-full text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded mb-1"
              >
                Clear existing trace
              </button>
            )}
            {polygonPts.length >= 6 && (
              <button
                onClick={commitPolygon}
                className="w-full text-sm px-3 py-2 bg-moss-600 hover:bg-moss-500 rounded mt-1"
              >
                Finish property ({polygonPts.length / 2} vertices)
              </button>
            )}
            {polygonPts.length > 0 && (
              <button
                onClick={() => setPolygonPts([])}
                className="w-full text-xs text-slate-400 hover:text-slate-100 mt-1"
              >
                Cancel
              </button>
            )}
          </div>
        )}

        {tool === 'calibrate' && (
          <div className="mb-4 p-2 rounded bg-slate-950/60 border border-slate-800">
            <p className="text-xs text-slate-400 mb-2">
              Click two ends of something with a known length (driveway, fence, garage wall), then enter its real-world length to calibrate the scale.
            </p>
            <div className="text-xs text-slate-500 mb-2">
              Current scale: 1 m = {pxPerMeter.toFixed(1)} px
              {scaleCalibration !== 1 && (
                <span className="ml-1 text-amber-400">(×{scaleCalibration.toFixed(3)})</span>
              )}
            </div>
            {calibrationPts.length >= 4 && (
              <>
                <div className="text-xs text-slate-300 mb-1">
                  Measured: <span className="font-mono">{calibrationMeters.toFixed(2)} m</span>
                </div>
                <label className="text-xs text-slate-400">Actual length (meters):</label>
                <input
                  autoFocus
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={calibrationInput}
                  onChange={(e) => setCalibrationInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') applyCalibration() }}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm mt-1"
                  placeholder="e.g. 6.10"
                />
                <button
                  onClick={applyCalibration}
                  disabled={!calibrationInput}
                  className="w-full mt-2 px-3 py-1.5 bg-moss-600 hover:bg-moss-500 disabled:bg-slate-800 disabled:text-slate-500 rounded text-sm"
                >
                  Apply calibration
                </button>
              </>
            )}
            {scaleCalibration !== 1 && (
              <button
                onClick={clearCalibration}
                className="w-full mt-2 px-3 py-1 text-xs text-slate-400 hover:text-slate-100"
              >
                Reset to Mercator default
              </button>
            )}
          </div>
        )}

        {tool === 'plant' && (
          <>
            <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Plants</h3>
            <div className="space-y-1">
              {PLANTS.map((p) => (
                <button
                  key={p.species}
                  onClick={() => setActivePlant(p)}
                  className={`w-full text-left text-sm px-2 py-1.5 rounded flex items-center gap-2 ${activePlant.species === p.species ? 'bg-moss-600' : 'bg-slate-800 hover:bg-slate-700'}`}
                >
                  <span className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                  <span className="flex-1 truncate">{p.commonName}</span>
                  <span className="text-xs text-slate-400">{p.radius}m</span>
                </button>
              ))}
            </div>
          </>
        )}

        {tool === 'hardscape' && (
          <>
            <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Materials</h3>
            <div className="space-y-1">
              {HARDSCAPE_MATERIALS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveMaterial(m)}
                  className={`w-full text-left text-sm px-2 py-1.5 rounded flex items-center gap-2 ${activeMaterial.id === m.id ? 'bg-moss-600' : 'bg-slate-800 hover:bg-slate-700'}`}
                >
                  <span className="w-3 h-3 rounded" style={{ background: m.fill }} />
                  {m.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3">Click on the canvas to add vertices, then click "Finish" to close the polygon.</p>
          </>
        )}

        {(tool === 'hardscape' || tool === 'water') && polygonPts.length >= 6 && (
          <button
            onClick={commitPolygon}
            className="w-full mt-3 px-3 py-2 bg-moss-600 hover:bg-moss-500 rounded text-sm"
          >
            Finish polygon ({polygonPts.length / 2} vertices)
          </button>
        )}
        {(tool === 'hardscape' || tool === 'water') && polygonPts.length > 0 && (
          <button
            onClick={() => setPolygonPts([])}
            className="w-full mt-1 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-100"
          >
            Cancel
          </button>
        )}
      </aside>

      {/* Stage */}
      <div ref={stageWrap} className="bg-slate-950 relative">
        <Stage width={size.w} height={size.h} onMouseDown={onStageMouseDown}>
          <Layer>
            {satellite && (
              <KImage
                image={satellite}
                x={originX - size.w / 2}
                y={originY - size.h / 2}
                width={size.w}
                height={size.h}
                opacity={0.85}
              />
            )}
            {pxPerMeter > 0 && (
              <Group x={20} y={size.h - 30}>
                <Rect width={pxPerMeter * 5} height={4} fill="#fff" />
                <Text text="5 m" y={-16} fill="#fff" fontSize={11} />
              </Group>
            )}
          </Layer>

          {/* Property polygon layer (below design objects) */}
          <Layer listening={tool === 'property' || tool === 'select'}>
            {propertyPolygon.length >= 3 && (
              <Line
                points={propertyPolygon.flatMap((p) => {
                  const q = metersToPx(p)
                  return [q.x, q.y]
                })}
                stroke="#facc15"
                strokeWidth={2}
                dash={[8, 6]}
                closed
                fill="rgba(250, 204, 21, 0.08)"
                listening={false}
              />
            )}
            {tool === 'property' && propertyPolygon.map((p, i) => {
              const q = metersToPx(p)
              return (
                <Circle
                  key={i}
                  x={q.x}
                  y={q.y}
                  radius={6}
                  fill="#facc15"
                  stroke="#000"
                  strokeWidth={1}
                  draggable
                  onDragMove={(e) => moveVertex(i, { x: e.target.x(), y: e.target.y() })}
                />
              )
            })}
          </Layer>

          <Layer>
            {project.design.map((o) =>
              renderObject(o, metersToPx, pxPerMeter, selectedId === o.id, () => select(o.id), HARDSCAPE_MATERIALS),
            )}
            {polygonPts.length > 0 && (
              <Line
                points={polygonPts}
                stroke={tool === 'property' ? '#facc15' : '#5a8a4a'}
                strokeWidth={2}
                dash={[4, 4]}
                closed={false}
              />
            )}
            {/* Calibration line */}
            {calibrationPts.length >= 2 && (
              <Group>
                <Line
                  points={calibrationPts}
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dash={[6, 4]}
                />
                {calibrationPts.length >= 4 && (
                  <Text
                    x={(calibrationPts[0] + calibrationPts[2]) / 2 + 8}
                    y={(calibrationPts[1] + calibrationPts[3]) / 2 - 14}
                    text={`${calibrationMeters.toFixed(2)} m`}
                    fill="#38bdf8"
                    fontSize={12}
                  />
                )}
                {[0, 2].map((i) => (
                  <Circle key={i} x={calibrationPts[i]} y={calibrationPts[i + 1]} radius={4} fill="#38bdf8" />
                ))}
              </Group>
            )}
          </Layer>
        </Stage>
      </div>

      {/* Right inspector */}
      <aside className="border-l border-slate-800 bg-slate-900/60 p-3 overflow-y-auto">
        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Property</h3>
        {propertyPolygon.length >= 3 ? (
          <div className="text-sm space-y-1 mb-4">
            <div className="flex justify-between">
              <span className="text-slate-400">Area</span>
              <span className="font-mono">{propertyArea.toFixed(0)} m² ({(propertyArea * 10.7639).toFixed(0)} ft²)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Perimeter</span>
              <span className="font-mono">{propertyPerimeter.toFixed(1)} m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Vertices</span>
              <span className="font-mono">{propertyPolygon.length}</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 mb-4">
            Use the <span className="text-yellow-400">Lot</span> tool to trace the property line.
          </p>
        )}

        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Plant schedule</h3>
        <PlantSchedule design={project.design} />

        {selectedId && (
          <div className="mt-6">
            <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Selected</h3>
            <button
              onClick={() => removeObject(selectedId)}
              className="w-full text-sm px-3 py-1.5 bg-red-900/40 hover:bg-red-900/70 rounded flex items-center justify-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}

function ToolBtn({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`px-2 py-1.5 rounded flex flex-col items-center justify-center gap-0.5 text-[10px] ${active ? 'bg-moss-600' : 'bg-slate-800 hover:bg-slate-700'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

function renderObject(
  o: DesignObject,
  m2p: (p: Point) => { x: number; y: number },
  pxPerMeter: number,
  selected: boolean,
  onSelect: () => void,
  materials: typeof HARDSCAPE_MATERIALS,
) {
  if (o.kind === 'plant') {
    const p = m2p({ x: o.x, y: o.y })
    const plant = PLANTS.find((q) => q.species === o.species)
    const color = plant?.color ?? '#5a8a4a'
    return (
      <Group key={o.id} x={p.x} y={p.y} onClick={onSelect} onTap={onSelect}>
        <Circle radius={o.radius * pxPerMeter} fill={color} opacity={0.45} stroke={selected ? '#fff' : color} strokeWidth={selected ? 2 : 1} />
        <Circle radius={3} fill="#fff" opacity={0.8} />
      </Group>
    )
  }
  if (o.kind === 'hardscape') {
    const pts = o.polygon.flatMap((p) => { const q = m2p(p); return [q.x, q.y] })
    const mat = materials.find((mm) => mm.id === o.material)
    return (
      <Line
        key={o.id}
        points={pts}
        fill={mat?.fill ?? '#888'}
        closed
        opacity={0.55}
        stroke={selected ? '#fff' : '#000'}
        strokeWidth={selected ? 2 : 1}
        onClick={onSelect}
        onTap={onSelect}
      />
    )
  }
  if (o.kind === 'water') {
    const pts = o.polygon.flatMap((p) => { const q = m2p(p); return [q.x, q.y] })
    return (
      <Line
        key={o.id}
        points={pts}
        fill="#3a7aa0"
        closed
        opacity={0.7}
        stroke={selected ? '#fff' : '#2a5a80'}
        strokeWidth={selected ? 2 : 1}
        onClick={onSelect}
        onTap={onSelect}
      />
    )
  }
  return null
}

function PlantSchedule({ design }: { design: DesignObject[] }) {
  const counts = new Map<string, number>()
  for (const o of design) {
    if (o.kind === 'plant') counts.set(o.species, (counts.get(o.species) ?? 0) + 1)
  }
  if (counts.size === 0) {
    return <p className="text-xs text-slate-500">No plants placed yet.</p>
  }
  return (
    <ul className="text-sm space-y-1">
      {[...counts.entries()].map(([species, n]) => {
        const p = PLANTS.find((q) => q.species === species)
        return (
          <li key={species} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: p?.color ?? '#888' }} />
            <span className="flex-1 truncate">{p?.commonName ?? species}</span>
            <span className="text-slate-400 text-xs">×{n}</span>
          </li>
        )
      })}
    </ul>
  )
}

function polygonArea(pts: Point[]): number {
  if (pts.length < 3) return 0
  let a = 0
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length
    a += pts[i].x * pts[j].y - pts[j].x * pts[i].y
  }
  return Math.abs(a / 2)
}

function polygonPerimeter(pts: Point[]): number {
  if (pts.length < 2) return 0
  let p = 0
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i]
    const b = pts[(i + 1) % pts.length]
    p += Math.hypot(b.x - a.x, b.y - a.y)
  }
  return p
}
````

---

<a id="src-modules-plan-2d-palette-ts"></a>
## `src/modules/plan-2d/palette.ts`

````typescript
// Starter plant + material library. Real product would load from a JSON file
// with species data (mature size, USDA zones, water needs, sun, etc.) and from
// a designer-editable catalog.

export type PlantSpec = {
  species: string
  commonName: string
  radius: number   // mature canopy radius, meters
  height: number   // meters
  color: string    // canvas fill
  category: 'tree' | 'shrub' | 'grass' | 'groundcover' | 'perennial'
}

export const PLANTS: PlantSpec[] = [
  { species: 'Quercus agrifolia', commonName: 'Coast Live Oak', radius: 6, height: 12, color: '#3e6b2a', category: 'tree' },
  { species: 'Acer palmatum', commonName: 'Japanese Maple', radius: 2.5, height: 4, color: '#a14b2a', category: 'tree' },
  { species: 'Olea europaea', commonName: 'Olive Tree', radius: 3.5, height: 6, color: '#7a8a52', category: 'tree' },
  { species: 'Lagerstroemia indica', commonName: 'Crepe Myrtle', radius: 2, height: 5, color: '#a05a7a', category: 'tree' },
  { species: 'Buxus sempervirens', commonName: 'Boxwood', radius: 0.6, height: 1, color: '#4a7044', category: 'shrub' },
  { species: 'Rosmarinus officinalis', commonName: 'Rosemary', radius: 0.7, height: 0.8, color: '#5a7a5a', category: 'shrub' },
  { species: 'Lavandula angustifolia', commonName: 'English Lavender', radius: 0.5, height: 0.6, color: '#7a6aa0', category: 'perennial' },
  { species: 'Agave americana', commonName: 'Century Plant', radius: 1.2, height: 1.5, color: '#6a8a6a', category: 'shrub' },
  { species: 'Phormium tenax', commonName: 'New Zealand Flax', radius: 1, height: 1.5, color: '#8a5a3a', category: 'grass' },
  { species: 'Festuca glauca', commonName: 'Blue Fescue', radius: 0.3, height: 0.3, color: '#6a8aa0', category: 'grass' },
  { species: 'Sedum spectabile', commonName: 'Stonecrop', radius: 0.4, height: 0.5, color: '#7a8a4a', category: 'groundcover' },
  { species: 'Trachelospermum jasminoides', commonName: 'Star Jasmine', radius: 0.8, height: 0.4, color: '#5a8a6a', category: 'groundcover' },
]

export type MaterialSpec = {
  id: string
  label: string
  fill: string
  pattern?: 'cross' | 'dots'
}

export const HARDSCAPE_MATERIALS: MaterialSpec[] = [
  { id: 'flagstone', label: 'Flagstone', fill: '#a09b8a' },
  { id: 'concrete', label: 'Concrete', fill: '#c8c8c0' },
  { id: 'pavers', label: 'Pavers', fill: '#8a7a6a', pattern: 'cross' },
  { id: 'gravel', label: 'Gravel', fill: '#b0a890', pattern: 'dots' },
  { id: 'turf', label: 'Lawn / Turf', fill: '#5a8a4a' },
  { id: 'mulch', label: 'Mulch', fill: '#5a3e22' },
  { id: 'deck', label: 'Wood deck', fill: '#7a5a3a' },
]
````

---

<a id="src-modules-scene-3d-SceneViewer-tsx"></a>
## `src/modules/scene-3d/SceneViewer.tsx`

````typescript
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, Sky, Environment, Grid, Line as DreiLine } from '@react-three/drei'
import { TextureLoader, RepeatWrapping, type Texture } from 'three'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { Sun, Crosshair } from 'lucide-react'
import { useProject } from '../../lib/store'
import { api, unwrap } from '../../lib/api'
import PlantModel from './PlantModel'
import type { DesignObject, Point } from '@shared/types'

export default function SceneViewer() {
  const { project } = useProject()
  const [timeOfDay, setTimeOfDay] = useState(13)
  const [sunAzimuth, setSunAzimuth] = useState(160)
  const [satellite, setSatellite] = useState<{ url: string; w: number; h: number } | null>(null)
  const [recenterTick, setRecenterTick] = useState(0)

  // Fetch the satellite tile so we can paint it onto the 3D ground.
  useEffect(() => {
    if (!project) return
    let cancelled = false
    ;(async () => {
      try {
        const r = unwrap(
          await api.satellite.fetch({
            center: project.site.center,
            zoom: project.site.zoom,
            width: 1024,
            height: 1024,
          }),
        )
        if (!cancelled) {
          setSatellite({
            url: `file://${r.localPath}`,
            w: r.bboxMeters.width,
            h: r.bboxMeters.height,
          })
        }
      } catch {
        if (!cancelled) setSatellite(null)
      }
    })()
    return () => { cancelled = true }
  }, [project?.site.center.lat, project?.site.center.lng, project?.site.zoom])

  const sunPosition = useMemo(() => {
    const t = (timeOfDay - 6) / 12
    const elev = Math.sin(t * Math.PI)
    const az = (sunAzimuth * Math.PI) / 180
    const dist = 100
    const y = Math.max(2, elev * 80)
    const x = Math.sin(az) * dist
    const z = Math.cos(az) * dist
    return [x, y, z] as [number, number, number]
  }, [timeOfDay, sunAzimuth])

  // Where to point the camera initially / on recenter.
  const cameraTarget = useMemo<[number, number, number]>(() => {
    if (!project) return [0, 1, 0]
    const poly = project.site.propertyPolygon
    if (poly.length < 3) return [0, 1, 0]
    let sx = 0, sy = 0
    for (const p of poly) { sx += p.x; sy += p.y }
    return [sx / poly.length, 1, sy / poly.length]
  }, [project?.site.propertyPolygon])

  if (!project) return null

  return (
    <div className="grid grid-cols-[1fr_260px] h-full">
      <div className="bg-slate-950 relative">
        <Canvas key={recenterTick} camera={{ position: [25, 18, 25], fov: 50 }} shadows>
          <Suspense fallback={null}>
            <Sky sunPosition={sunPosition} turbidity={6} rayleigh={1} />
            <ambientLight intensity={0.35} />
            <directionalLight
              position={sunPosition}
              intensity={1.1}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-left={-40}
              shadow-camera-right={40}
              shadow-camera-top={40}
              shadow-camera-bottom={-40}
            />
            {satellite ? (
              <SatelliteGround url={satellite.url} width={satellite.w} height={satellite.h} />
            ) : (
              <FallbackGround />
            )}
            <Grid args={[80, 80]} cellColor="#2a3a2a" sectionColor="#3a5a3a" fadeDistance={60} infiniteGrid position={[0, 0.011, 0]} />
            <PropertyOutline polygon={project.site.propertyPolygon} />
            {project.design.map((o) => (
              <SceneObject key={o.id} obj={o} />
            ))}
            <Environment preset="park" background={false} />
            <OrbitControls enableDamping target={cameraTarget} maxPolarAngle={Math.PI / 2.1} />
          </Suspense>
        </Canvas>
        {project.design.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm pointer-events-none">
            Drop objects on the 2D plan to see them here.
          </div>
        )}
      </div>

      <aside className="border-l border-slate-800 bg-slate-900/60 p-3 overflow-y-auto">
        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
          <Sun className="w-3.5 h-3.5" /> Sun
        </h3>
        <label className="text-xs text-slate-400">Time of day: {timeOfDay}:00</label>
        <input type="range" min={6} max={20} value={timeOfDay} onChange={(e) => setTimeOfDay(parseInt(e.target.value))} className="w-full mb-3" />
        <label className="text-xs text-slate-400">Azimuth: {sunAzimuth}°</label>
        <input type="range" min={0} max={360} value={sunAzimuth} onChange={(e) => setSunAzimuth(parseInt(e.target.value))} className="w-full mb-4" />

        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Camera</h3>
        <button
          onClick={() => setRecenterTick((t) => t + 1)}
          className="w-full text-sm px-3 py-1.5 mb-2 bg-slate-800 hover:bg-slate-700 rounded flex items-center justify-center gap-2"
        >
          <Crosshair className="w-3.5 h-3.5" /> Recenter on property
        </button>
        <p className="text-xs text-slate-500">Drag to orbit · Scroll to zoom · Right-drag to pan</p>

        <h3 className="text-xs uppercase tracking-wider text-slate-500 mt-6 mb-2">Status</h3>
        <ul className="text-xs text-slate-400 space-y-0.5">
          <li>{project.design.filter((o) => o.kind === 'plant').length} plants</li>
          <li>{project.design.filter((o) => o.kind === 'hardscape').length} hardscape areas</li>
          <li>{project.design.filter((o) => o.kind === 'water').length} water features</li>
          <li>{project.site.propertyPolygon.length >= 3 ? 'Property line set' : 'No property line'}</li>
          <li>{satellite ? 'Satellite ground active' : 'Plain ground (no sat tile)'}</li>
        </ul>
      </aside>
    </div>
  )
}

function FallbackGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial color="#3e5a32" roughness={0.95} />
    </mesh>
  )
}

function SatelliteGround({ url, width, height }: { url: string; width: number; height: number }) {
  const texture = useLoader(TextureLoader, url) as Texture
  // Slightly soften the tile by tweaking aniso; do not repeat.
  texture.wrapS = texture.wrapT = RepeatWrapping
  texture.anisotropy = 8
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[Math.max(40, width), Math.max(40, height)]} />
      <meshStandardMaterial map={texture} roughness={1} />
    </mesh>
  )
}

function PropertyOutline({ polygon }: { polygon: Point[] }) {
  if (polygon.length < 3) return null
  const pts = polygon.map((p) => [p.x, 0.025, p.y] as [number, number, number])
  pts.push(pts[0])
  return <DreiLine points={pts} color="#facc15" lineWidth={2} dashed dashSize={0.8} gapSize={0.5} />
}

function SceneObject({ obj }: { obj: DesignObject }) {
  if (obj.kind === 'plant') return <PlantModel plant={obj} />
  if (obj.kind === 'hardscape') {
    const [cx, cz] = centroid(obj.polygon)
    const { w, d } = bbox(obj.polygon)
    return (
      <mesh position={[cx, 0.02, cz]} receiveShadow>
        <boxGeometry args={[Math.max(w, 0.5), 0.04, Math.max(d, 0.5)]} />
        <meshStandardMaterial color={materialColor(obj.material)} roughness={0.9} />
      </mesh>
    )
  }
  if (obj.kind === 'water') {
    const [cx, cz] = centroid(obj.polygon)
    const { w, d } = bbox(obj.polygon)
    return (
      <mesh position={[cx, 0.04, cz]} receiveShadow>
        <boxGeometry args={[Math.max(w, 0.5), 0.08, Math.max(d, 0.5)]} />
        <meshStandardMaterial color="#3a7aa0" metalness={0.2} roughness={0.15} />
      </mesh>
    )
  }
  return null
}

function centroid(poly: Point[]): [number, number] {
  if (!poly.length) return [0, 0]
  let sx = 0, sy = 0
  for (const p of poly) { sx += p.x; sy += p.y }
  return [sx / poly.length, sy / poly.length]
}

function bbox(poly: Point[]) {
  if (!poly.length) return { w: 1, d: 1 }
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  for (const p of poly) {
    if (p.x < minX) minX = p.x
    if (p.x > maxX) maxX = p.x
    if (p.y < minY) minY = p.y
    if (p.y > maxY) maxY = p.y
  }
  return { w: maxX - minX, d: maxY - minY }
}

function materialColor(m: string): string {
  switch (m) {
    case 'flagstone': return '#a09b8a'
    case 'concrete': return '#c8c8c0'
    case 'pavers': return '#8a7a6a'
    case 'gravel': return '#b0a890'
    case 'turf': return '#5a8a4a'
    case 'mulch': return '#5a3e22'
    case 'deck': return '#7a5a3a'
    default: return '#888'
  }
}
````

---

<a id="src-modules-scene-3d-PlantModel-tsx"></a>
## `src/modules/scene-3d/PlantModel.tsx`

````typescript
import { Suspense, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Color, Group } from 'three'
import type { Plant } from '@shared/types'
import { PLANTS, type PlantSpec } from '../plan-2d/palette'
import { getModelFor } from './models'

// Deterministic small "random" so the same plant always looks the same
// between renders without storing extra fields on the data model.
function seedFromId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  return ((h >>> 0) % 1000) / 1000
}

function tint(hex: string, amt: number): string {
  const c = new Color(hex)
  c.r = Math.max(0, Math.min(1, c.r + amt))
  c.g = Math.max(0, Math.min(1, c.g + amt))
  c.b = Math.max(0, Math.min(1, c.b + amt))
  return `#${c.getHexString()}`
}

export default function PlantModel({ plant }: { plant: Plant }) {
  const spec = PLANTS.find((p) => p.species === plant.species)
  const model = getModelFor(plant.species)
  return (
    <group position={[plant.x, 0, plant.y]}>
      {model ? (
        <Suspense fallback={<Procedural plant={plant} spec={spec} />}>
          <GLBPlant plant={plant} modelUrl={model.url} scale={model.scale} rotationY={model.rotationY} />
        </Suspense>
      ) : (
        <Procedural plant={plant} spec={spec} />
      )}
    </group>
  )
}

function GLBPlant({
  plant, modelUrl, scale = 1, rotationY = 0,
}: {
  plant: Plant
  modelUrl: string
  scale?: number
  rotationY?: number
}) {
  const { scene } = useGLTF(modelUrl) as unknown as { scene: Group }
  // Clone so multiple placements don't share transforms.
  const cloned = useMemo(() => scene.clone(true), [scene])
  // Auto-scale so the GLB roughly matches the species' height in meters.
  const s = (plant.height / 3) * scale
  return <primitive object={cloned} scale={[s, s, s]} rotation={[0, rotationY, 0]} />
}

function Procedural({ plant, spec }: { plant: Plant; spec?: PlantSpec }) {
  const category = spec?.category ?? 'shrub'
  const baseColor = spec?.color ?? '#5a8a4a'
  const seed = seedFromId(plant.id)

  if (category === 'tree') return <Tree plant={plant} color={baseColor} seed={seed} />
  if (category === 'shrub') return <Shrub plant={plant} color={baseColor} seed={seed} />
  if (category === 'grass') return <GrassClump plant={plant} color={baseColor} />
  if (category === 'perennial') return <Perennial plant={plant} color={baseColor} />
  return <GroundCover plant={plant} color={baseColor} />
}

function Tree({ plant, color, seed }: { plant: Plant; color: string; seed: number }) {
  const canopyR = plant.radius
  const trunkH = Math.max(0.6, plant.height * 0.45)
  const swayRef = useRef<Group>(null)
  useFrame(({ clock }) => {
    if (swayRef.current) {
      const t = clock.elapsedTime + seed * 6
      swayRef.current.rotation.x = Math.sin(t * 0.6) * 0.012
      swayRef.current.rotation.z = Math.cos(t * 0.5) * 0.015
    }
  })
  return (
    <group>
      <mesh position={[0, trunkH / 2, 0]} castShadow>
        <cylinderGeometry args={[Math.max(0.06, canopyR * 0.07), Math.max(0.09, canopyR * 0.1), trunkH, 10]} />
        <meshStandardMaterial color="#5a3e22" roughness={0.95} />
      </mesh>
      <group ref={swayRef} position={[0, trunkH, 0]}>
        <mesh position={[0, canopyR * 0.8, 0]} castShadow>
          <sphereGeometry args={[canopyR, 18, 14]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
        <mesh position={[canopyR * 0.35, canopyR * 1.1, canopyR * 0.1]} castShadow>
          <sphereGeometry args={[canopyR * 0.72, 14, 12]} />
          <meshStandardMaterial color={tint(color, 0.05)} roughness={0.9} />
        </mesh>
        <mesh position={[-canopyR * 0.4, canopyR * 0.9, canopyR * 0.25]} castShadow>
          <sphereGeometry args={[canopyR * 0.65, 14, 12]} />
          <meshStandardMaterial color={tint(color, -0.05)} roughness={0.9} />
        </mesh>
        <mesh position={[canopyR * 0.1, canopyR * 0.6, -canopyR * 0.35]} castShadow>
          <sphereGeometry args={[canopyR * 0.55, 12, 10]} />
          <meshStandardMaterial color={tint(color, 0.02)} roughness={0.9} />
        </mesh>
      </group>
    </group>
  )
}

function Shrub({ plant, color, seed }: { plant: Plant; color: string; seed: number }) {
  const r = plant.radius
  const offsets: Array<[number, number, number, number]> = [
    [0, r * 0.6, 0, 1],
    [r * 0.5, r * 0.5, r * 0.1, 0.75],
    [-r * 0.45, r * 0.45, r * 0.2, 0.7],
    [r * 0.1, r * 0.4, -r * 0.5, 0.65],
    [-r * 0.2, r * 0.55, -r * 0.3, 0.6],
  ]
  return (
    <group>
      {offsets.map(([x, y, z, s], i) => (
        <mesh key={i} position={[x + seed * 0.02, y, z]} castShadow>
          <sphereGeometry args={[r * s, 12, 10]} />
          <meshStandardMaterial
            color={i % 2 ? tint(color, 0.04) : tint(color, -0.04)}
            roughness={0.9}
          />
        </mesh>
      ))}
    </group>
  )
}

function GrassClump({ plant, color }: { plant: Plant; color: string }) {
  const r = plant.radius
  const h = Math.max(0.25, plant.height)
  // A small forest of thin tapered cones for blades.
  const blades = useMemo(() => {
    const out: Array<{ x: number; z: number; ry: number; tilt: number; scale: number }> = []
    const n = 14
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2
      const dr = r * (0.2 + Math.random() * 0.7)
      out.push({
        x: Math.cos(a) * dr,
        z: Math.sin(a) * dr,
        ry: Math.random() * Math.PI * 2,
        tilt: (Math.random() - 0.5) * 0.4,
        scale: 0.8 + Math.random() * 0.4,
      })
    }
    return out
  }, [plant.id, r])
  return (
    <group>
      {blades.map((b, i) => (
        <mesh
          key={i}
          position={[b.x, (h * b.scale) / 2, b.z]}
          rotation={[b.tilt, b.ry, 0]}
          castShadow
        >
          <coneGeometry args={[r * 0.06, h * b.scale, 5]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function Perennial({ plant, color }: { plant: Plant; color: string }) {
  const r = plant.radius
  const h = Math.max(0.2, plant.height)
  const flowerColor = tint(color, 0.25)
  return (
    <group>
      <mesh position={[0, h * 0.4, 0]} castShadow>
        <sphereGeometry args={[r, 14, 10]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>
      <mesh position={[0, h * 0.9, 0]} castShadow>
        <sphereGeometry args={[r * 0.6, 12, 8]} />
        <meshStandardMaterial color={flowerColor} roughness={0.7} />
      </mesh>
    </group>
  )
}

function GroundCover({ plant, color }: { plant: Plant; color: string }) {
  const r = plant.radius
  return (
    <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[r, 20]} />
      <meshStandardMaterial color={color} roughness={0.95} />
    </mesh>
  )
}
````

---

<a id="src-modules-scene-3d-models-ts"></a>
## `src/modules/scene-3d/models.ts`

````typescript
// Registry of optional GLB models keyed by species. When a species has an
// entry here, the 3D scene uses the GLB; otherwise it falls back to a
// procedural plant generated from the PlantSpec in src/modules/plan-2d/palette.
//
// To wire up real models:
//   1. Place .glb files under a folder the renderer can read, for example
//      ~/.landscape-studio/models/ (we'll surface a Settings field for this
//      later) or alongside the bundled app.
//   2. Add an entry below pointing at the model URL. file:// URLs are
//      supported in Electron; http(s) URLs are fetched on demand.
//   3. Provide a uniform scale so the model's "1 unit" reads as roughly 1
//      meter, and rotation if the model isn't y-up.
//
// We deliberately ship zero models in the repo to avoid licensing concerns —
// Quaternius (CC0), Sketchfab, and Quixel Megascans are all good sources.

export type PlantModel = {
  url: string
  // multiplied on top of the radius/height-derived auto-scale so designers
  // can dial in proportions without re-exporting the GLB
  scale?: number
  // y-axis rotation in radians, applied so the "front" of the model faces
  // the camera by default
  rotationY?: number
}

export const PLANT_MODELS: Record<string, PlantModel> = {
  // Example (not shipped):
  // 'Quercus agrifolia': { url: 'file:///Users/me/.landscape-studio/models/coast-live-oak.glb', scale: 1.0 },
}

export function getModelFor(species: string): PlantModel | undefined {
  return PLANT_MODELS[species]
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

<a id="-github-workflows-build-yml"></a>
## `.github/workflows/build.yml`

````yaml
name: Build installers

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build:
    name: Build (${{ matrix.os }})
    strategy:
      fail-fast: false
      matrix:
        os: [macos-latest, windows-latest, ubuntu-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build installer
        env:
          # Don't try to code-sign — we ship unsigned for now. Users will see
          # a one-time "unidentified developer" warning on macOS and Windows.
          CSC_IDENTITY_AUTO_DISCOVERY: 'false'
          # electron-builder uses this to publish artifacts, but we attach
          # to a release in a separate job, so disable its built-in publish.
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: npm run dist

      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: installers-${{ matrix.os }}
          if-no-files-found: error
          path: |
            release/*.dmg
            release/*.exe
            release/*.AppImage
            release/*.zip
            release/*.blockmap
            release/latest*.yml

  release:
    name: Publish "Latest build"
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Download all artifacts
        uses: actions/download-artifact@v4
        with:
          path: artifacts

      - name: Flatten artifacts
        run: |
          mkdir -p release
          find artifacts -type f \( -name '*.dmg' -o -name '*.exe' -o -name '*.AppImage' -o -name '*.zip' \) -exec cp -v {} release/ \;
          ls -la release/

      - name: Publish rolling release
        uses: softprops/action-gh-release@v2
        with:
          tag_name: latest
          name: Latest build
          body: |
            Automatically built from the latest commit on `main`.

            - **macOS:** download the `.dmg` (Apple Silicon = `arm64`, Intel = `x64`). The first time you open it, right-click the app → "Open" to bypass the unsigned-developer warning.
            - **Windows:** download the `.exe` and run it. Click "More info" → "Run anyway" past the SmartScreen warning.
            - **Linux:** download the `.AppImage`, `chmod +x` it, and double-click.

            Build commit: ${{ github.sha }}
          prerelease: true
          make_latest: 'true'
          files: release/*
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
