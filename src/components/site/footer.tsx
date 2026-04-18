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
            <span className="text-foreground/50">Siyah • Beyaz • Altın</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
