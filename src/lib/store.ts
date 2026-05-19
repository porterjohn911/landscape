import { create } from 'zustand'
import type { Project, DesignObject, AIPhotoSession } from '@shared/types'
import { api, unwrap } from './api'

type EditorTab = 'photo' | 'plan' | 'scene'

type State = {
  project: Project | null
  tab: EditorTab
  selectedId: string | null
  dirty: boolean
}

type Actions = {
  load: (id: string) => Promise<void>
  setTab: (t: EditorTab) => void
  select: (id: string | null) => void
  upsertObject: (obj: DesignObject) => void
  removeObject: (id: string) => void
  addPhotoSession: (s: AIPhotoSession) => void
  updatePhotoSession: (id: string, patch: Partial<AIPhotoSession>) => void
  rename: (name: string) => void
  setSite: (patch: Partial<Project['site']>) => void
  save: () => Promise<void>
}

export const useProject = create<State & Actions>((set, get) => {
  let saveTimer: ReturnType<typeof setTimeout> | null = null

  const scheduleSave = () => {
    set({ dirty: true })
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      void get().save()
    }, 800)
  }

  return {
    project: null,
    tab: 'plan',
    selectedId: null,
    dirty: false,

    async load(id) {
      const p = unwrap(await api.projects.get(id))
      set({ project: p, dirty: false, selectedId: null })
    },

    setTab(tab) {
      set({ tab })
    },

    select(id) {
      set({ selectedId: id })
    },

    upsertObject(obj) {
      const p = get().project
      if (!p) return
      const idx = p.design.findIndex((o) => o.id === obj.id)
      const design = idx >= 0
        ? p.design.map((o, i) => (i === idx ? obj : o))
        : [...p.design, obj]
      set({ project: { ...p, design } })
      scheduleSave()
    },

    removeObject(id) {
      const p = get().project
      if (!p) return
      set({
        project: { ...p, design: p.design.filter((o) => o.id !== id) },
        selectedId: get().selectedId === id ? null : get().selectedId,
      })
      scheduleSave()
    },

    addPhotoSession(s) {
      const p = get().project
      if (!p) return
      set({ project: { ...p, photoSessions: [s, ...p.photoSessions] } })
      scheduleSave()
    },

    updatePhotoSession(id, patch) {
      const p = get().project
      if (!p) return
      set({
        project: {
          ...p,
          photoSessions: p.photoSessions.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        },
      })
      scheduleSave()
    },

    rename(name) {
      const p = get().project
      if (!p) return
      set({ project: { ...p, name } })
      scheduleSave()
    },

    setSite(patch) {
      const p = get().project
      if (!p) return
      set({ project: { ...p, site: { ...p.site, ...patch } } })
      scheduleSave()
    },

    async save() {
      const p = get().project
      if (!p) return
      await api.projects.save(p)
      set({ dirty: false })
    },
  }
})
