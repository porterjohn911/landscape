import { app } from 'electron'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { AppConfig } from '../shared/types.js'

export function userDir() {
  return app.getPath('userData')
}

export function projectsDir() {
  return path.join(userDir(), 'projects')
}

export function assetsDir(projectId: string) {
  return path.join(userDir(), 'assets', projectId)
}

export function tilesDir() {
  return path.join(userDir(), 'tiles')
}

export function configPath() {
  return path.join(userDir(), 'config.json')
}

export async function ensureDirs() {
  await fs.mkdir(projectsDir(), { recursive: true })
  await fs.mkdir(tilesDir(), { recursive: true })
  await fs.mkdir(path.join(userDir(), 'assets'), { recursive: true })
}

const DEFAULT_CONFIG: AppConfig = {
  defaultControlNet: 'canny',
}

export async function readConfig(): Promise<AppConfig> {
  try {
    const raw = await fs.readFile(configPath(), 'utf8')
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_CONFIG }
  }
}

export async function writeConfig(patch: Partial<AppConfig>): Promise<AppConfig> {
  const current = await readConfig()
  const next = { ...current, ...patch }
  await ensureDirs()
  await fs.writeFile(configPath(), JSON.stringify(next, null, 2))
  return next
}

export function getReplicateToken(cfg: AppConfig): string | undefined {
  return cfg.replicateToken || process.env.REPLICATE_API_TOKEN
}

export function getMapboxToken(cfg: AppConfig): string | undefined {
  return cfg.mapboxToken || process.env.MAPBOX_TOKEN
}
