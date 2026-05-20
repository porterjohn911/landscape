import { useEffect, useRef, useState } from 'react'
import { X, ArrowLeftRight, Pin, PinOff } from 'lucide-react'

type Props = {
  beforeUrl: string
  afterUrl: string
  prompt?: string
  pinned?: boolean
  onClose: () => void
  onTogglePin?: () => void
}

export default function BeforeAfter({ beforeUrl, afterUrl, prompt, pinned, onClose, onTogglePin }: Props) {
  const [pos, setPos] = useState(50)
  const [swap, setSwap] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 2))
      if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 2))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function updateFromClientX(clientX: number) {
    const el = wrap.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = ((clientX - r.left) / r.width) * 100
    setPos(Math.max(0, Math.min(100, x)))
  }

  // The "before" image is the bottom layer (always fully visible). The
  // "after" image stacks on top with a clip-path that exposes the left
  // portion up to the slider position. The user effectively wipes the
  // after over the before by dragging right.
  const before = swap ? afterUrl : beforeUrl
  const after = swap ? beforeUrl : afterUrl

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex flex-col">
      <div className="flex items-center gap-3 px-4 h-12 border-b border-slate-800">
        <span className="text-sm font-medium">Before / after</span>
        {prompt && (
          <span className="text-xs text-slate-400 truncate flex-1" title={prompt}>{prompt}</span>
        )}
        <button
          onClick={() => setSwap((s) => !s)}
          className="flex items-center gap-1 text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" /> Swap sides
        </button>
        {onTogglePin && (
          <button
            onClick={onTogglePin}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${pinned ? 'bg-moss-600' : 'bg-slate-800 hover:bg-slate-700'}`}
          >
            {pinned ? <Pin className="w-3.5 h-3.5" /> : <PinOff className="w-3.5 h-3.5" />}
            {pinned ? 'Pinned' : 'Pin favorite'}
          </button>
        )}
        <button onClick={onClose} className="text-slate-400 hover:text-slate-100">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
        <div
          ref={wrap}
          className="relative max-w-full max-h-full select-none cursor-ew-resize"
          onPointerDown={(e) => {
            dragging.current = true
            ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
            updateFromClientX(e.clientX)
          }}
          onPointerMove={(e) => { if (dragging.current) updateFromClientX(e.clientX) }}
          onPointerUp={(e) => {
            dragging.current = false
            ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
          }}
        >
          <img
            src={before}
            alt="before"
            className="block max-w-[90vw] max-h-[80vh] pointer-events-none"
            draggable={false}
          />
          <img
            src={after}
            alt="after"
            className="absolute inset-0 w-full h-full pointer-events-none"
            draggable={false}
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          />

          {/* Labels */}
          <div className="absolute top-2 left-2 text-[10px] uppercase tracking-wider font-semibold bg-black/70 text-white px-2 py-0.5 rounded">
            {swap ? 'After' : 'Before'}
          </div>
          <div className="absolute top-2 right-2 text-[10px] uppercase tracking-wider font-semibold bg-moss-600 text-white px-2 py-0.5 rounded">
            {swap ? 'Before' : 'After'}
          </div>

          {/* Divider */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none"
            style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
          >
            <div className="w-0.5 h-full bg-white shadow-[0_0_8px_rgba(0,0,0,0.6)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center">
              <ArrowLeftRight className="w-4 h-4 text-slate-900" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-4 flex items-center gap-3 text-xs text-slate-400">
        <span>← →</span>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(parseInt(e.target.value))}
          className="flex-1"
        />
        <span className="w-10 text-right font-mono">{Math.round(pos)}%</span>
      </div>
    </div>
  )
}
