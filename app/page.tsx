'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, MapPin, Trash2, Trees } from 'lucide-react'
import { useStore } from '@/lib/store'

export default function Home() {
  const router = useRouter()
  const projects = useStore((s) => s.projects)
  const create = useStore((s) => s.create)
  const remove = useStore((s) => s.remove)
  const [mounted, setMounted] = useState(false)
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')

  useEffect(() => setMounted(true), [])

  const list = Object.values(projects).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  function doCreate() {
    const p = create(name || 'Untitled project', address || undefined)
    router.push(`/project/${p.id}`)
  }

  return (
    <div className="min-h-screen">
      <header className="flex items-center gap-2 px-5 h-12 border-b border-slate-800 bg-slate-900/60 font-semibold">
        <Trees className="w-5 h-5 text-moss-500" />
        Landscape Studio
        <span className="text-xs font-normal text-slate-500 ml-2">web</span>
      </header>

      <div className="max-w-5xl mx-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Your projects</h1>
          <button onClick={() => setCreating(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-moss-600 hover:bg-moss-500 rounded-md text-sm font-medium">
            <Plus className="w-4 h-4" /> New project
          </button>
        </div>

        {creating && (
          <div className="mb-6 p-4 rounded-lg border border-slate-800 bg-slate-900/40 space-y-3">
            <input autoFocus placeholder="Project name (e.g. Smith residence)"
              value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm" />
            <input placeholder="Client address (used for aerial, Street View, 3D)"
              value={address} onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') doCreate() }}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setCreating(false)} className="px-3 py-1.5 text-sm text-slate-400 hover:text-slate-100">Cancel</button>
              <button onClick={doCreate} className="px-3 py-1.5 text-sm bg-moss-600 hover:bg-moss-500 rounded-md">Create</button>
            </div>
          </div>
        )}

        {!mounted ? null : list.length === 0 ? (
          <div className="text-center py-20 text-slate-500">No projects yet. Create one to get started.</div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((p) => (
              <li key={p.id} className="group relative rounded-lg border border-slate-800 bg-slate-900/40 hover:border-moss-600 transition">
                <button onClick={() => router.push(`/project/${p.id}`)} className="block w-full text-left p-4">
                  <div className="font-medium mb-1 truncate">{p.name}</div>
                  {p.site.address && (
                    <div className="text-xs text-slate-400 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3" /> {p.site.address}
                    </div>
                  )}
                  <div className="text-xs text-slate-500 mt-2">Updated {new Date(p.updatedAt).toLocaleString()}</div>
                </button>
                <button onClick={() => { if (confirm('Delete this project?')) remove(p.id) }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
