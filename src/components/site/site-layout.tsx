import { useEffect, useLayoutEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import gsap from 'gsap'

import { Toaster } from '@/components/ui/sonner'

import { Footer } from './footer'
import { Navbar } from './navbar'

export function SiteLayout() {
  const location = useLocation()
  const mainRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
  }, [location.pathname])

  useLayoutEffect(() => {
    if (!mainRef.current) return
    gsap.fromTo(
      mainRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
    )
  }, [location.pathname])

  return (
    <div className="theme min-h-svh bg-background text-foreground">
      <Navbar />
      <main ref={mainRef} className="min-h-[calc(100svh-4rem)]">
        <Outlet />
      </main>
      <Footer />
      <Toaster richColors />
    </div>
  )
}
