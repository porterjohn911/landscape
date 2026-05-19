import { useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Layer, Image as KImage, Circle, Line, Group, Text, Rect } from 'react-konva'
import { nanoid } from 'nanoid'
import { Trash2, MousePointer2, Trees, Square, Waves, Search } from 'lucide-react'
import type Konva from 'konva'
import { useProject } from '../../lib/store'
import { api, unwrap } from '../../lib/api'
import { PLANTS, HARDSCAPE_MATERIALS, type PlantSpec } from './palette'
import type { Plant, Hardscape, Water, DesignObject } from '@shared/types'

type Tool = 'select' | 'plant' | 'hardscape' | 'water'

export default function PlanCanvas() {
  const { project, upsertObject, removeObject, selectedId, select, setSite } = useProject()
  const [tool, setTool] = useState<Tool>('select')
  const [activePlant, setActivePlant] = useState<PlantSpec>(PLANTS[0])
  const [activeMaterial, setActiveMaterial] = useState(HARDSCAPE_MATERIALS[0])
  const [polygonPts, setPolygonPts] = useState<number[]>([])
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

  // Load satellite tile whenever site changes.
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

  // Meters→pixels for placing objects on the stage.
  const pxPerMeter = useMemo(() => {
    if (!satBboxMeters || !satellite) return 30 // sensible default if no sat
    return Math.min(size.w / satBboxMeters.width, size.h / satBboxMeters.height)
  }, [satBboxMeters, satellite, size])

  const originX = size.w / 2
  const originY = size.h / 2

  function metersToPx(p: { x: number; y: number }) {
    return { x: originX + p.x * pxPerMeter, y: originY + p.y * pxPerMeter }
  }
  function pxToMeters(p: { x: number; y: number }) {
    return { x: (p.x - originX) / pxPerMeter, y: (p.y - originY) / pxPerMeter }
  }

  function onStageClick(e: Konva.KonvaEventObject<MouseEvent>) {
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
    if (tool === 'hardscape' || tool === 'water') {
      setPolygonPts((prev) => [...prev, pos.x, pos.y])
    }
  }

  function commitPolygon() {
    if (!project || polygonPts.length < 6) {
      setPolygonPts([])
      return
    }
    const pts: { x: number; y: number }[] = []
    for (let i = 0; i < polygonPts.length; i += 2) {
      pts.push(pxToMeters({ x: polygonPts[i], y: polygonPts[i + 1] }))
    }
    if (tool === 'hardscape') {
      const obj: Hardscape = {
        kind: 'hardscape',
        id: nanoid(8),
        material: activeMaterial.id as Hardscape['material'],
        polygon: pts,
      }
      upsertObject(obj)
    } else if (tool === 'water') {
      const obj: Water = {
        kind: 'water',
        id: nanoid(8),
        shape: 'pool',
        polygon: pts,
        depth: 1.5,
      }
      upsertObject(obj)
    }
    setPolygonPts([])
  }

  async function geocode() {
    if (!addressQuery) return
    try {
      const r = unwrap(await api.satellite.geocode(addressQuery))
      setSite({
        address: r.label,
        center: { lat: r.lat, lng: r.lng },
      })
    } catch (e) {
      alert((e as Error).message)
    }
  }

  if (!project) return null

  return (
    <div className="grid grid-cols-[260px_1fr_280px] h-full">
      {/* Left tool palette */}
      <aside className="border-r border-slate-800 bg-slate-900/60 p-3 overflow-y-auto">
        <div className="flex gap-1 mb-4">
          <ToolBtn icon={<MousePointer2 className="w-4 h-4" />} active={tool === 'select'} onClick={() => setTool('select')} label="Select" />
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
        {polygonPts.length > 0 && (
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
        <Stage width={size.w} height={size.h} onMouseDown={onStageClick}>
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
            {/* Scale bar */}
            {pxPerMeter > 0 && (
              <Group x={20} y={size.h - 30}>
                <Rect width={pxPerMeter * 5} height={4} fill="#fff" />
                <Text text="5 m" y={-16} fill="#fff" fontSize={11} />
              </Group>
            )}
          </Layer>

          <Layer>
            {project.design.map((o) => renderObject(o, metersToPx, pxPerMeter, selectedId === o.id, () => select(o.id), HARDSCAPE_MATERIALS))}
            {polygonPts.length > 0 && (
              <Line
                points={polygonPts}
                stroke="#5a8a4a"
                strokeWidth={2}
                dash={[4, 4]}
                closed={false}
              />
            )}
          </Layer>
        </Stage>
      </div>

      {/* Right inspector / schedule */}
      <aside className="border-l border-slate-800 bg-slate-900/60 p-3 overflow-y-auto">
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
      className={`flex-1 px-2 py-1.5 rounded flex items-center justify-center gap-1 text-xs ${active ? 'bg-moss-600' : 'bg-slate-800 hover:bg-slate-700'}`}
    >
      {icon}
    </button>
  )
}

function renderObject(
  o: DesignObject,
  m2p: (p: { x: number; y: number }) => { x: number; y: number },
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
