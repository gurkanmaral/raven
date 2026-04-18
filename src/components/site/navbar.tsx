import { NavLink } from 'react-router-dom'
import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Anasayfa' },
  { to: '/hakkimizda', label: 'Hakkımızda' },
  { to: '/urunlerimiz', label: 'Ürünlerimiz' },
  { to: '/iletisim', label: 'İletişim' },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'text-sm font-medium tracking-wide text-foreground/70 transition-colors hover:text-foreground',
              isActive && 'text-foreground',
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </>
  )
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <NavLink to="/" className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-gold shadow-[0_0_0_6px_rgba(212,175,55,0.12)]" />
          <span className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-foreground">
            Raven Global
          </span>
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLinks />
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            asChild
            className="bg-gold text-black hover:bg-gold/90"
            size="sm"
          >
            <NavLink to="/iletisim">Teklif Al</NavLink>
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-border bg-background text-foreground"
            >
              <div className="mt-8 flex flex-col gap-6">
                <NavLinks />
                <Button
                  asChild
                  className="mt-2 bg-gold text-black hover:bg-gold/90"
                >
                  <NavLink to="/iletisim">Teklif Al</NavLink>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
