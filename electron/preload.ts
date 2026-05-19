import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from '../shared/types.js'

const invoke = (channel: string, ...args: unknown[]) => ipcRenderer.invoke(channel, ...args)

contextBridge.exposeInMainWorld('api', {
  projects: {
    list: () => invoke(IPC.projects.list),
    get: (id: string) => invoke(IPC.projects.get, id),
    create: (name: string, address?: string) => invoke(IPC.projects.create, { name, address }),
    save: (project: unknown) => invoke(IPC.projects.save, project),
    delete: (id: string) => invoke(IPC.projects.delete, id),
  },
  ai: {
    generate: (req: unknown) => invoke(IPC.ai.generate, req),
    listModels: () => invoke(IPC.ai.listModels),
    hasToken: () => invoke(IPC.ai.hasToken),
  },
  satellite: {
    fetch: (req: unknown) => invoke(IPC.satellite.fetch, req),
    geocode: (q: string) => invoke(IPC.satellite.geocode, q),
    hasToken: () => invoke(IPC.satellite.hasToken),
  },
  config: {
    get: () => invoke(IPC.config.get),
    set: (patch: unknown) => invoke(IPC.config.set, patch),
  },
})
