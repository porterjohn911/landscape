import type { IpcMain } from 'electron'
import { IPC, type AppConfig } from '../../shared/types.js'
import { readConfig, writeConfig } from '../store.js'

export function registerConfigHandlers(ipc: IpcMain) {
  ipc.handle(IPC.config.get, async () => {
    const cfg = await readConfig()
    // Don't ship raw tokens to renderer; only signal presence.
    return {
      defaultControlNet: cfg.defaultControlNet,
      hasReplicateToken: !!(cfg.replicateToken || process.env.REPLICATE_API_TOKEN),
      hasMapboxToken: !!(cfg.mapboxToken || process.env.MAPBOX_TOKEN),
    }
  })

  ipc.handle(IPC.config.set, async (_e, patch: Partial<AppConfig>) => {
    const next = await writeConfig(patch)
    return {
      defaultControlNet: next.defaultControlNet,
      hasReplicateToken: !!(next.replicateToken || process.env.REPLICATE_API_TOKEN),
      hasMapboxToken: !!(next.mapboxToken || process.env.MAPBOX_TOKEN),
    }
  })
}
