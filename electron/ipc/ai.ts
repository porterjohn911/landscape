import type { IpcMain } from 'electron'
import fs from 'node:fs/promises'
import path from 'node:path'
import {
  IPC,
  type GenerateRequest,
  type GenerateResponse,
  type Result,
  type AIPhotoVariant,
} from '../../shared/types.js'
import { assetsDir, getReplicateToken, readConfig } from '../store.js'

// Replicate ControlNet model versions. These are stable, public model
// versions; update as needed. We deliberately pin versions so renders are
// reproducible across users.
const MODEL_VERSIONS: Record<string, string> = {
  canny: 'jagilley/controlnet-canny:aff48af9c68d162388d230a2ab003f68d2638d88307bdaf1c2f1ac95079c9613',
  depth: 'jagilley/controlnet-depth2img:922c7f7b1d72f02cc99ce9aabe687e3f86e890ed27d75c2d49b1de2eb84e7b8a',
  mlsd: 'jagilley/controlnet-hough:854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b',
  seg: 'jagilley/controlnet-seg:f967b165f4cd2e151d11e7450a8214e5d22ad2007f042f2f891ca3981dbfba0d',
  none: 'stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc',
}

function dataUrlToBuffer(dataUrl: string): { buffer: Buffer; mime: string } {
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl)
  if (!match) throw new Error('Invalid data URL')
  return { mime: match[1], buffer: Buffer.from(match[2], 'base64') }
}

async function downloadToFile(url: string, outPath: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download failed: ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await fs.writeFile(outPath, buf)
}

async function mockGenerate(req: GenerateRequest): Promise<GenerateResponse> {
  const dir = assetsDir(req.projectId)
  await fs.mkdir(dir, { recursive: true })
  const sessionId = 's_' + Date.now().toString(36)
  const { buffer } = dataUrlToBuffer(req.sourceImageDataUrl)
  const variants: AIPhotoVariant[] = []
  const count = req.variantCount ?? 4
  for (let i = 0; i < count; i++) {
    const fname = `${sessionId}_${i}.png`
    await fs.writeFile(path.join(dir, fname), buffer)
    variants.push({
      id: `${sessionId}_${i}`,
      localPath: path.join(dir, fname),
      seed: (req.seed ?? 1) + i,
      createdAt: new Date().toISOString(),
    })
  }
  return { sessionId, variants }
}

async function realGenerate(token: string, req: GenerateRequest): Promise<GenerateResponse> {
  const { default: Replicate } = await import('replicate')
  const replicate = new Replicate({ auth: token })
  const versionSpec = MODEL_VERSIONS[req.controlnet] ?? MODEL_VERSIONS.canny

  const { buffer: srcBuf, mime: srcMime } = dataUrlToBuffer(req.sourceImageDataUrl)
  const srcBlob = new Blob([srcBuf], { type: srcMime })
  const input: Record<string, unknown> = {
    image: srcBlob,
    prompt: req.prompt,
    num_outputs: req.variantCount ?? 4,
    num_inference_steps: 30,
  }
  if (req.negativePrompt) input.negative_prompt = req.negativePrompt
  if (req.seed != null) input.seed = req.seed
  if (req.maskImageDataUrl) {
    const { buffer: mBuf, mime: mMime } = dataUrlToBuffer(req.maskImageDataUrl)
    input.mask = new Blob([mBuf], { type: mMime })
  }

  const output = (await replicate.run(versionSpec as `${string}/${string}:${string}`, {
    input,
  })) as unknown

  const urls: string[] = Array.isArray(output)
    ? (output as string[])
    : typeof output === 'string'
      ? [output as string]
      : []

  const dir = assetsDir(req.projectId)
  await fs.mkdir(dir, { recursive: true })
  const sessionId = 's_' + Date.now().toString(36)
  const variants: AIPhotoVariant[] = []
  for (let i = 0; i < urls.length; i++) {
    const local = path.join(dir, `${sessionId}_${i}.png`)
    await downloadToFile(urls[i], local)
    variants.push({
      id: `${sessionId}_${i}`,
      localPath: local,
      seed: (req.seed ?? 0) + i,
      createdAt: new Date().toISOString(),
    })
  }
  return { sessionId, variants }
}

export function registerAIHandlers(ipc: IpcMain) {
  ipc.handle(IPC.ai.hasToken, async () => {
    const cfg = await readConfig()
    return { hasToken: !!getReplicateToken(cfg) }
  })

  ipc.handle(IPC.ai.listModels, async () => {
    return {
      models: Object.keys(MODEL_VERSIONS).map((k) => ({
        id: k,
        label:
          k === 'canny'
            ? 'ControlNet — Canny (preserve edges, restyle materials)'
            : k === 'depth'
              ? 'ControlNet — Depth (replace objects, keep perspective)'
              : k === 'mlsd'
                ? 'ControlNet — MLSD (preserve straight lines / structures)'
                : k === 'seg'
                  ? 'ControlNet — Seg (swap by category, e.g. lawn → patio)'
                  : 'SDXL (concept board, no input photo control)',
      })),
    }
  })

  ipc.handle(IPC.ai.generate, async (_e, req: GenerateRequest): Promise<Result<GenerateResponse>> => {
    try {
      const cfg = await readConfig()
      const token = getReplicateToken(cfg)
      const data = token ? await realGenerate(token, req) : await mockGenerate(req)
      return { ok: true, data }
    } catch (err) {
      return { ok: false, error: (err as Error).message }
    }
  })
}
