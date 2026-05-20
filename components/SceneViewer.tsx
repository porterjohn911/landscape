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
