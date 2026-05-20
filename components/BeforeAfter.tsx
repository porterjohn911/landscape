'use client'

import { useEffect, useRef, useState } from 'react'
import { X, ArrowLeftRight } from 'lucide-react'

export default function BeforeAfter({
  beforeUrl, afterUrl, prompt, pinned, onClose, onTogglePin,
}: {
  beforeUrl: string
  afterUrl: string
  prompt?: string
  pinned?: boolean
  onClose: () => void
  onTogglePin?: () => void
}) {
  const [pos, setPos] = useState(50)
  const [swap, setSwap] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  useEffect(() => {
    function k(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 2))
      if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 2))
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])

  function fromX(x: number) {
    const r = wrap.current!.getBoundingClientRect()
    setPos(Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100)))
  }

  const left = swap ? afterUrl : beforeUrl
  const right = swap ? beforeUrl : afterUrl

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex flex-col">
      <div className="flex items-center gap-3 px-4 h-12 border-b border-slate-800">
        <span className="text-sm font-medium">Before / after</span>
        {prompt && <span className="text-xs text-slate-400 truncate flex-1">{prompt}</span>}
        <button onClick={() => setSwap((s) => !s)} className="text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded flex items-center gap-1"><ArrowLeftRight className="w-3.5 h-3.5" /> Swap</button>
        {onTogglePin && <button onClick={onTogglePin} className={`text-xs px-2 py-1 rounded ${pinned ? 'bg-moss-600' : 'bg-slate-800 hover:bg-slate-700'}`}>{pinned ? '★ Pinned' : '☆ Pin'}</button>}
        <button onClick={onClose} className="text-slate-400 hover:text-slate-100"><X className="w-5 h-5" /></button>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
        <div ref={wrap} className="relative max-w-full max-h-full select-none cursor-ew-resize"
          onPointerDown={(e) => { dragging.current = true; (e.target as HTMLElement).setPointerCapture(e.pointerId); fromX(e.clientX) }}
          onPointerMove={(e) => { if (dragging.current) fromX(e.clientX) }}
          onPointerUp={(e) => { dragging.current = false; (e.target as HTMLElement).releasePointerCapture(e.pointerId) }}>
          <img src={left} alt="before" className="block max-w-[90vw] max-h-[80vh] pointer-events-none" draggable={false} />
          <img src={right} alt="after" className="absolute inset-0 w-full h-full pointer-events-none" draggable={false} style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
          <div className="absolute top-2 left-2 text-[10px] uppercase tracking-wider font-semibold bg-black/70 px-2 py-0.5 rounded">{swap ? 'After' : 'Before'}</div>
          <div className="absolute top-2 right-2 text-[10px] uppercase tracking-wider font-semibold bg-moss-600 px-2 py-0.5 rounded">{swap ? 'Before' : 'After'}</div>
          <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}>
            <div className="w-0.5 h-full bg-white shadow-lg" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-lg grid place-items-center text-slate-900"><ArrowLeftRight className="w-4 h-4" /></div>
          </div>
        </div>
      </div>
      <div className="px-6 pb-4 flex items-center gap-3 text-xs text-slate-400">
        <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(parseInt(e.target.value))} className="flex-1" />
        <span className="w-10 text-right font-mono">{Math.round(pos)}%</span>
      </div>
    </div>
  )
}
