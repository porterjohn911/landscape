// Registry of optional GLB models keyed by species. When a species has an
// entry here, the 3D scene uses the GLB; otherwise it falls back to a
// procedural plant generated from the PlantSpec in src/modules/plan-2d/palette.
//
// To wire up real models:
//   1. Place .glb files under a folder the renderer can read, for example
//      ~/.landscape-studio/models/ (we'll surface a Settings field for this
//      later) or alongside the bundled app.
//   2. Add an entry below pointing at the model URL. file:// URLs are
//      supported in Electron; http(s) URLs are fetched on demand.
//   3. Provide a uniform scale so the model's "1 unit" reads as roughly 1
//      meter, and rotation if the model isn't y-up.
//
// We deliberately ship zero models in the repo to avoid licensing concerns —
// Quaternius (CC0), Sketchfab, and Quixel Megascans are all good sources.

export type PlantModel = {
  url: string
  // multiplied on top of the radius/height-derived auto-scale so designers
  // can dial in proportions without re-exporting the GLB
  scale?: number
  // y-axis rotation in radians, applied so the "front" of the model faces
  // the camera by default
  rotationY?: number
}

export const PLANT_MODELS: Record<string, PlantModel> = {
  // Example (not shipped):
  // 'Quercus agrifolia': { url: 'file:///Users/me/.landscape-studio/models/coast-live-oak.glb', scale: 1.0 },
}

export function getModelFor(species: string): PlantModel | undefined {
  return PLANT_MODELS[species]
}
