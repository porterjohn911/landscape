export type LatLng = { lat: number; lng: number }
export type Point = { x: number; y: number } // meters relative to site center

export type Plant = {
  kind: 'plant'
  id: string
  plantId: string
  x: number
  y: number
  radius: number
  height: number
}

export type Hardscape = {
  kind: 'hardscape'
  id: string
  material: string
  color: string
  polygon: Point[]
}

export type Water = {
  kind: 'water'
  id: string
  polygon: Point[]
}

export type DesignObject = Plant | Hardscape | Water

export type Site = {
  address?: string
  center: LatLng
  zoom: number
  propertyPolygon: Point[]
  housePolygon: Point[]
  scaleCalibration: number
}

export type AIVariant = {
  id: string
  url: string
  seed: number
  pinned?: boolean
}

export type AISession = {
  id: string
  createdAt: string
  sourceUrl: string
  prompt: string
  controlnet: string
  variants: AIVariant[]
}

export type Project = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  site: Site
  design: DesignObject[]
  aiSessions: AISession[]
}

export function newProject(name: string, address?: string): Project {
  const now = new Date().toISOString()
  return {
    id: Math.random().toString(36).slice(2, 10),
    name: name || 'Untitled project',
    createdAt: now,
    updatedAt: now,
    site: {
      address,
      center: { lat: 37.7749, lng: -122.4194 },
      zoom: 20,
      propertyPolygon: [],
      housePolygon: [],
      scaleCalibration: 1,
    },
    design: [],
    aiSessions: [],
  }
}
