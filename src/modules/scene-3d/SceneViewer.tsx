import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, Sky, Environment, Grid } from '@react-three/drei'
import { TextureLoader, RepeatWrapping } from 'three'
import { Suspense, useMemo, useState } from 'react'
import { Sun } from 'lucide-react'
import { useProject } from '../../lib/store'
import { PLANTS } from '../plan-2d/palette'
import type { DesignObject } from '@shared/types'

export default function SceneViewer() {
  const { project } = useProject()
  const [timeOfDay, setTimeOfDay] = useState(13) // 24h
  const [sunAzimuth, setSunAzimuth] = useState(160) // degrees

  const sunPosition = useMemo(() => {
    // Sun elevation approximated from hour-of-day; -1..1 then scale to height.
    const t = (timeOfDay - 6) / 12 // 6am→0, 6pm→1
    const elev = Math.sin(t * Math.PI) // 0..1..0
    const az = (sunAzimuth * Math.PI) / 180
    const dist = 100
    const y = Math.max(2, elev * 80)
    const x = Math.sin(az) * dist
    const z = Math.cos(az) * dist
    return [x, y, z] as [number, number, number]
  }, [timeOfDay, sunAzimuth])

  if (!project) return null

  return (
    <div className="grid grid-cols-[1fr_260px] h-full">
      <div className="bg-slate-950 relative">
        <Canvas camera={{ position: [25, 18, 25], fov: 50 }} shadows>
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
            <Ground />
            <Grid args={[80, 80]} cellColor="#2a3a2a" sectionColor="#3a5a3a" fadeDistance={60} infiniteGrid position={[0, 0.01, 0]} />
            {project.design.map((o) => (
              <SceneObject key={o.id} obj={o} />
            ))}
            <Environment preset="park" background={false} />
            <OrbitControls enableDamping target={[0, 1, 0]} maxPolarAngle={Math.PI / 2.1} />
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
        <p className="text-xs text-slate-400">Drag to orbit · Scroll to zoom · Right-drag to pan</p>

        <h3 className="text-xs uppercase tracking-wider text-slate-500 mt-6 mb-2">Status</h3>
        <ul className="text-xs text-slate-400 space-y-0.5">
          <li>{project.design.filter((o) => o.kind === 'plant').length} plants</li>
          <li>{project.design.filter((o) => o.kind === 'hardscape').length} hardscape areas</li>
          <li>{project.design.filter((o) => o.kind === 'water').length} water features</li>
        </ul>
      </aside>
    </div>
  )
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial color="#3e5a32" roughness={0.95} />
    </mesh>
  )
}

function SceneObject({ obj }: { obj: DesignObject }) {
  if (obj.kind === 'plant') {
    const spec = PLANTS.find((p) => p.species === obj.species)
    const color = spec?.color ?? '#5a8a4a'
    const trunkH = Math.max(0.3, obj.height * 0.35)
    const canopyR = obj.radius
    return (
      <group position={[obj.x, 0, obj.y]} castShadow>
        <mesh position={[0, trunkH / 2, 0]} castShadow>
          <cylinderGeometry args={[Math.max(0.05, canopyR * 0.08), Math.max(0.08, canopyR * 0.1), trunkH, 8]} />
          <meshStandardMaterial color="#5a3e22" />
        </mesh>
        <mesh position={[0, trunkH + canopyR * 0.8, 0]} castShadow>
          <sphereGeometry args={[Math.max(0.3, canopyR), 16, 12]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
      </group>
    )
  }
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

function centroid(poly: { x: number; y: number }[]): [number, number] {
  if (!poly.length) return [0, 0]
  let sx = 0, sy = 0
  for (const p of poly) { sx += p.x; sy += p.y }
  return [sx / poly.length, sy / poly.length]
}

function bbox(poly: { x: number; y: number }[]) {
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

// Keep unused imports referenced to satisfy strict TS in CI runs that aren't full electron builds.
void useLoader; void TextureLoader; void RepeatWrapping
