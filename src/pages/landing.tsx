import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Gauge, Leaf, ShieldCheck, Snowflake, Wrench, Zap } from 'lucide-react'

import { HeroThree } from '@/components/site/hero-three'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
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

const industries = [
  {
    icon: Snowflake,
    title: 'Gıda & Depolama',
    description: 'Soğuk oda, proses ve depo sıcaklık kontrolü için stabil çözümler.',
  },
  {
    icon: Zap,
    title: 'Üretim Tesisleri',
    description: 'Proses soğutma, hat stabilitesi ve enerji optimizasyonu odaklı tasarım.',
  },
  {
    icon: Gauge,
    title: 'Verimlilik Projeleri',
    description: 'Isı geri kazanım ve otomasyon ile toplam maliyeti düşüren yaklaşımlar.',
  },
  {
    icon: Leaf,
    title: 'Sürdürülebilirlik',
    description: 'Daha düşük tüketim, daha az bakım ve uzun ömürlü işletme hedefi.',
  },
]

const processSteps = [
  {
    icon: Gauge,
    title: 'Keşif & Analiz',
    description: 'Saha verileri, kapasite hesabı ve risk analiziyle doğru başlangıç.',
  },
  {
    icon: Wrench,
    title: 'Tasarım & Projelendirme',
    description: 'Modüler mimari, kontrol senaryoları ve ölçeklenebilir altyapı.',
  },
  {
    icon: ShieldCheck,
    title: 'Kurulum & Devreye Alma',
    description: 'Test, kalibrasyon ve performans doğrulama ile güvenli teslim.',
  },
  {
    icon: Zap,
    title: 'İzleme & İyileştirme',
    description: 'Uzaktan izleme, raporlama ve enerji optimizasyonu ile sürekli gelişim.',
  },
]

const faqs = [
  {
    q: 'Ürünleri nasıl güncelliyoruz?',
    a: 'Ürünleri Strapi üzerinden yönetebilirsiniz. Yayınladığınızda web sitenizde otomatik görünür.',
  },
  {
    q: 'Keşif ve teklif süreci nasıl ilerler?',
    a: 'İletişim formu ile talep oluşturun. İhtiyaca göre saha keşfi/online görüşme sonrası teklif hazırlanır.',
  },
  {
    q: 'Servis ve bakım desteği var mı?',
    a: 'Evet. Planlı bakım ve hızlı müdahale süreçleriyle sistemin sürekliliğini hedefleriz.',
  },
  {
    q: 'Ne kadar sürede devreye alınır?',
    a: 'Proje kapsamına bağlıdır. Modüler tasarım ve hazır kontrol senaryoları ile süreyi kısaltırız.',
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
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
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

      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div data-animate="reveal" className="flex items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gold">Kullanım Alanları</div>
              <h2 className="font-heading text-3xl font-semibold text-foreground">
                Sektöre göre doğru çözüm
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                Soğutma sistemleri tek tip değildir. İhtiyaca göre seçilen ekipman ve kontrol
                senaryosu, işletme maliyetini belirler.
              </p>
            </div>
            <Button asChild variant="outline" className="border-border bg-background/80 hover:bg-muted">
              <Link to="/iletisim">Proje Sor</Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2" data-animate="reveal">
            {industries.map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.title} className="border-border bg-card p-7 text-foreground">
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-gold/10 text-gold">
                      <Icon className="size-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-base font-semibold">{item.title}</div>
                      <p className="text-sm leading-6 text-muted-foreground">
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
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            <div data-animate="reveal" className="space-y-4">
              <div className="text-sm font-medium text-gold">Süreç</div>
              <h2 className="font-heading text-3xl font-semibold text-foreground">
                Net adımlar, ölçülebilir sonuç
              </h2>
              <p className="text-sm leading-7 text-muted-foreground md:text-base">
                Keşiften devreye almaya kadar her aşamada ölçüm ve doğrulama ile ilerleriz.
              </p>

              <Card className="border-border bg-gradient-to-b from-muted to-background p-7 text-foreground">
                <div className="grid gap-5">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Örnek kazanım</div>
                    <div className="text-2xl font-semibold">%15–30</div>
                  </div>
                  <Separator className="bg-border" />
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Servis yaklaşımı</div>
                    <div className="text-2xl font-semibold">Planlı</div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid gap-4" data-animate="reveal">
              {processSteps.map((step, idx) => {
                const Icon = step.icon
                return (
                  <Card key={step.title} className="border-border bg-card p-6 text-foreground">
                    <div className="flex items-start gap-4">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-foreground/70">
                        {idx + 1}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-4">
                          <div className="text-base font-semibold">{step.title}</div>
                          <div className="flex size-8 items-center justify-center rounded-lg bg-gold/10 text-gold">
                            <Icon className="size-4" />
                          </div>
                        </div>
                        <p className="text-sm leading-6 text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            <div data-animate="reveal" className="space-y-4">
              <div className="text-sm font-medium text-gold">SSS</div>
              <h2 className="font-heading text-3xl font-semibold text-foreground">
                Sık sorulan sorular
              </h2>
              <p className="text-sm leading-7 text-muted-foreground md:text-base">
                Hızlı bir özet. Daha detaylı bilgi için iletişime geçebilirsiniz.
              </p>
            </div>

            <div data-animate="reveal" className="rounded-2xl border border-border bg-card p-2">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((item, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`}>
                    <AccordionTrigger className="px-4 text-left">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 text-sm leading-6 text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
