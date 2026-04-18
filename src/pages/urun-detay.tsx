import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import gsap from 'gsap'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import heroImage from '@/assets/hero.png'
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

const pickMediaUrl = (raw: unknown): string | null => {
  const urls: string[] = []

  const pickUrl = (t: unknown) => {
    if (typeof t !== 'object' || t === null) return
    const record = t as Record<string, unknown>
    const url =
      record['url'] ??
      (typeof record['attributes'] === 'object' && record['attributes'] !== null
        ? (record['attributes'] as Record<string, unknown>)['url']
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
    } else if (typeof data === 'object' && data !== null) {
      pickUrl(data)
    }
  }

  const first = urls[0]
  if (!first) return null
  return first.startsWith('http') ? first : `${STRAPI_URL}${first}`
}

const pickTagNames = (raw: unknown): string[] => {
  const names: string[] = []

  const pickName = (t: unknown) => {
    if (typeof t !== 'object' || t === null) return
    const record = t as Record<string, unknown>
    const name =
      record['name'] ??
      (typeof record['attributes'] === 'object' && record['attributes'] !== null
        ? (record['attributes'] as Record<string, unknown>)['name']
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

  return names
}

export default function UrunDetayPage() {
  const { slug } = useParams<{ slug: string }>()
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
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
  }, [slug])

  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      try {
        setError(null)
        setIsLoading(true)

        if (!slug) {
          setProduct(null)
          return
        }

        const res = await fetch(
          `${STRAPI_URL}/api/products?populate=*&filters[slug][$eq]=${encodeURIComponent(slug)}`,
          { signal: controller.signal },
        )

        if (!res.ok) {
          throw new Error(`Strapi error: ${res.status}`)
        }

        const json = (await res.json()) as { data?: unknown }
        const list = Array.isArray(json.data) ? (json.data as Product[]) : []
        setProduct(list[0] ?? null)
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return
        setError('Ürün detayları alınamadı. Strapi çalışıyor mu? (http://localhost:1337)')
      } finally {
        setIsLoading(false)
      }
    }

    void load()
    return () => controller.abort()
  }, [slug])

  const imageUrl = useMemo(() => {
    if (!product) return heroImage
    return pickMediaUrl(product.images) ?? heroImage
  }, [product])

  const tagNames = useMemo(() => {
    if (!product) return []
    return pickTagNames(product.tags)
  }, [product])

  return (
    <div ref={rootRef} className="bg-background">
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <div data-animate="in" className="flex items-center justify-between gap-4">
            <Button asChild variant="outline" className="border-border">
              <Link to="/urunlerimiz">
                <ArrowLeft className="mr-2 size-4" />
                Ürünlere Dön
              </Link>
            </Button>
            <Button asChild className="bg-gold text-black hover:bg-gold/90">
              <Link to="/iletisim">
                Teklif Al <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-10 max-w-3xl">
            <div data-animate="in" className="text-sm font-medium text-gold">
              {product?.category ?? 'Ürün'}
            </div>
            <h1
              data-animate="in"
              className="mt-3 font-heading text-4xl font-semibold leading-tight text-foreground md:text-5xl"
            >
              {isLoading ? 'Yükleniyor...' : product?.title ?? 'Ürün bulunamadı'}
            </h1>
            {product?.shortDescription ? (
              <p
                data-animate="in"
                className="mt-4 text-base leading-7 text-muted-foreground"
              >
                {product.shortDescription}
              </p>
            ) : null}

            {tagNames.length ? (
              <div data-animate="in" className="mt-6 flex flex-wrap gap-2">
                {tagNames.map((name) => (
                  <Badge key={name} className="bg-gold/10 text-gold hover:bg-gold/10">
                    {name}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        {error ? (
          <Card data-animate="in" className="border-border bg-card p-8 text-foreground">
            <div className="font-heading text-xl font-semibold">Hata</div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{error}</p>
          </Card>
        ) : !isLoading && !product ? (
          <Card data-animate="in" className="border-border bg-card p-8 text-foreground">
            <div className="font-heading text-xl font-semibold">Ürün bulunamadı</div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Ürün yayında olmayabilir ya da link yanlış olabilir.
            </p>
          </Card>
        ) : (
          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-start">
            <div data-animate="in" className="overflow-hidden rounded-2xl border border-border">
              <img
                src={imageUrl}
                alt={product?.title ?? 'Ürün'}
                className="aspect-[4/3] w-full bg-muted object-cover"
                loading="lazy"
              />
            </div>

            <Card data-animate="in" className="border-border bg-card p-8 text-foreground">
              <div className="font-heading text-xl font-semibold">Özet</div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {product?.shortDescription ??
                  'Bu ürün için kısa açıklama ekleyebilirsiniz. Strapi üzerinden kolayca güncellenir.'}
              </p>
              <Separator className="my-6 bg-border" />
              <div className="grid gap-3">
                <div className="text-sm font-medium">Öne çıkanlar</div>
                <div className="flex flex-wrap gap-2">
                  {(tagNames.length ? tagNames : ['Premium', 'Modüler', 'Servis Destekli']).map(
                    (name) => (
                      <Badge
                        key={name}
                        className="bg-muted text-foreground/70 hover:bg-muted"
                      >
                        {name}
                      </Badge>
                    ),
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </section>
    </div>
  )
}
