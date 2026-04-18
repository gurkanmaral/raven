import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { Award, Gauge, Leaf, Wrench } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const highlights = [
  {
    icon: Gauge,
    title: 'Verimlilik',
    description:
      'Enerji tüketimini azaltan akıllı kontrol senaryoları ve doğru kapasite seçimi.',
  },
  {
    icon: Wrench,
    title: 'Servis Odaklılık',
    description:
      'Kurulum sonrası bakım planları ve hızlı müdahale süreçleriyle süreklilik.',
  },
  {
    icon: Leaf,
    title: 'Sürdürülebilirlik',
    description:
      'Daha düşük karbon izi için optimize edilen ekipman seçimi ve sistem tasarımı.',
  },
  {
    icon: Award,
    title: 'Kalite',
    description:
      'Standartlara uygun projelendirme, dokümantasyon ve saha uygulama disiplini.',
  },
]

export default function HakkimizdaPage() {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (!rootRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('[data-animate="in"]', {
        opacity: 0,
        y: 18,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className="bg-background">
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="max-w-3xl">
            <div data-animate="in" className="text-sm font-medium text-gold">
              Hakkımızda
            </div>
            <h1
              data-animate="in"
              className="mt-3 font-heading text-4xl font-semibold leading-tight text-foreground md:text-5xl"
            >
              Raven Global: mühendislik, tasarım ve disiplin.
            </h1>
            <p data-animate="in" className="mt-4 text-base leading-7 text-muted-foreground">
              Soğutma sistemleri; yalnızca ekipman seçimi değil, bir operasyon
              güvenliği meselesidir. Raven Global, doğru kapasite, doğru kontrol ve
              doğru servis yaklaşımıyla sürdürülebilir çözümler üretir.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <Card
            data-animate="in"
            className="border-border bg-card p-8 text-foreground"
          >
            <div className="font-heading text-xl font-semibold">Misyon</div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
              Endüstriyel soğutma ve HVAC projelerinde; verimli, güvenilir ve
              ölçeklenebilir sistemler tasarlayarak müşterilerimizin operasyonel
              sürekliliğini artırmak.
            </p>
            <Separator className="my-6 bg-border" />
            <div className="font-heading text-xl font-semibold">Vizyon</div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
              Modern soğutma teknolojilerinde; estetik ve mühendisliği birleştiren,
              premium hizmet standardı sunan öncü marka olmak.
            </p>
          </Card>

          <div className="grid gap-4" data-animate="in">
            {highlights.map((item) => {
              const Icon = item.icon
              return (
                <Card
                  key={item.title}
                  className="border-border bg-card p-6 text-foreground"
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

        <div
          data-animate="in"
          className="mt-12 rounded-2xl border border-border bg-gradient-to-b from-muted to-background p-8 md:p-10"
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-sm text-muted-foreground">Odak</div>
              <div className="mt-2 font-heading text-xl font-semibold text-foreground">
                Performans
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Kapasite, verim ve güvenilirlik.
              </p>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Standart</div>
              <div className="mt-2 font-heading text-xl font-semibold text-foreground">
                Kalite
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Ölçülebilir süreçler, şeffaf raporlama.
              </p>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Dil</div>
              <div className="mt-2 font-heading text-xl font-semibold text-foreground">
                Minimal
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Siyah, beyaz ve altın dokunuşlar.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
