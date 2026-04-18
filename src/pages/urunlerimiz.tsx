import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { Box, FileText, Layers } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

type Product = {
  id: number
  documentId?: string
  title?: string
  slug?: string
  shortDescription?: string | null
  description?: unknown
  category?: string | null
  featured?: boolean | null
  sortOrder?: number | null
  tags?: unknown
  images?: unknown
}

const getStrapiUrl = () => {
  const meta = import.meta as unknown as {
    env?: Record<string, string | undefined>
  }
  const fromEnv = meta.env?.VITE_STRAPI_URL
  const base =
    typeof fromEnv === 'string' && fromEnv.length > 0
      ? fromEnv
      : 'http://localhost:1337'
  return base.endsWith('/') ? base.slice(0, -1) : base
}

const STRAPI_URL = getStrapiUrl()

const unsplashByCategory: Record<string, string> = {
  'Chiller Sistemleri': 'https://images.unsplash.com/photo-1760378105099-968c06b9b4bd',
  'HVAC Çözümleri': 'https://images.unsplash.com/photo-1700124113583-81aa99ea2aa2',
  'Özel Projeler': 'https://images.unsplash.com/photo-1741205211851-4fbbb1f4e132',
}

const placeholderImage = (category: string | null | undefined, width: number, height: number) => {
  const base =
    (category ? unsplashByCategory[category] : undefined) ??
    unsplashByCategory['HVAC Çözümleri']
  const url = new URL(base)
  url.searchParams.set('auto', 'format')
  url.searchParams.set('fit', 'crop')
  url.searchParams.set('w', String(width))
  url.searchParams.set('h', String(height))
  url.searchParams.set('q', '80')
  url.searchParams.set('crop', 'entropy')
  url.searchParams.set('cs', 'srgb')
  return url.toString()
}

const categories = [
  { icon: Box, title: 'Chiller Sistemleri' },
  { icon: Layers, title: 'HVAC Çözümleri' },
  { icon: FileText, title: 'Özel Projeler' },
]

export default function UrunlerimizPage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      try {
        setError(null)
        setIsLoading(true)

        const res = await fetch(
          `${STRAPI_URL}/api/products?populate=*&sort[0]=sortOrder:asc&sort[1]=createdAt:desc`,
          { signal: controller.signal },
        )

        if (!res.ok) {
          throw new Error(`Strapi error: ${res.status}`)
        }

        const json = (await res.json()) as { data?: unknown }
        const data = Array.isArray((json as { data?: unknown }).data)
          ? ((json as { data: unknown[] }).data as Product[])
          : []

        setProducts(data)
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return
        setError('Ürünler alınamadı. Strapi çalışıyor mu? (http://localhost:1337)')
      } finally {
        setIsLoading(false)
      }
    }

    void load()
    return () => controller.abort()
  }, [])

  const productsByCategory = useMemo(() => {
    const map = new Map<string, Product[]>()
    for (const c of categories) map.set(c.title, [])

    for (const p of products) {
      const key = p.category ?? 'Özel Projeler'
      const list = map.get(key) ?? []
      list.push(p)
      map.set(key, list)
    }

    for (const [key, list] of map.entries()) {
      list.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      map.set(key, list)
    }

    return map
  }, [products])

  return (
    <div ref={rootRef} className="bg-background">
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="max-w-3xl">
            <div data-animate="in" className="text-sm font-medium text-gold">
              Ürünlerimiz
            </div>
            <h1
              data-animate="in"
              className="mt-3 font-heading text-4xl font-semibold leading-tight text-foreground md:text-5xl"
            >
              Ürünler
            </h1>
            <p data-animate="in" className="mt-4 text-base leading-7 text-muted-foreground">
              Ürünleri Strapi üzerinden yönetin, bu sayfada otomatik olarak listelensin.
            </p>
            <div data-animate="in" className="mt-6 flex flex-wrap gap-2">
              <Badge className="bg-gold/10 text-gold hover:bg-gold/10">Premium</Badge>
              <Badge className="bg-gold/10 text-gold hover:bg-gold/10">Modüler</Badge>
              <Badge className="bg-gold/10 text-gold hover:bg-gold/10">
                Servis Destekli
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-4 md:grid-cols-3" data-animate="in">
          {categories.map((item) => {
            const Icon = item.icon
            const list = productsByCategory.get(item.title) ?? []
            const note = isLoading
              ? 'Yükleniyor...'
              : error
                ? error
                : list.length === 0
                  ? 'Henüz ürün yok'
                  : `${list.length} ürün`

            return (
              <Card
                key={item.title}
                className="border-border bg-card p-6 text-foreground"
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-gold/10 text-gold">
                    <Icon className="size-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-semibold">{item.title}</div>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{note}</p>
                    <Separator className="my-4 bg-border" />
                    <div className="grid gap-3">
                      {list.slice(0, 6).map((p) => {
                        const key = p.documentId ?? p.id
                        const url = p.slug ? `/urunlerimiz/${p.slug}` : null

                        const content = (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex min-w-0 items-center gap-3">
                                <img
                                  src={(() => {
                                    const raw = (p as Product).images as unknown
                                    const urls: string[] = []

                                    const pickUrl = (t: unknown) => {
                                      if (typeof t !== 'object' || t === null) return
                                      const record = t as Record<string, unknown>
                                      const url =
                                        record['url'] ??
                                        (typeof record['attributes'] === 'object' &&
                                        record['attributes'] !== null
                                          ? (record['attributes'] as Record<string, unknown>)[
                                              'url'
                                            ]
                                          : undefined)
                                      if (typeof url === 'string') urls.push(url)
                                    }

                                    if (Array.isArray(raw)) {
                                      for (const t of raw) pickUrl(t)
                                    } else if (typeof raw === 'object' && raw !== null) {
                                      const record = raw as Record<string, unknown>
                                      const data = record['data']
                                      if (Array.isArray(data)) {
                                        for (const t of data) pickUrl(t)
                                      } else if (
                                        typeof data === 'object' &&
                                        data !== null
                                      ) {
                                        pickUrl(data)
                                      }
                                    }

                                    const first = urls[0]
                                    if (!first) {
                                      return placeholderImage(p.category, 120, 120)
                                    }
                                    return first.startsWith('http')
                                      ? first
                                      : `${STRAPI_URL}${first}`
                                  })()}
                                  alt={p.title ?? 'Ürün'}
                                  className="size-10 rounded-md border border-border bg-muted object-cover"
                                  loading="lazy"
                                />
                                <div className="truncate text-sm font-medium">
                                  {p.title ?? 'İsimsiz ürün'}
                                </div>
                              </div>
                              {p.featured ? (
                                <Badge className="bg-gold/10 text-gold hover:bg-gold/10">
                                  Öne Çıkan
                                </Badge>
                              ) : null}
                            </div>
                            {p.shortDescription ? (
                              <div className="text-xs leading-5 text-muted-foreground">
                                {p.shortDescription}
                              </div>
                            ) : null}
                            {(() => {
                              const raw = (p as Product).tags as unknown
                              const names: string[] = []

                              const pickName = (t: unknown) => {
                                if (typeof t !== 'object' || t === null) return
                                const record = t as Record<string, unknown>
                                const name =
                                  record['name'] ??
                                  (typeof record['attributes'] === 'object' &&
                                  record['attributes'] !== null
                                    ? (record['attributes'] as Record<string, unknown>)[
                                        'name'
                                      ]
                                    : undefined)
                                if (typeof name === 'string') names.push(name)
                              }

                              if (Array.isArray(raw)) {
                                for (const t of raw) pickName(t)
                              } else if (typeof raw === 'object' && raw !== null) {
                                const record = raw as Record<string, unknown>
                                const data = record['data']
                                if (Array.isArray(data)) {
                                  for (const t of data) pickName(t)
                                }
                              }

                              if (names.length === 0) return null

                              return (
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {names.slice(0, 4).map((name) => (
                                    <Badge
                                      key={name}
                                      className="bg-muted text-xs text-foreground/70 hover:bg-muted"
                                    >
                                      {name}
                                    </Badge>
                                  ))}
                                  {names.length > 4 ? (
                                    <div className="text-xs text-muted-foreground">
                                      +{names.length - 4}
                                    </div>
                                  ) : null}
                                </div>
                              )
                            })()}
                          </div>
                        )

                        return url ? (
                          <Link
                            key={key}
                            to={url}
                            className="-m-2 block rounded-lg p-2 hover:bg-muted/60"
                          >
                            {content}
                          </Link>
                        ) : (
                          <div key={key} className="-m-2 rounded-lg p-2">
                            {content}
                          </div>
                        )
                      })}
                      {list.length > 6 ? (
                        <div className="text-xs text-muted-foreground">
                          +{list.length - 6} ürün daha
                        </div>
                      ) : null}
                      {!isLoading && !error && list.length === 0 ? (
                        <div className="h-20 rounded-lg bg-muted" />
                      ) : null}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <div
          data-animate="in"
          className="mt-12 rounded-2xl border border-border bg-card p-8 md:p-10"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-medium text-gold">Sonraki adım</div>
              <div className="mt-2 font-heading text-2xl font-semibold text-foreground">
                Ürünleri gönderin, sayfayı tamamlayalım.
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Katalog PDF, fiyat listesi veya sadece ürün isimleri yeterli.
              </p>
            </div>
            <Button asChild className="bg-gold text-black hover:bg-gold/90">
              <Link to="/iletisim">Ürünleri Paylaş</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
