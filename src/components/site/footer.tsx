import { NavLink } from 'react-router-dom'

import { Separator } from '@/components/ui/separator'

const footerLinks = [
  { to: '/', label: 'Anasayfa' },
  { to: '/hakkimizda', label: 'Hakkımızda' },
  { to: '/urunlerimiz', label: 'Ürünlerimiz' },
  { to: '/iletisim', label: 'İletişim' },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_1fr]">
          <div className="space-y-3">
            <div className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-foreground">
              Raven Global
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              Endüstriyel soğutma, HVAC ve özel mühendislik çözümleri. Verimlilik,
              güvenilirlik ve sürdürülebilirlik odaklı tasarım.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-foreground">Sayfalar</div>
            <div className="flex flex-col gap-2 text-sm">
              {footerLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-foreground">İletişim</div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>info@ravenglobal.com</div>
              <div>+90 (000) 000 00 00</div>
              <div>Türkiye</div>
            </div>
          </div>
        </div>

        <Separator className="my-10 bg-border" />

        <div className="flex flex-col gap-3 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} Raven Global. Tüm hakları saklıdır.</div>
          <div className="flex items-center gap-3">
            <a
              href="#"
              aria-label="Instagram"
              className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
                <path d="M16.5 7.5h.01" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V9h4v2a4 4 0 0 1 2-3z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 15.5V8.5L16 12l-6 3.5Z" fill="currentColor" stroke="none" />
                <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.8 4.6 12 4.6 12 4.6s-5.8 0-7.5.5a3 3 0 0 0-2.1 2.1A31.9 31.9 0 0 0 2 12a31.9 31.9 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.7.5 7.5.5 7.5.5s5.8 0 7.5-.5a3 3 0 0 0 2.1-2.1A31.9 31.9 0 0 0 22 12a31.9 31.9 0 0 0-.4-4.8Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
