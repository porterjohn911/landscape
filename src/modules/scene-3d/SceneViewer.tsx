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
