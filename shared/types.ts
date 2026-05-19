// Shared between Electron main and renderer. No runtime imports of node here.

export type LatLng = { lat: number; lng: number }
export type Point = { x: number; y: number } // meters, relative to site center

export type ControlNetKind = 'canny' | 'depth' | 'mlsd' | 'seg' | 'none'

export type Plant = {
  kind: 'plant'
  id: string
  species: string // common name
  x: number
  y: number
  radius: number // mature canopy radius, meters
  height: number // meters
}

export type Hardscape = {
  kind: 'hardscape'
  id: string
  material: 'flagstone' | 'concrete' | 'pavers' | 'gravel' | 'turf' | 'mulch' | 'deck'
  polygon: Point[]
}

export type Water = {
  kind: 'water'
  id: string
  shape: 'pool' | 'spa' | 'pond'
  polygon: Point[]
  depth: number // meters
}

export type Structure = {
  kind: 'structure'
  id: string
  type: 'pergola' | 'fence' | 'wall' | 'firepit' | 'shed'
  polygon: Point[]
  height: number
}

export type Light = {
  kind: 'light'
  id: string
  fixture: 'path' | 'spot' | 'wash' | 'string'
  x: number
  y: number
  lumens: number
}

export type DesignObject = Plant | Hardscape | Water | Structure | Light

export type Site = {
  address?: string
  center: LatLng
  zoom: number
  propertyPolygon: LatLng[]
  northRotation: number
}

export type AIPhotoVariant = {
  id: string
  localPath: string // file path relative to project assets dir
  seed: number
  createdAt: string
  pinned?: boolean
}

export type AIPhotoSession = {
  id: string
  createdAt: string
  sourceImagePath: string
  maskImagePath?: string
  prompt: string
  negativePrompt?: string
  controlnet: ControlNetKind
  variants: AIPhotoVariant[]
}

export type Project = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  site: Site
  design: DesignObject[]
  photoSessions: AIPhotoSession[]
  thumbnail?: string
}

export type ProjectSummary = Pick<Project, 'id' | 'name' | 'updatedAt' | 'thumbnail'> & {
  address?: string
}

export type Result<T> = { ok: true; data: T } | { ok: false; error: string }

// IPC channel names — keep in sync with electron/ipc/* and src/lib/ipc.ts
export const IPC = {
  projects: {
    list: 'projects:list',
    get: 'projects:get',
    create: 'projects:create',
    save: 'projects:save',
    delete: 'projects:delete',
  },
  ai: {
    generate: 'ai:generate',
    listModels: 'ai:listModels',
    hasToken: 'ai:hasToken',
  },
  satellite: {
    fetch: 'satellite:fetch',
    geocode: 'satellite:geocode',
    hasToken: 'satellite:hasToken',
  },
  config: {
    get: 'config:get',
    set: 'config:set',
  },
} as const

export type GenerateRequest = {
  projectId: string
  sourceImageDataUrl: string
  maskImageDataUrl?: string
  prompt: string
  negativePrompt?: string
  controlnet: ControlNetKind
  variantCount?: number
  seed?: number
}

export type GenerateResponse = {
  sessionId: string
  variants: AIPhotoVariant[]
}

export type SatelliteRequest = {
  center: LatLng
  zoom: number
  width: number
  height: number
}

export type SatelliteResponse = {
  localPath: string
  bboxMeters: { width: number; height: number }
}

export type AppConfig = {
  replicateToken?: string
  mapboxToken?: string
  defaultControlNet: ControlNetKind
}
