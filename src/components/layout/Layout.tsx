import type { ReactNode } from 'react'
import { Header } from './Header'
import { TooltipProvider } from '@/components/ui'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 flex overflow-hidden">
          {children}
        </main>
      </div>
    </TooltipProvider>
  )
}
