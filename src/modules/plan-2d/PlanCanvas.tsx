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
