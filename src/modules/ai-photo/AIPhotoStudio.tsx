import { useEffect, useMemo, useRef, useState } from 'react'
import { Sparkles, Upload, Brush, Eraser, Loader2, Pin, PinOff, SplitSquareHorizontal } from 'lucide-react'
import { useProject } from '../../lib/store'
import { api, unwrap } from '../../lib/api'
import type { ControlNetKind, AIPhotoSession } from '@shared/types'
import BeforeAfter from './BeforeAfter'

const STYLE_PRESETS: Array<{ label: string; prompt: string }> = [
  { label: 'Modern xeriscape', prompt: 'modern xeriscape backyard with drought-tolerant plants, decomposed granite, board-formed concrete planters, golden hour' },
  { label: 'Tropical resort', prompt: 'tropical resort backyard with palm trees, monstera, lush ferns, infinity pool, teak deck, soft evening light' },
  { label: 'English cottage', prompt: 'english cottage garden with lavender, roses, foxglove, stone path, wrought iron, soft overcast light' },
  { label: 'Japanese zen', prompt: 'japanese zen garden with raked gravel, moss, weathered stone lanterns, japanese maple, koi pond' },
  { label: 'Mediterranean', prompt: 'mediterranean courtyard with olive trees, terracotta pavers, rosemary, citrus, stucco walls, warm afternoon light' },
  { label: 'Desert modern', prompt: 'desert modern landscape with agave, ocotillo, saguaro, rusted steel planters, gravel, dramatic shadows' },
]

export default function AIPhotoStudio() {
  const { project, addPhotoSession } = useProject()
  const [sourceImage, setSourceImage] = useState<string | null>(null)
  const [compare, setCompare] = useState<{ sessionId: string; variantId: string } | null>(null)
  const [prompt, setPrompt] = useState(STYLE_PRESETS[0].prompt)
  const [negative, setNegative] = useState('cluttered, low quality, deformed, blurry, watermark')
  const [controlnet, setControlnet] = useState<ControlNetKind>('canny')
  const [busy, setBusy] = useState(false)
  const [tool, setTool] = useState<'brush' | 'erase'>('brush')
  const [brushSize, setBrushSize] = useState(40)
  const [hasReplicate, setHasReplicate] = useState(false)
  const [models, setModels] = useState<Array<{ id: string; label: string }>>([])

  const fileInput = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const maskCanvas = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const lastPt = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    api.ai.hasToken().then((r) => setHasReplicate(r.hasToken))
    api.ai.listModels().then((r) => setModels(r.models))
  }, [])

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      setSourceImage(reader.result as string)
      // Reset mask
      requestAnimationFrame(() => {
        const c = maskCanvas.current
        if (!c) return
        const ctx = c.getContext('2d')!
        ctx.clearRect(0, 0, c.width, c.height)
      })
    }
    reader.readAsDataURL(f)
  }

  function syncCanvasSize() {
    const img = imgRef.current
    const c = maskCanvas.current
    if (!img || !c) return
    if (c.width !== img.clientWidth || c.height !== img.clientHeight) {
      c.width = img.clientWidth
      c.height = img.clientHeight
    }
  }

  function getPt(e: React.PointerEvent<HTMLCanvasElement>) {
    const r = maskCanvas.current!.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  function paint(p: { x: number; y: number }) {
    const c = maskCanvas.current!
    const ctx = c.getContext('2d')!
    ctx.globalCompositeOperation = tool === 'brush' ? 'source-over' : 'destination-out'
    ctx.fillStyle = 'rgba(90, 138, 74, 0.55)'
    ctx.beginPath()
    ctx.arc(p.x, p.y, brushSize / 2, 0, Math.PI * 2)
    ctx.fill()
    if (lastPt.current) {
      ctx.strokeStyle = ctx.fillStyle
      ctx.lineWidth = brushSize
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(lastPt.current.x, lastPt.current.y)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
    }
    lastPt.current = p
  }

  function exportMaskDataUrl(): string | undefined {
    const c = maskCanvas.current
    if (!c) return undefined
    const ctx = c.getContext('2d')!
    const data = ctx.getImageData(0, 0, c.width, c.height).data
    let anyPixel = false
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 0) { anyPixel = true; break }
    }
    if (!anyPixel) return undefined
    // Re-render as black-and-white mask
    const out = document.createElement('canvas')
    out.width = c.width; out.height = c.height
    const octx = out.getContext('2d')!
    octx.fillStyle = '#000'
    octx.fillRect(0, 0, out.width, out.height)
    const id = ctx.getImageData(0, 0, c.width, c.height)
    const od = octx.getImageData(0, 0, out.width, out.height)
    for (let i = 0; i < id.data.length; i += 4) {
      const a = id.data[i + 3]
      const v = a > 10 ? 255 : 0
      od.data[i] = v; od.data[i + 1] = v; od.data[i + 2] = v; od.data[i + 3] = 255
    }
    octx.putImageData(od, 0, 0)
    return out.toDataURL('image/png')
  }

  async function generate() {
    if (!project || !sourceImage) return
    setBusy(true)
    try {
      const res = unwrap(
        await api.ai.generate({
          projectId: project.id,
          sourceImageDataUrl: sourceImage,
          maskImageDataUrl: exportMaskDataUrl(),
          prompt,
          negativePrompt: negative,
          controlnet,
          variantCount: 4,
        }),
      )
      const session: AIPhotoSession = {
        id: res.sessionId,
        createdAt: new Date().toISOString(),
        sourceImagePath: res.sourceImagePath,
        prompt,
        negativePrompt: negative,
        controlnet,
        variants: res.variants,
      }
      addPhotoSession(session)
    } catch (err) {
      alert((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid grid-cols-[1fr_320px] h-full">
      {/* Canvas pane */}
      <div className="bg-slate-900/30 relative overflow-auto p-6">
        {!sourceImage ? (
          <button
            onClick={() => fileInput.current?.click()}
            className="w-full h-full min-h-[400px] rounded-lg border-2 border-dashed border-slate-700 hover:border-moss-500 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-slate-200"
          >
            <Upload className="w-10 h-10" />
            <div>Click to upload a photo of the client's yard</div>
            <div className="text-xs">JPG or PNG, ideally a single landscape orientation shot</div>
          </button>
        ) : (
          <div className="space-y-6">
            <div className="relative inline-block max-w-full">
              <img
                ref={imgRef}
                src={sourceImage}
                onLoad={syncCanvasSize}
                className="max-w-full rounded-lg border border-slate-800"
                alt="source"
              />
              <canvas
                ref={maskCanvas}
                className="absolute inset-0 cursor-crosshair rounded-lg"
                onPointerDown={(e) => {
                  drawing.current = true
                  lastPt.current = null
                  paint(getPt(e))
                  ;(e.target as HTMLCanvasElement).setPointerCapture(e.pointerId)
                }}
                onPointerMove={(e) => {
                  if (drawing.current) paint(getPt(e))
                }}
                onPointerUp={(e) => {
                  drawing.current = false
                  lastPt.current = null
                  ;(e.target as HTMLCanvasElement).releasePointerCapture(e.pointerId)
                }}
              />
            </div>

            {project && project.photoSessions.length > 0 && (
              <div className="space-y-4">
                {project.photoSessions.map((s) => (
                  <SessionGallery
                    key={s.id}
                    session={s}
                    onCompare={(variantId) => setCompare({ sessionId: s.id, variantId })}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        <input ref={fileInput} type="file" accept="image/*" onChange={onUpload} className="hidden" />
      </div>

      {/* Side panel */}
      <aside className="border-l border-slate-800 bg-slate-900/60 p-4 overflow-y-auto">
        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Source</h3>
        <button
          onClick={() => fileInput.current?.click()}
          className="w-full text-sm px-3 py-2 mb-4 bg-slate-800 hover:bg-slate-700 rounded flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" /> {sourceImage ? 'Replace photo' : 'Upload photo'}
        </button>

        {sourceImage && (
          <>
            <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Mask (paint what to change)</h3>
            <div className="flex gap-1 mb-2">
              <button
                onClick={() => setTool('brush')}
                className={`flex-1 px-2 py-1.5 rounded text-sm flex items-center justify-center gap-1 ${tool === 'brush' ? 'bg-moss-600' : 'bg-slate-800'}`}
              ><Brush className="w-3.5 h-3.5" /> Brush</button>
              <button
                onClick={() => setTool('erase')}
                className={`flex-1 px-2 py-1.5 rounded text-sm flex items-center justify-center gap-1 ${tool === 'erase' ? 'bg-moss-600' : 'bg-slate-800'}`}
              ><Eraser className="w-3.5 h-3.5" /> Erase</button>
            </div>
            <label className="text-xs text-slate-400">Brush size: {brushSize}px</label>
            <input
              type="range" min={4} max={120}
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-full mb-4"
            />
          </>
        )}

        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Style presets</h3>
        <div className="grid grid-cols-2 gap-1 mb-3">
          {STYLE_PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setPrompt(p.prompt)}
              className="text-xs px-2 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-left truncate"
              title={p.prompt}
            >
              {p.label}
            </button>
          ))}
        </div>

        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Prompt</h3>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm mb-3"
        />
        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Negative prompt</h3>
        <textarea
          value={negative}
          onChange={(e) => setNegative(e.target.value)}
          rows={2}
          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm mb-3"
        />

        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Model</h3>
        <select
          value={controlnet}
          onChange={(e) => setControlnet(e.target.value as ControlNetKind)}
          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm mb-4"
        >
          {models.map((m) => (
            <option key={m.id} value={m.id}>{m.label}</option>
          ))}
        </select>

        <button
          onClick={generate}
          disabled={!sourceImage || busy}
          className="w-full px-3 py-2 bg-moss-600 hover:bg-moss-500 disabled:bg-slate-800 disabled:text-slate-500 rounded text-sm font-medium flex items-center justify-center gap-2"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {busy ? 'Generating…' : 'Generate 4 variants'}
        </button>

        {!hasReplicate && (
          <p className="text-xs text-amber-400 mt-3">
            No Replicate token set — generation will return mock variants. Add a token in Settings for real renders.
          </p>
        )}
      </aside>

      {compare && project && <CompareLauncher compare={compare} onClose={() => setCompare(null)} />}
    </div>
  )
}

function CompareLauncher({
  compare, onClose,
}: {
  compare: { sessionId: string; variantId: string }
  onClose: () => void
}) {
  const { project, updatePhotoSession } = useProject()
  const session = useMemo(
    () => project?.photoSessions.find((s) => s.id === compare.sessionId),
    [project, compare.sessionId],
  )
  const variant = session?.variants.find((v) => v.id === compare.variantId)
  if (!session || !variant) return null
  return (
    <BeforeAfter
      beforeUrl={`file://${session.sourceImagePath}`}
      afterUrl={`file://${variant.localPath}`}
      prompt={session.prompt}
      pinned={!!variant.pinned}
      onTogglePin={() => {
        const variants = session.variants.map((v) =>
          v.id === variant.id ? { ...v, pinned: !v.pinned } : v,
        )
        updatePhotoSession(session.id, { variants })
      }}
      onClose={onClose}
    />
  )
}

function SessionGallery({
  session, onCompare,
}: {
  session: AIPhotoSession
  onCompare: (variantId: string) => void
}) {
  const { project, updatePhotoSession } = useProject()
  if (!project) return null

  function togglePin(variantId: string) {
    if (!project) return
    const variants = session.variants.map((v) =>
      v.id === variantId ? { ...v, pinned: !v.pinned } : v,
    )
    updatePhotoSession(session.id, { variants })
  }

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
      <div className="text-xs text-slate-400 mb-2 truncate" title={session.prompt}>
        <span className="text-slate-500 uppercase tracking-wider mr-2">{session.controlnet}</span>
        {session.prompt}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {session.variants.map((v) => (
          <div key={v.id} className="relative group">
            <button
              onClick={() => onCompare(v.id)}
              className="block w-full text-left"
              title="Open before / after comparison"
            >
              <img
                src={`file://${v.localPath}`}
                alt="variant"
                className="w-full aspect-square object-cover rounded border border-slate-800 group-hover:border-moss-500 transition"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded">
                <span className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-moss-600 text-white">
                  <SplitSquareHorizontal className="w-3.5 h-3.5" /> Compare
                </span>
              </div>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); togglePin(v.id) }}
              className={`absolute top-1 right-1 p-1 rounded ${v.pinned ? 'bg-moss-600 text-white' : 'bg-black/60 text-slate-300 opacity-0 group-hover:opacity-100'}`}
              title={v.pinned ? 'Unpin' : 'Pin favorite'}
            >
              {v.pinned ? <Pin className="w-3 h-3" /> : <PinOff className="w-3 h-3" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
