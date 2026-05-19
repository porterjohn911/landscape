import type {
  Project,
  ProjectSummary,
  Result,
  GenerateRequest,
  GenerateResponse,
  SatelliteRequest,
  SatelliteResponse,
  LatLng,
} from '@shared/types'

type ConfigStatus = {
  defaultControlNet: string
  hasReplicateToken: boolean
  hasMapboxToken: boolean
}

declare global {
  interface Window {
    api: {
      projects: {
        list: () => Promise<Result<ProjectSummary[]>>
        get: (id: string) => Promise<Result<Project>>
        create: (name: string, address?: string) => Promise<Result<Project>>
        save: (project: Project) => Promise<Result<Project>>
        delete: (id: string) => Promise<Result<true>>
      }
      ai: {
        generate: (req: GenerateRequest) => Promise<Result<GenerateResponse>>
        listModels: () => Promise<{ models: Array<{ id: string; label: string }> }>
        hasToken: () => Promise<{ hasToken: boolean }>
      }
      satellite: {
        fetch: (req: SatelliteRequest) => Promise<Result<SatelliteResponse>>
        geocode: (q: string) => Promise<Result<LatLng & { label: string }>>
        hasToken: () => Promise<{ hasToken: boolean }>
      }
      config: {
        get: () => Promise<ConfigStatus>
        set: (patch: Partial<{ replicateToken: string; mapboxToken: string; defaultControlNet: string }>) => Promise<ConfigStatus>
      }
    }
  }
}

export const api = (typeof window !== 'undefined' ? window.api : undefined) as Window['api']

export function unwrap<T>(r: Result<T>): T {
  if (!r.ok) throw new Error(r.error)
  return r.data
}
