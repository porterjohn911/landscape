import type { IpcMain } from 'electron'
import fs from 'node:fs/promises'
import path from 'node:path'
import { IPC, type Project, type ProjectSummary, type Result } from '../../shared/types.js'
import { ensureDirs, projectsDir, assetsDir } from '../store.js'

function newId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

async function readProject(id: string): Promise<Project | null> {
  try {
    const raw = await fs.readFile(path.join(projectsDir(), `${id}.json`), 'utf8')
    return JSON.parse(raw) as Project
  } catch {
    return null
  }
}

async function writeProject(project: Project) {
  await ensureDirs()
  await fs.mkdir(assetsDir(project.id), { recursive: true })
  await fs.writeFile(
    path.join(projectsDir(), `${project.id}.json`),
    JSON.stringify(project, null, 2),
  )
}

export function registerProjectHandlers(ipc: IpcMain) {
  ipc.handle(IPC.projects.list, async (): Promise<Result<ProjectSummary[]>> => {
    try {
      await ensureDirs()
      const files = await fs.readdir(projectsDir())
      const summaries: ProjectSummary[] = []
      for (const f of files) {
        if (!f.endsWith('.json')) continue
        try {
          const raw = await fs.readFile(path.join(projectsDir(), f), 'utf8')
          const p = JSON.parse(raw) as Project
          summaries.push({
            id: p.id,
            name: p.name,
            updatedAt: p.updatedAt,
            thumbnail: p.thumbnail,
            address: p.site?.address,
          })
        } catch {
          /* skip corrupt */
        }
      }
      summaries.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      return { ok: true, data: summaries }
    } catch (err) {
      return { ok: false, error: (err as Error).message }
    }
  })

  ipc.handle(IPC.projects.get, async (_e, id: string): Promise<Result<Project>> => {
    const p = await readProject(id)
    if (!p) return { ok: false, error: 'Project not found' }
    return { ok: true, data: p }
  })

  ipc.handle(
    IPC.projects.create,
    async (_e, { name, address }: { name: string; address?: string }): Promise<Result<Project>> => {
      const now = new Date().toISOString()
      const project: Project = {
        id: newId(),
        name: name || 'Untitled project',
        createdAt: now,
        updatedAt: now,
        site: {
          address,
          center: { lat: 37.7749, lng: -122.4194 },
          zoom: 19,
          propertyPolygon: [],
          northRotation: 0,
        },
        design: [],
        photoSessions: [],
      }
      await writeProject(project)
      return { ok: true, data: project }
    },
  )

  ipc.handle(IPC.projects.save, async (_e, project: Project): Promise<Result<Project>> => {
    if (!project?.id) return { ok: false, error: 'Missing project id' }
    project.updatedAt = new Date().toISOString()
    await writeProject(project)
    return { ok: true, data: project }
  })

  ipc.handle(IPC.projects.delete, async (_e, id: string): Promise<Result<true>> => {
    try {
      await fs.unlink(path.join(projectsDir(), `${id}.json`))
      await fs.rm(assetsDir(id), { recursive: true, force: true })
      return { ok: true, data: true }
    } catch (err) {
      return { ok: false, error: (err as Error).message }
    }
  })
}
