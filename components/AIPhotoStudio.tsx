'use client'

import { useEffect, useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import { Sparkles, Upload, Brush, Eraser, Loader2, MapPin, SplitSquareHorizontal } from 'lucide-react'
import { useStore } from '@/lib/store'
import { STYLE_PRESETS } from '@/lib/palette'
import { generateAI, streetViewDataUrl, getConfig } from '@/lib/apiClient'
import type { AISession } from '@/lib/types'
import BeforeAfter from './BeforeAfter'

export default function AIPhotoStudio({ projectId }: { projectId: string }) {
  const project = useStore((s) => s.projects[projectId])
  const addSession = useStore((s) => s.addSession)
  const updateSession = useStore((s) => s.updateSession)

  const [source, setSource] = useState<string | null>(null)
  const [prompt, setPrompt] = useState(STYLE_PRESETS[0].prompt)
  const [negative, setNegative] = useState('cluttered, low quality, deformed, blurry, watermark')
  const [controlnet, setControlnet] = useState('canny')
  const [busy, setBusy] = useState(false)
  const [svBusy, setSvBusy] = useState(false)
  const [tool, setTool] = useState<'brush' | 'erase'>('brush')
  const [brush, setBrush] = useState(40)
  const [compare, setCompare] = useState<{ sId: string; vId: string } | null>(null)
  const [cfg, setCfg] = useState<{ hasGoogle: boolean; hasReplicate: boolean }>({ hasGoogle: false, hasReplicate: false })

  const fileRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const maskRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)

  useEffect(() => { getConfig().then(setCfg) }, [])

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const fr = new FileReader()
    fr.onload = () => setSource(fr.result as string)
    fr.readAsDataURL(f)
  }

  async function pullStreetView() {
    if (!project) return
    setSvBusy(true)
    try {
      const url = await streetViewDataUrl(project.site.center.lat, project.site.center.lng)
      setSource(url)
    } catch (e) { alert((e as Error).message) } finally { setSvBusy(false) }
  }

  function syncCanvas() {
    const img = imgRef.current, c = maskRef.current
    if (!img || !c) return
    if (c.width !== img.clientWidth || c.height !== img.clientHeight) { c.width = img.clientWidth; c.height = img.clientHeight }
  }
  function paint(e: React.PointerEvent) {
    const c = maskRef.current!, r = c.getBoundingClientRect()
    const p = { x: e.clientX - r.left, y: e.clientY - r.top }
    const g = c.getContext('2d')!
    g.globalCompositeOperation = tool === 'brush' ? 'source-over' : 'destination-out'
    g.fillStyle = 'rgba(90,138,74,0.55)'
    g.beginPath(); g.arc(p.x, p.y, brush / 2, 0, Math.PI * 2); g.fill()
  }
  function exportMask(): string | undefined {
    const c = maskRef.current
    if (!c) return undefined
    const g = c.getContext('2d')!
    const data = g.getImageData(0, 0, c.width, c.height).data
    let any = false
    for (let i = 3; i < data.length; i += 4) if (data[i] > 10) { any = true; break }
    if (!any) return undefined
    const out = document.createElement('canvas'); out.width = c.width; out.height = c.height
    const o = out.getContext('2d')!; o.fillStyle = '#000'; o.fillRect(0, 0, out.width, out.height)
    const id = g.getImageData(0, 0, c.width, c.height), od = o.getImageData(0, 0, out.width, out.height)
    for (let i = 0; i < id.data.length; i += 4) { const v = id.data[i + 3] > 10 ? 255 : 0; od.data[i] = od.data[i + 1] = od.data[i + 2] = v; od.data[i + 3] = 255 }
    o.putImageData(od, 0, 0)
    return out.toDataURL('image/png')
  }

  async function generate() {
    if (!source || !project) return
    setBusy(true)
    try {
      const res = await generateAI({ sourceImageDataUrl: source, maskImageDataUrl: exportMask(), prompt, negativePrompt: negative, controlnet, variantCount: 4 })
      const session: AISession = {
        id: nanoid(8), createdAt: new Date().toISOString(), sourceUrl: source, prompt, controlnet,
        variants: res.variants.map((v) => ({ id: nanoid(8), url: v.url, seed: v.seed })),
      }
      addSession(projectId, session)
    } catch (e) { alert((e as Error).message) } finally { setBusy(false) }
  }

  function togglePin(sId: string, vId: string) {
    const s = project!.aiSessions.find((x) => x.id === sId)
    if (!s) return
    updateSession(projectId, sId, { variants: s.variants.map((v) => (v.id === vId ? { ...v, pinned: !v.pinned } : v)) })
  }

  if (!project) return null
  const session = compare ? project.aiSessions.find((s) => s.id === compare.sId) : null
  const variant = session?.variants.find((v) => v.id === compare?.vId)

  return (
    <div className="grid grid-cols-[1fr_320px] h-full">
      <div className="bg-slate-900/30 relative overflow-auto p-6">
        {!source ? (
          <div className="w-full h-full min-h-[400px] rounded-lg border-2 border-dashed border-slate-700 flex flex-col items-center justify-center gap-4 text-slate-400">
            <Upload className="w-10 h-10" />
            <div>Upload a yard photo, or pull the front of the house from Street View</div>
            <div className="flex gap-2">
              <button onClick={() => fileRef.current?.click()} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-sm">Upload photo</button>
              <button onClick={pullStreetView} disabled={svBusy} className="px-3 py-1.5 bg-moss-600 hover:bg-moss-500 rounded text-sm flex items-center gap-1">
                {svBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />} Street View
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative inline-block max-w-full">
              <img ref={imgRef} src={source} onLoad={syncCanvas} className="max-w-full rounded-lg border border-slate-800" alt="source" />
              <canvas ref={maskRef} className="absolute inset-0 cursor-crosshair rounded-lg"
                onPointerDown={(e) => { drawing.current = true; (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId); paint(e) }}
                onPointerMove={(e) => { if (drawing.current) paint(e) }}
                onPointerUp={(e) => { drawing.current = false; (e.target as HTMLCanvasElement).releasePointerCapture(e.pointerId) }} />
            </div>
            {project.aiSessions.map((s) => (
              <div key={s.id} className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                <div className="text-xs text-slate-400 mb-2 truncate"><span className="uppercase tracking-wider text-slate-500 mr-2">{s.controlnet}</span>{s.prompt}</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {s.variants.map((v) => (
                    <div key={v.id} className="relative group">
                      <button onClick={() => setCompare({ sId: s.id, vId: v.id })} className="block w-full">
                        <img src={v.url} alt="variant" className="w-full aspect-square object-cover rounded border border-slate-800 group-hover:border-moss-500 transition" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition grid place-items-center rounded">
                          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-moss-600"><SplitSquareHorizontal className="w-3.5 h-3.5" /> Compare</span>
                        </div>
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); togglePin(s.id, v.id) }}
                        className={`absolute top-1 right-1 p-1 rounded text-xs ${v.pinned ? 'bg-moss-600' : 'bg-black/60 opacity-0 group-hover:opacity-100'}`}>{v.pinned ? '★' : '☆'}</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
      </div>

      <aside className="border-l border-slate-800 bg-slate-900/60 p-4 overflow-y-auto">
        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Source</h3>
        <div className="grid grid-cols-2 gap-1 mb-4">
          <button onClick={() => fileRef.current?.click()} className="text-sm px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded flex items-center justify-center gap-1"><Upload className="w-4 h-4" /> Upload</button>
          <button onClick={pullStreetView} disabled={svBusy} className="text-sm px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded flex items-center justify-center gap-1">{svBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />} Street View</button>
        </div>

        {source && (<>
          <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Mask</h3>
          <div className="flex gap-1 mb-2">
            <button onClick={() => setTool('brush')} className={`flex-1 px-2 py-1.5 rounded text-sm flex items-center justify-center gap-1 ${tool === 'brush' ? 'bg-moss-600' : 'bg-slate-800'}`}><Brush className="w-3.5 h-3.5" /> Brush</button>
            <button onClick={() => setTool('erase')} className={`flex-1 px-2 py-1.5 rounded text-sm flex items-center justify-center gap-1 ${tool === 'erase' ? 'bg-moss-600' : 'bg-slate-800'}`}><Eraser className="w-3.5 h-3.5" /> Erase</button>
          </div>
          <label className="text-xs text-slate-400">Brush: {brush}px</label>
          <input type="range" min={4} max={120} value={brush} onChange={(e) => setBrush(parseInt(e.target.value))} className="w-full mb-4" />
        </>)}

        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Style presets</h3>
        <div className="grid grid-cols-2 gap-1 mb-3">
          {STYLE_PRESETS.map((p) => (
            <button key={p.label} onClick={() => setPrompt(p.prompt)} title={p.prompt} className="text-xs px-2 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-left truncate">{p.label}</button>
          ))}
        </div>

        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Prompt</h3>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm mb-3" />
        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Negative</h3>
        <textarea value={negative} onChange={(e) => setNegative(e.target.value)} rows={2} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm mb-3" />

        <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Model</h3>
        <select value={controlnet} onChange={(e) => setControlnet(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm mb-4">
          <option value="canny">ControlNet — Canny (keep structure, restyle)</option>
          <option value="depth">ControlNet — Depth (replace objects)</option>
          <option value="seg">ControlNet — Seg (swap by category)</option>
          <option value="none">SDXL (concept board, no input control)</option>
        </select>

        <button onClick={generate} disabled={!source || busy}
          className="w-full px-3 py-2 bg-moss-600 hover:bg-moss-500 disabled:bg-slate-800 disabled:text-slate-500 rounded text-sm font-medium flex items-center justify-center gap-2">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}{busy ? 'Generating…' : 'Generate 4 variants'}
        </button>
        {!cfg.hasReplicate && <p className="text-xs text-amber-400 mt-3">No Replicate key set — generation returns the source as mock variants. Add REPLICATE_API_TOKEN for real renders.</p>}
        {!cfg.hasGoogle && <p className="text-xs text-amber-400 mt-2">No Google key set — Street View is unavailable. Add GOOGLE_MAPS_API_KEY.</p>}
      </aside>

      {session && variant && (
        <BeforeAfter beforeUrl={session.sourceUrl} afterUrl={variant.url} prompt={session.prompt} pinned={!!variant.pinned}
          onTogglePin={() => togglePin(session.id, variant.id)} onClose={() => setCompare(null)} />
      )}
    </div>
  )
}
