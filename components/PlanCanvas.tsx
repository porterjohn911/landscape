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
