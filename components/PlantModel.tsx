'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, Group } from 'three'
import type { Plant } from '@/lib/types'
import { plantById } from '@/lib/palette'

function seed(id: string) { let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0; return ((h >>> 0) % 1000) / 1000 }
function tint(hex: string, amt: number) { const c = new Color(hex); c.r = Math.min(1, c.r + amt); c.g = Math.min(1, c.g + amt); c.b = Math.min(1, c.b + amt); return `#${c.getHexString()}` }

export default function PlantModel({ plant }: { plant: Plant }) {
  const spec = plantById(plant.plantId)
  const cat = spec?.category ?? 'shrub'
  const color = spec?.color ?? '#5a8a4a'
  const s = seed(plant.id)
  return (
    <group position={[plant.x, 0, plant.y]}>
      {cat === 'tree' && <Tree plant={plant} color={color} s={s} />}
      {cat === 'shrub' && <Shrub plant={plant} color={color} s={s} />}
      {cat === 'grass' && <Grass plant={plant} color={color} />}
      {cat === 'perennial' && <Perennial plant={plant} color={color} />}
      {cat === 'groundcover' && <GroundCover plant={plant} color={color} />}
    </group>
  )
}

function Tree({ plant, color, s }: { plant: Plant; color: string; s: number }) {
  const r = plant.radius
  const trunkH = Math.max(0.6, plant.height * 0.45)
  const sway = useRef<Group>(null)
  useFrame(({ clock }) => { if (sway.current) { const t = clock.elapsedTime + s * 6; sway.current.rotation.x = Math.sin(t * 0.6) * 0.012; sway.current.rotation.z = Math.cos(t * 0.5) * 0.015 } })
  return (
    <group>
      <mesh position={[0, trunkH / 2, 0]} castShadow>
        <cylinderGeometry args={[Math.max(0.06, r * 0.07), Math.max(0.09, r * 0.1), trunkH, 10]} />
        <meshStandardMaterial color="#5a3e22" roughness={0.95} />
      </mesh>
      <group ref={sway} position={[0, trunkH, 0]}>
        <mesh position={[0, r * 0.8, 0]} castShadow><sphereGeometry args={[r, 18, 14]} /><meshStandardMaterial color={color} roughness={0.85} /></mesh>
        <mesh position={[r * 0.35, r * 1.1, r * 0.1]} castShadow><sphereGeometry args={[r * 0.72, 14, 12]} /><meshStandardMaterial color={tint(color, 0.05)} roughness={0.9} /></mesh>
        <mesh position={[-r * 0.4, r * 0.9, r * 0.25]} castShadow><sphereGeometry args={[r * 0.65, 14, 12]} /><meshStandardMaterial color={tint(color, -0.05)} roughness={0.9} /></mesh>
      </group>
    </group>
  )
}

function Shrub({ plant, color, s }: { plant: Plant; color: string; s: number }) {
  const r = plant.radius
  const offs: [number, number, number, number][] = [[0, r * 0.6, 0, 1], [r * 0.5, r * 0.5, r * 0.1, 0.75], [-r * 0.45, r * 0.45, r * 0.2, 0.7], [r * 0.1, r * 0.4, -r * 0.5, 0.65]]
  return <group>{offs.map(([x, y, z, sc], i) => <mesh key={i} position={[x + s * 0.02, y, z]} castShadow><sphereGeometry args={[r * sc, 12, 10]} /><meshStandardMaterial color={i % 2 ? tint(color, 0.04) : tint(color, -0.04)} roughness={0.9} /></mesh>)}</group>
}

function Grass({ plant, color }: { plant: Plant; color: string }) {
  const r = plant.radius, h = Math.max(0.25, plant.height)
  const blades = useMemo(() => Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; const dr = r * (0.2 + Math.random() * 0.6); return { x: Math.cos(a) * dr, z: Math.sin(a) * dr, ry: Math.random() * Math.PI * 2, tilt: (Math.random() - 0.5) * 0.4 } }), [plant.id, r])
  return <group>{blades.map((b, i) => <mesh key={i} position={[b.x, h / 2, b.z]} rotation={[b.tilt, b.ry, 0]} castShadow><coneGeometry args={[r * 0.06, h, 5]} /><meshStandardMaterial color={color} roughness={0.9} /></mesh>)}</group>
}

function Perennial({ plant, color }: { plant: Plant; color: string }) {
  const r = plant.radius, h = Math.max(0.2, plant.height)
  return <group>
    <mesh position={[0, h * 0.4, 0]} castShadow><sphereGeometry args={[r, 14, 10]} /><meshStandardMaterial color={color} roughness={0.95} /></mesh>
    <mesh position={[0, h * 0.9, 0]} castShadow><sphereGeometry args={[r * 0.6, 12, 8]} /><meshStandardMaterial color={tint(color, 0.25)} roughness={0.7} /></mesh>
  </group>
}

function GroundCover({ plant, color }: { plant: Plant; color: string }) {
  return <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[plant.radius, 20]} /><meshStandardMaterial color={color} roughness={0.95} /></mesh>
}
