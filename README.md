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
