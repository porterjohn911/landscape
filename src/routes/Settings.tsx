import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import { api } from '../lib/api'

export default function Settings() {
  const [status, setStatus] = useState<{ hasReplicateToken: boolean; hasMapboxToken: boolean } | null>(null)
  const [replicate, setReplicate] = useState('')
  const [mapbox, setMapbox] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.config.get().then((s) => setStatus(s))
  }, [])

  async function save() {
    const patch: Record<string, string> = {}
    if (replicate) patch.replicateToken = replicate
    if (mapbox) patch.mapboxToken = mapbox
    const s = await api.config.set(patch)
    setStatus(s)
    setReplicate(''); setMapbox('')
    setSaved(true); setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <Link to="/" className="text-sm text-slate-400 hover:text-slate-100 flex items-center gap-1 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <h1 className="text-2xl font-semibold mb-2">Settings</h1>
      <p className="text-sm text-slate-400 mb-6">
        Tokens are stored locally in your user data directory. Leave a field blank to keep the existing value.
      </p>

      <Field
        label="Replicate API token"
        hint="Used for AI photo redesigns (Stable Diffusion + ControlNet). Without a token, the app returns mock variants so the UI still works."
        configured={!!status?.hasReplicateToken}
        value={replicate}
        onChange={setReplicate}
        placeholder="r8_..."
      />
      <Field
        label="Mapbox token"
        hint="Used for satellite imagery and address geocoding. Without a token, a placeholder tile is shown."
        configured={!!status?.hasMapboxToken}
        value={mapbox}
        onChange={setMapbox}
        placeholder="pk.eyJ..."
      />

      <div className="flex justify-end items-center gap-3 mt-6">
        {saved && <span className="text-xs text-moss-500">Saved.</span>}
        <button onClick={save} className="px-3 py-1.5 text-sm bg-moss-600 hover:bg-moss-500 rounded">
          Save tokens
        </button>
      </div>
    </div>
  )
}

function Field({
  label, hint, configured, value, onChange, placeholder,
}: {
  label: string
  hint: string
  configured: boolean
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-medium">{label}</label>
        {configured ? (
          <span className="text-xs text-moss-500 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Configured
          </span>
        ) : (
          <span className="text-xs text-amber-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Not set
          </span>
        )}
      </div>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm font-mono"
      />
      <p className="text-xs text-slate-500 mt-1">{hint}</p>
    </div>
  )
}
