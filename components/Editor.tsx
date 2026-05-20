'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft, ImageIcon, Map, Box, AlertTriangle, X } from 'lucide-react'
import { useStore } from '@/lib/store'
import { getConfig } from '@/lib/apiClient'
import PlanCanvas from './PlanCanvas'
import AIPhotoStudio from './AIPhotoStudio'

// three.js can't render on the server — load the scene client-only.
const SceneViewer = dynamic(() => import('./SceneViewer'), {
  ssr: false,
  loading: () => <div className="h-full grid place-items-center text-slate-500">Loading 3D…</div>,
})

type Tab = 'photo' | 'plan' | 'scene'

export default function Editor({ projectId }: { projectId: string }) {
  const project = useStore((s) => s.projects[projectId])
  const rename = useStore((s) => s.rename)
  const [tab, setTab] = useState<Tab>('plan')
  const [mounted, setMounted] = useState(false)
  const [noKey, setNoKey] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  useEffect(() => setMounted(true), [])
  useEffect(() => {
    getConfig().then((c) => setNoKey(!c.hasGoogle)).catch(() => {})
  }, [])

  if (!mounted) return null
  if (!project) {
    return (
      <div className="h-screen grid place-items-center text-slate-500">
        Project not found. <Link href="/" className="text-moss-500 underline ml-1">Back to projects</Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center gap-3 px-3 h-12 border-b border-slate-800 bg-slate-900/40">
        <Link href="/" className="text-slate-400 hover:text-slate-100"><ArrowLeft className="w-4 h-4" /></Link>
        <input value={project.name} onChange={(e) => rename(projectId, e.target.value)}
          className="bg-transparent text-sm font-medium outline-none focus:bg-slate-800 px-1 rounded" />
        <div className="ml-auto flex items-center gap-1">
          <TabBtn icon={<ImageIcon className="w-4 h-4" />} label="AI photo" active={tab === 'photo'} onClick={() => setTab('photo')} />
          <TabBtn icon={<Map className="w-4 h-4" />} label="2D plan" active={tab === 'plan'} onClick={() => setTab('plan')} />
          <TabBtn icon={<Box className="w-4 h-4" />} label="3D scene" active={tab === 'scene'} onClick={() => setTab('scene')} />
        </div>
      </div>

      {noKey && !dismissed && (
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-900/40 border-b border-amber-700/50 text-amber-200 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="flex-1">
            The server can&apos;t see a Google Maps key, so address search, aerial imagery, and Street View are off.
            Add <code className="px-1 bg-black/30 rounded">GOOGLE_MAPS_API_KEY</code> in Vercel → Settings → Environment Variables, then redeploy.
            Check <code className="px-1 bg-black/30 rounded">/api/config</code> to confirm.
          </span>
          <button onClick={() => setDismissed(true)} className="text-amber-300 hover:text-amber-100"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        {tab === 'photo' && <AIPhotoStudio projectId={projectId} />}
        {tab === 'plan' && <PlanCanvas projectId={projectId} />}
        {tab === 'scene' && <SceneViewer projectId={projectId} />}
      </div>
    </div>
  )
}

function TabBtn({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition ${active ? 'bg-moss-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
      {icon} {label}
    </button>
  )
}
