import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ImageIcon, Map, Box, Save } from 'lucide-react'
import { useProject } from '../lib/store'
import AIPhotoStudio from '../modules/ai-photo/AIPhotoStudio'
import PlanCanvas from '../modules/plan-2d/PlanCanvas'
import SceneViewer from '../modules/scene-3d/SceneViewer'

export default function Editor() {
  const { id } = useParams<{ id: string }>()
  const { project, tab, setTab, load, rename, dirty, save } = useProject()

  useEffect(() => {
    if (id) void load(id)
  }, [id, load])

  if (!project) {
    return <div className="p-10 text-slate-500">Loading…</div>
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-3 h-11 border-b border-slate-800 bg-slate-900/40">
        <Link to="/" className="text-slate-400 hover:text-slate-100" title="Back to projects">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <input
          value={project.name}
          onChange={(e) => rename(e.target.value)}
          className="bg-transparent text-sm font-medium outline-none focus:bg-slate-800 px-1 rounded"
        />
        <div className="ml-auto flex items-center gap-1">
          <TabButton icon={<ImageIcon className="w-4 h-4" />} label="AI photo" active={tab === 'photo'} onClick={() => setTab('photo')} />
          <TabButton icon={<Map className="w-4 h-4" />} label="2D plan" active={tab === 'plan'} onClick={() => setTab('plan')} />
          <TabButton icon={<Box className="w-4 h-4" />} label="3D scene" active={tab === 'scene'} onClick={() => setTab('scene')} />
        </div>
        <button
          onClick={() => void save()}
          className="ml-3 flex items-center gap-1 text-xs text-slate-400 hover:text-slate-100"
          title="Save now"
        >
          <Save className="w-3.5 h-3.5" />
          {dirty ? 'Unsaved' : 'Saved'}
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {tab === 'photo' && <AIPhotoStudio />}
        {tab === 'plan' && <PlanCanvas />}
        {tab === 'scene' && <SceneViewer />}
      </div>
    </div>
  )
}

function TabButton({
  icon, label, active, onClick,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition ${
        active ? 'bg-moss-600 text-white' : 'text-slate-300 hover:bg-slate-800'
      }`}
    >
      {icon} {label}
    </button>
  )
}
