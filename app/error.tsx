'use client'

import { useEffect } from 'react'

// Route-level error boundary. A ChunkLoadError almost always means the browser
// is holding HTML from an older deploy whose JS chunks no longer exist on the
// server (common right after a Vercel redeploy). Reloading fetches fresh HTML
// that points at the current chunks, so we self-heal that case once.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const isChunkError = /ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module/i.test(error.message)

  useEffect(() => {
    if (isChunkError && typeof window !== 'undefined') {
      const key = 'ls-chunk-reloaded'
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, '1')
        window.location.reload()
      }
    } else {
      sessionStorage.removeItem('ls-chunk-reloaded')
    }
  }, [isChunkError])

  return (
    <div className="min-h-screen grid place-items-center p-8 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="text-sm text-slate-400">
          {isChunkError
            ? 'The app was updated. Reloading to get the latest version…'
            : error.message || 'An unexpected error occurred.'}
        </p>
        <div className="flex gap-2 justify-center">
          <button onClick={() => reset()} className="px-4 py-2 bg-moss-600 hover:bg-moss-500 rounded text-sm">Try again</button>
          <button onClick={() => window.location.assign('/')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm">Back to projects</button>
        </div>
      </div>
    </div>
  )
}
