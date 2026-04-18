import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ShieldCheck, Snowflake, Zap } from 'lucide-react'

import { HeroThree } from '@/components/site/hero-three'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const solutions = [
  {
    icon: Snowflake,
    title: 'Endüstriyel Soğutma',
    description:
      'Chiller, soğutma grubu ve proses odaklı sistemlerle stabil sıcaklık kontrolü.',
  },
  {
    icon: Zap,
    title: 'Enerji Verimliliği',
    description:
      'Isı geri kazanım, akıllı kontrol ve optimize edilmiş tasarımla daha düşük işletme maliyeti.',
  },
  {
    icon: ShieldCheck,
    title: 'Güvenilir Operasyon',
    description:
      'Yedeklilik, uzaktan izleme ve servis altyapısıyla kesintisiz çalışma.',
  },
]

export default function LandingPage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const blobARef = useRef<HTMLDivElement | null>(null)
  const blobBRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (!rootRef.current) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      if (blobARef.current && blobBRef.current) {
        gsap.set([blobARef.current, blobBRef.current], { x: 0, y: 0 })
        gsap.to(blobARef.current, {
          x: 80,
          y: -40,
          duration: 10,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
        gsap.to(blobBRef.current, {
          x: -70,
          y: 55,
          duration: 12,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }

      gsap.from('[data-animate="hero"]', {
        opacity: 0,
        y: 18,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
      })

      gsap.utils.toArray<HTMLElement>('[data-animate="reveal"]').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 24,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
          },
        })
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef}>
      <section className="relative overflow-hidden bg-background">
        <div className="pointer-events-none absolute inset-0">
          <HeroThree />
          <div
            ref={blobARef}
            className="absolute -left-40 -top-40 size-[560px] rounded-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.18),transparent_60%)] blur-3xl"
          />
          <div
            ref={blobBRef}
            className="absolute -bottom-48 -right-48 size-[640px] rounded-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.14),transparent_62%)] blur-3xl"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.10),transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:64px_64px] opacity-[0.15]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <Badge
              data-animate="hero"
              variant="outline"
              className="border-border bg-background/70 text-foreground/80"
            >
              Raven Global • Cooling Systems
            </Badge>

            <h1
              data-animate="hero"
              className="mt-5 font-heading text-4xl font-semibold leading-tight text-foreground md:text-6xl"
            >
              Modern Soğutma Sistemleri.
              <span className="block text-gold">Sessiz güç.</span>
            </h1>

            <p
              data-animate="hero"
              className="mt-5 max-w-xl text-base leading-7 text-muted-foreground md:text-lg"
            >
              Raven Global, endüstriyel soğutma ve HVAC çözümlerinde; tasarım,
              kurulum ve bakım süreçlerini tek çatı altında sunar. Verimlilik,
              güvenilirlik ve estetik.
            </p>

            <div data-animate="hero" className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="bg-gold text-black hover:bg-gold/90">
                <Link to="/iletisim">
                  Ücretsiz Keşif <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-border bg-background/80 text-foreground hover:bg-muted"
              >
                <Link to="/urunlerimiz">Ürünlerimizi İncele</Link>
              </Button>
            </div>
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-3" data-animate="reveal">
            {solutions.map((item) => {
              const Icon = item.icon
              return (
                <Card
                  key={item.title}
                  className="border-border bg-card p-6 text-foreground shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-gold/10 text-gold">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <div className="text-base font-semibold">{item.title}</div>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div data-animate="reveal" className="space-y-4">
              <div className="text-sm font-medium text-gold">Yaklaşımımız</div>
              <h2 className="font-heading text-3xl font-semibold leading-tight text-foreground">
                Tasarım odaklı mühendislik
              </h2>
              <p className="text-sm leading-7 text-muted-foreground md:text-base">
                Proje başlangıcından devreye almaya kadar, sistemin toplam
                maliyetini ve kullanım ömrünü optimize ederiz. Modern kontrol
                stratejileri ve modüler tasarım ile ölçeklenebilir çözümler
                sunarız.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-gold/10 text-gold hover:bg-gold/10">
                  Enerji Analizi
                </Badge>
                <Badge className="bg-gold/10 text-gold hover:bg-gold/10">
                  Projelendirme
                </Badge>
                <Badge className="bg-gold/10 text-gold hover:bg-gold/10">
                  Servis & Bakım
                </Badge>
              </div>
            </div>

            <div
              data-animate="reveal"
              className="rounded-2xl border border-border bg-gradient-to-b from-muted to-background p-8"
            >
              <div className="grid gap-6">
                <div className="flex items-start justify-between">
                  <div className="text-sm text-muted-foreground">Ortalama verim artışı</div>
                  <div className="text-2xl font-semibold text-foreground">
                    %15–30
                  </div>
                </div>
                <Separator className="bg-border" />
                <div className="flex items-start justify-between">
                  <div className="text-sm text-muted-foreground">
                    Modüler kontrol mimarisi
                  </div>
                  <div className="text-2xl font-semibold text-foreground">24/7</div>
                </div>
                <Separator className="bg-border" />
                <div className="flex items-start justify-between">
                  <div className="text-sm text-muted-foreground">
                    Uzaktan izleme & raporlama
                  </div>
                  <div className="text-2xl font-semibold text-foreground">Pro</div>
                </div>
              </div>
            </div>
          </div>

          <div
            data-animate="reveal"
            className="mt-14 rounded-2xl border border-border bg-card p-8 md:p-10"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <div className="text-sm font-medium text-gold">Birlikte çalışalım</div>
                <div className="mt-2 font-heading text-2xl font-semibold text-foreground">
                  Projenizi Raven standardıyla büyütün.
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Ürünlerinizi daha sonra ekleyebiliriz. Şimdilik güçlü bir vitrin
                  ve marka diliyle başlayalım.
                </p>
              </div>
              <Button asChild className="bg-gold text-black hover:bg-gold/90">
                <Link to="/iletisim">
                  İletişime Geç <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
