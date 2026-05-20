'use client'

// Catches errors thrown in the root layout itself. Renders its own <html>.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', background: '#020617', color: '#f1f5f9', minHeight: '100vh', display: 'grid', placeItems: 'center', margin: 0 }}>
        <div style={{ textAlign: 'center', padding: 32, maxWidth: 420 }}>
          <h1 style={{ fontSize: 20 }}>Something went wrong</h1>
          <p style={{ fontSize: 14, color: '#94a3b8' }}>{error.message || 'An unexpected error occurred.'}</p>
          <button onClick={() => reset()} style={{ padding: '8px 16px', background: '#467036', color: '#fff', border: 0, borderRadius: 6, cursor: 'pointer' }}>Try again</button>
        </div>
      </body>
    </html>
  )
}
