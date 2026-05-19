// Starter plant + material library. Real product would load from a JSON file
// with species data (mature size, USDA zones, water needs, sun, etc.) and from
// a designer-editable catalog.

export type PlantSpec = {
  species: string
  commonName: string
  radius: number   // mature canopy radius, meters
  height: number   // meters
  color: string    // canvas fill
  category: 'tree' | 'shrub' | 'grass' | 'groundcover' | 'perennial'
}

export const PLANTS: PlantSpec[] = [
  { species: 'Quercus agrifolia', commonName: 'Coast Live Oak', radius: 6, height: 12, color: '#3e6b2a', category: 'tree' },
  { species: 'Acer palmatum', commonName: 'Japanese Maple', radius: 2.5, height: 4, color: '#a14b2a', category: 'tree' },
  { species: 'Olea europaea', commonName: 'Olive Tree', radius: 3.5, height: 6, color: '#7a8a52', category: 'tree' },
  { species: 'Lagerstroemia indica', commonName: 'Crepe Myrtle', radius: 2, height: 5, color: '#a05a7a', category: 'tree' },
  { species: 'Buxus sempervirens', commonName: 'Boxwood', radius: 0.6, height: 1, color: '#4a7044', category: 'shrub' },
  { species: 'Rosmarinus officinalis', commonName: 'Rosemary', radius: 0.7, height: 0.8, color: '#5a7a5a', category: 'shrub' },
  { species: 'Lavandula angustifolia', commonName: 'English Lavender', radius: 0.5, height: 0.6, color: '#7a6aa0', category: 'perennial' },
  { species: 'Agave americana', commonName: 'Century Plant', radius: 1.2, height: 1.5, color: '#6a8a6a', category: 'shrub' },
  { species: 'Phormium tenax', commonName: 'New Zealand Flax', radius: 1, height: 1.5, color: '#8a5a3a', category: 'grass' },
  { species: 'Festuca glauca', commonName: 'Blue Fescue', radius: 0.3, height: 0.3, color: '#6a8aa0', category: 'grass' },
  { species: 'Sedum spectabile', commonName: 'Stonecrop', radius: 0.4, height: 0.5, color: '#7a8a4a', category: 'groundcover' },
  { species: 'Trachelospermum jasminoides', commonName: 'Star Jasmine', radius: 0.8, height: 0.4, color: '#5a8a6a', category: 'groundcover' },
]

export type MaterialSpec = {
  id: string
  label: string
  fill: string
  pattern?: 'cross' | 'dots'
}

export const HARDSCAPE_MATERIALS: MaterialSpec[] = [
  { id: 'flagstone', label: 'Flagstone', fill: '#a09b8a' },
  { id: 'concrete', label: 'Concrete', fill: '#c8c8c0' },
  { id: 'pavers', label: 'Pavers', fill: '#8a7a6a', pattern: 'cross' },
  { id: 'gravel', label: 'Gravel', fill: '#b0a890', pattern: 'dots' },
  { id: 'turf', label: 'Lawn / Turf', fill: '#5a8a4a' },
  { id: 'mulch', label: 'Mulch', fill: '#5a3e22' },
  { id: 'deck', label: 'Wood deck', fill: '#7a5a3a' },
]
