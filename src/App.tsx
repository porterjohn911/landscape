import { Outlet, Link, useLocation } from 'react-router-dom'
import { Trees, Settings as SettingsIcon } from 'lucide-react'

export default function App() {
  const loc = useLocation()
  const inEditor = loc.pathname.startsWith('/project/')

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100">
      <header className="flex items-center justify-between px-4 h-11 border-b border-slate-800 bg-slate-900/60 select-none">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Trees className="w-5 h-5 text-moss-500" />
          Landscape Studio
        </Link>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          {!inEditor && (
            <Link to="/settings" className="hover:text-slate-100 flex items-center gap-1">
              <SettingsIcon className="w-4 h-4" /> Settings
            </Link>
          )}
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
