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
