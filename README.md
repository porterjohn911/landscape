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
