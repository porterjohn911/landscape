import { Suspense, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Color, Group } from 'three'
import type { Plant } from '@shared/types'
import { PLANTS, type PlantSpec } from '../plan-2d/palette'
import { getModelFor } from './models'

// Deterministic small "random" so the same plant always looks the same
// between renders without storing extra fields on the data model.
function seedFromId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  return ((h >>> 0) % 1000) / 1000
}

function tint(hex: string, amt: number): string {
  const c = new Color(hex)
  c.r = Math.max(0, Math.min(1, c.r + amt))
  c.g = Math.max(0, Math.min(1, c.g + amt))
  c.b = Math.max(0, Math.min(1, c.b + amt))
  return `#${c.getHexString()}`
}

export default function PlantModel({ plant }: { plant: Plant }) {
  const spec = PLANTS.find((p) => p.species === plant.species)
  const model = getModelFor(plant.species)
  return (
    <group position={[plant.x, 0, plant.y]}>
      {model ? (
        <Suspense fallback={<Procedural plant={plant} spec={spec} />}>
          <GLBPlant plant={plant} modelUrl={model.url} scale={model.scale} rotationY={model.rotationY} />
        </Suspense>
      ) : (
        <Procedural plant={plant} spec={spec} />
      )}
    </group>
  )
}

function GLBPlant({
  plant, modelUrl, scale = 1, rotationY = 0,
}: {
  plant: Plant
  modelUrl: string
  scale?: number
  rotationY?: number
}) {
  const { scene } = useGLTF(modelUrl) as unknown as { scene: Group }
  // Clone so multiple placements don't share transforms.
  const cloned = useMemo(() => scene.clone(true), [scene])
  // Auto-scale so the GLB roughly matches the species' height in meters.
  const s = (plant.height / 3) * scale
  return <primitive object={cloned} scale={[s, s, s]} rotation={[0, rotationY, 0]} />
}

function Procedural({ plant, spec }: { plant: Plant; spec?: PlantSpec }) {
  const category = spec?.category ?? 'shrub'
  const baseColor = spec?.color ?? '#5a8a4a'
  const seed = seedFromId(plant.id)

  if (category === 'tree') return <Tree plant={plant} color={baseColor} seed={seed} />
  if (category === 'shrub') return <Shrub plant={plant} color={baseColor} seed={seed} />
  if (category === 'grass') return <GrassClump plant={plant} color={baseColor} />
  if (category === 'perennial') return <Perennial plant={plant} color={baseColor} />
  return <GroundCover plant={plant} color={baseColor} />
}

function Tree({ plant, color, seed }: { plant: Plant; color: string; seed: number }) {
  const canopyR = plant.radius
  const trunkH = Math.max(0.6, plant.height * 0.45)
  const swayRef = useRef<Group>(null)
  useFrame(({ clock }) => {
    if (swayRef.current) {
      const t = clock.elapsedTime + seed * 6
      swayRef.current.rotation.x = Math.sin(t * 0.6) * 0.012
      swayRef.current.rotation.z = Math.cos(t * 0.5) * 0.015
    }
  })
  return (
    <group>
      <mesh position={[0, trunkH / 2, 0]} castShadow>
        <cylinderGeometry args={[Math.max(0.06, canopyR * 0.07), Math.max(0.09, canopyR * 0.1), trunkH, 10]} />
        <meshStandardMaterial color="#5a3e22" roughness={0.95} />
      </mesh>
      <group ref={swayRef} position={[0, trunkH, 0]}>
        <mesh position={[0, canopyR * 0.8, 0]} castShadow>
          <sphereGeometry args={[canopyR, 18, 14]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
        <mesh position={[canopyR * 0.35, canopyR * 1.1, canopyR * 0.1]} castShadow>
          <sphereGeometry args={[canopyR * 0.72, 14, 12]} />
          <meshStandardMaterial color={tint(color, 0.05)} roughness={0.9} />
        </mesh>
        <mesh position={[-canopyR * 0.4, canopyR * 0.9, canopyR * 0.25]} castShadow>
          <sphereGeometry args={[canopyR * 0.65, 14, 12]} />
          <meshStandardMaterial color={tint(color, -0.05)} roughness={0.9} />
        </mesh>
        <mesh position={[canopyR * 0.1, canopyR * 0.6, -canopyR * 0.35]} castShadow>
          <sphereGeometry args={[canopyR * 0.55, 12, 10]} />
          <meshStandardMaterial color={tint(color, 0.02)} roughness={0.9} />
        </mesh>
      </group>
    </group>
  )
}

function Shrub({ plant, color, seed }: { plant: Plant; color: string; seed: number }) {
  const r = plant.radius
  const offsets: Array<[number, number, number, number]> = [
    [0, r * 0.6, 0, 1],
    [r * 0.5, r * 0.5, r * 0.1, 0.75],
    [-r * 0.45, r * 0.45, r * 0.2, 0.7],
    [r * 0.1, r * 0.4, -r * 0.5, 0.65],
    [-r * 0.2, r * 0.55, -r * 0.3, 0.6],
  ]
  return (
    <group>
      {offsets.map(([x, y, z, s], i) => (
        <mesh key={i} position={[x + seed * 0.02, y, z]} castShadow>
          <sphereGeometry args={[r * s, 12, 10]} />
          <meshStandardMaterial
            color={i % 2 ? tint(color, 0.04) : tint(color, -0.04)}
            roughness={0.9}
          />
        </mesh>
      ))}
    </group>
  )
}

function GrassClump({ plant, color }: { plant: Plant; color: string }) {
  const r = plant.radius
  const h = Math.max(0.25, plant.height)
  // A small forest of thin tapered cones for blades.
  const blades = useMemo(() => {
    const out: Array<{ x: number; z: number; ry: number; tilt: number; scale: number }> = []
    const n = 14
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2
      const dr = r * (0.2 + Math.random() * 0.7)
      out.push({
        x: Math.cos(a) * dr,
        z: Math.sin(a) * dr,
        ry: Math.random() * Math.PI * 2,
        tilt: (Math.random() - 0.5) * 0.4,
        scale: 0.8 + Math.random() * 0.4,
      })
    }
    return out
  }, [plant.id, r])
  return (
    <group>
      {blades.map((b, i) => (
        <mesh
          key={i}
          position={[b.x, (h * b.scale) / 2, b.z]}
          rotation={[b.tilt, b.ry, 0]}
          castShadow
        >
          <coneGeometry args={[r * 0.06, h * b.scale, 5]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function Perennial({ plant, color }: { plant: Plant; color: string }) {
  const r = plant.radius
  const h = Math.max(0.2, plant.height)
  const flowerColor = tint(color, 0.25)
  return (
    <group>
      <mesh position={[0, h * 0.4, 0]} castShadow>
        <sphereGeometry args={[r, 14, 10]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>
      <mesh position={[0, h * 0.9, 0]} castShadow>
        <sphereGeometry args={[r * 0.6, 12, 8]} />
        <meshStandardMaterial color={flowerColor} roughness={0.7} />
      </mesh>
    </group>
  )
}

function GroundCover({ plant, color }: { plant: Plant; color: string }) {
  const r = plant.radius
  return (
    <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[r, 20]} />
      <meshStandardMaterial color={color} roughness={0.95} />
    </mesh>
  )
}
