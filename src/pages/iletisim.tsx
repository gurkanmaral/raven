import { useLayoutEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import gsap from 'gsap'
import { Mail, MapPin, Phone } from 'lucide-react'
import { toast } from 'sonner'
import emailjs from '@emailjs/browser'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function IletisimPage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting) return

    const publicKey = import.meta.env?.VITE_EMAILJS_PUBLIC_KEY
    const serviceId = import.meta.env?.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env?.VITE_EMAILJS_TEMPLATE_ID

    const missing = [
      !publicKey ? 'VITE_EMAILJS_PUBLIC_KEY' : null,
      !serviceId ? 'VITE_EMAILJS_SERVICE_ID' : null,
      !templateId ? 'VITE_EMAILJS_TEMPLATE_ID' : null,
    ].filter((v): v is string => Boolean(v))

    if (missing.length > 0) {
      toast.error(`EmailJS ayarları eksik: ${missing.join(', ')}`)
      return
    }

    setIsSubmitting(true)
    try {
      if (!formRef.current) {
        throw new Error('Form not found')
      }

      await emailjs.sendForm(serviceId, templateId, formRef.current, publicKey)
      toast.success('Mesajınız alındı. En kısa sürede dönüş yapacağız.')
      formRef.current.reset()
    } catch {
      toast.error('Mesaj gönderilemedi. Lütfen tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div ref={rootRef} className="bg-background">
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="max-w-3xl">
            <div data-animate="in" className="text-sm font-medium text-gold">
              İletişim
            </div>
            <h1
              data-animate="in"
              className="mt-3 font-heading text-4xl font-semibold leading-tight text-foreground md:text-5xl"
            >
              Projenizi konuşalım.
            </h1>
            <p data-animate="in" className="mt-4 text-base leading-7 text-muted-foreground">
              Ürünler, proje kapsamı veya yalnızca ihtiyaçlarınızı yazın. Raven Global
              ekibi size hızlıca dönüş yapar.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
          <Card
            data-animate="in"
            className="border-border bg-card p-8 text-foreground"
          >
            <div className="font-heading text-xl font-semibold">İletişim Bilgileri</div>
            <div className="mt-6 space-y-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Mail className="size-4 text-gold" />
                <span>info@ravenglobal.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="size-4 text-gold" />
                <span>+90 (000) 000 00 00</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="size-4 text-gold" />
                <span>Türkiye</span>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-border bg-muted p-5">
              <div className="text-sm font-medium text-foreground">Çalışma Saatleri</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Hafta içi 09:00–18:00
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Acil servis: 7/24 (projeye göre)
              </div>
            </div>
          </Card>

          <Card
            data-animate="in"
            className="border-border bg-card p-8 text-foreground"
          >
            <div className="font-heading text-xl font-semibold">Mesaj Gönder</div>
            <form ref={formRef} onSubmit={onSubmit} className="mt-6 grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-foreground/80">
                  Ad Soyad
                </Label>
                <Input
                  id="name"
                  name="from_name"
                  required
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground"
                  placeholder="Adınız Soyadınız"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-foreground/80">
                  E-posta
                </Label>
                <Input
                  id="email"
                  name="reply_to"
                  type="email"
                  required
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground"
                  placeholder="ornek@firma.com"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message" className="text-foreground/80">
                  Mesaj
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground"
                  placeholder="İhtiyacınızı kısaca anlatın..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gold text-black hover:bg-gold/90"
              >
                {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </div>
  )
}
