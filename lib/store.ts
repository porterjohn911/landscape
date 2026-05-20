'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Project, DesignObject, AISession, Site } from './types'
import { newProject } from './types'

type State = {
  projects: Record<string, Project>
}

type Actions = {
  create: (name: string, address?: string) => Project
  remove: (id: string) => void
  get: (id: string) => Project | undefined
  rename: (id: string, name: string) => void
  setSite: (id: string, patch: Partial<Site>) => void
  upsertObject: (id: string, obj: DesignObject) => void
  removeObject: (id: string, objId: string) => void
  clearDesign: (id: string) => void
  addSession: (id: string, s: AISession) => void
  updateSession: (id: string, sessionId: string, patch: Partial<AISession>) => void
}

export const useStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      projects: {},

      create(name, address) {
        const p = newProject(name, address)
        set((s) => ({ projects: { ...s.projects, [p.id]: p } }))
        return p
      },

      remove(id) {
        set((s) => {
          const next = { ...s.projects }
          delete next[id]
          return { projects: next }
        })
      },

      get(id) {
        return get().projects[id]
      },

      rename(id, name) {
        patch(set, id, (p) => ({ ...p, name }))
      },

      setSite(id, sitePatch) {
        patch(set, id, (p) => ({ ...p, site: { ...p.site, ...sitePatch } }))
      },

      upsertObject(id, obj) {
        patch(set, id, (p) => {
          const idx = p.design.findIndex((o) => o.id === obj.id)
          const design = idx >= 0 ? p.design.map((o, i) => (i === idx ? obj : o)) : [...p.design, obj]
          return { ...p, design }
        })
      },

      removeObject(id, objId) {
        patch(set, id, (p) => ({ ...p, design: p.design.filter((o) => o.id !== objId) }))
      },

      clearDesign(id) {
        patch(set, id, (p) => ({ ...p, design: [] }))
      },

      addSession(id, s) {
        patch(set, id, (p) => ({ ...p, aiSessions: [s, ...p.aiSessions] }))
      },

      updateSession(id, sessionId, sPatch) {
        patch(set, id, (p) => ({
          ...p,
          aiSessions: p.aiSessions.map((s) => (s.id === sessionId ? { ...s, ...sPatch } : s)),
        }))
      },
    }),
    { name: 'landscape-studio-v2' },
  ),
)

function patch(
  set: (fn: (s: State) => Partial<State>) => void,
  id: string,
  fn: (p: Project) => Project,
) {
  set((s) => {
    const p = s.projects[id]
    if (!p) return {}
    const updated = { ...fn(p), updatedAt: new Date().toISOString() }
    return { projects: { ...s.projects, [id]: updated } }
  })
}
