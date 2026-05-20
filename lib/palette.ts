export type PlantSpec = {
  id: string
  name: string
  radius: number
  height: number
  color: string
  category: 'tree' | 'shrub' | 'grass' | 'perennial' | 'groundcover'
}

export const PLANTS: PlantSpec[] = [
  { id: 'oak',      name: 'Coast Live Oak', radius: 6,   height: 12,  color: '#3e6b2a', category: 'tree' },
  { id: 'maple',    name: 'Japanese Maple', radius: 2.5, height: 4,   color: '#a14b2a', category: 'tree' },
  { id: 'olive',    name: 'Olive Tree',     radius: 3.5, height: 6,   color: '#7a8a52', category: 'tree' },
  { id: 'myrtle',   name: 'Crepe Myrtle',   radius: 2,   height: 5,   color: '#a05a7a', category: 'tree' },
  { id: 'box',      name: 'Boxwood',        radius: 0.6, height: 1,   color: '#4a7044', category: 'shrub' },
  { id: 'rosemary', name: 'Rosemary',       radius: 0.7, height: 0.8, color: '#5a7a5a', category: 'shrub' },
  { id: 'lavender', name: 'Lavender',       radius: 0.5, height: 0.6, color: '#7a6aa0', category: 'perennial' },
  { id: 'agave',    name: 'Century Plant',  radius: 1.2, height: 1.5, color: '#6a8a6a', category: 'shrub' },
  { id: 'fescue',   name: 'Blue Fescue',    radius: 0.3, height: 0.3, color: '#6a8aa0', category: 'grass' },
  { id: 'sedum',    name: 'Stonecrop',      radius: 0.4, height: 0.5, color: '#7a8a4a', category: 'groundcover' },
]

export const plantById = (id: string) => PLANTS.find((p) => p.id === id)

export type MaterialSpec = { id: string; name: string; color: string }

export const MATERIALS: MaterialSpec[] = [
  { id: 'flagstone', name: 'Flagstone', color: '#a09b8a' },
  { id: 'concrete',  name: 'Concrete',  color: '#c8c8c0' },
  { id: 'pavers',    name: 'Pavers',    color: '#8a7a6a' },
  { id: 'gravel',    name: 'Gravel',    color: '#b0a890' },
  { id: 'turf',      name: 'Turf',      color: '#5a8a4a' },
  { id: 'mulch',     name: 'Mulch',     color: '#5a3e22' },
  { id: 'deck',      name: 'Wood deck', color: '#7a5a3a' },
]

export const STYLE_PRESETS = [
  { label: 'Modern xeriscape', prompt: 'modern xeriscape, drought-tolerant plants, decomposed granite, board-formed concrete planters, golden hour' },
  { label: 'Tropical resort',  prompt: 'tropical resort backyard, palm trees, monstera, lush ferns, teak deck, soft evening light' },
  { label: 'English cottage',  prompt: 'english cottage garden, lavender, roses, foxglove, stone path, soft overcast light' },
  { label: 'Japanese zen',     prompt: 'japanese zen garden, raked gravel, moss, stone lanterns, japanese maple, koi pond' },
  { label: 'Mediterranean',    prompt: 'mediterranean courtyard, olive trees, terracotta pavers, rosemary, citrus, stucco walls' },
  { label: 'Desert modern',    prompt: 'desert modern landscape, agave, ocotillo, saguaro, rusted steel planters, gravel, dramatic shadows' },
]
