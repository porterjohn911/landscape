import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Landscape Studio',
  description: 'Design outdoor spaces from a real address — 2D plan, 3D scene, and AI photo redesign.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="h-full">{children}</body>
    </html>
  )
}
