import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, MapPin, Trash2 } from 'lucide-react'
import { api, unwrap } from '../lib/api'
import type { ProjectSummary } from '@shared/types'

export default function ProjectList() {
  const [items, setItems] = useState<ProjectSummary[]>([])
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const nav = useNavigate()

  async function refresh() {
    const list = unwrap(await api.projects.list())
    setItems(list)
  }
  useEffect(() => {
    void refresh()
  }, [])

  async function create() {
    const p = unwrap(await api.projects.create(name || 'Untitled project', address || undefined))
    setCreating(false); setName(''); setAddress('')
    nav(`/project/${p.id}`)
  }

  async function remove(id: string) {
    if (!confirm('Delete this project? This cannot be undone.')) return
    await api.projects.delete(id)
    void refresh()
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Your projects</h1>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-moss-600 hover:bg-moss-500 rounded-md text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> New project
        </button>
      </div>

      {creating && (
        <div className="mb-6 p-4 rounded-lg border border-slate-800 bg-slate-900/40 space-y-3">
          <input
            autoFocus
            placeholder="Project name (e.g. Smith residence)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
          />
          <input
            placeholder="Address (optional, used for satellite imagery)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setCreating(false)} className="px-3 py-1.5 text-sm text-slate-400 hover:text-slate-100">
              Cancel
            </button>
            <button onClick={create} className="px-3 py-1.5 text-sm bg-moss-600 hover:bg-moss-500 rounded-md">
              Create
            </button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          No projects yet. Create one to get started.
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p) => (
            <li
              key={p.id}
              className="group relative rounded-lg border border-slate-800 bg-slate-900/40 hover:border-moss-600 transition"
            >
              <Link to={`/project/${p.id}`} className="block p-4">
                <div className="font-medium mb-1 truncate">{p.name}</div>
                {p.address && (
                  <div className="text-xs text-slate-400 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3" /> {p.address}
                  </div>
                )}
                <div className="text-xs text-slate-500 mt-2">
                  Updated {new Date(p.updatedAt).toLocaleString()}
                </div>
              </Link>
              <button
                onClick={() => remove(p.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400"
                title="Delete project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
