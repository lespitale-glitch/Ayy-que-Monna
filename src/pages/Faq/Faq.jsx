import { ChevronDown, MessageCircle } from 'lucide-react'
import { useFaqs } from '../../hooks/useFaqs.js'
import { useSettings } from '../../hooks/useSettings.js'
import { fillAnswer } from '../../utils/faqText.js'
import { buildFaqSchema, toJsonLd } from '../../utils/faqSchema.js'
import { whatsappFor } from '../../utils/bot/botMessages.js'

// /preguntas-frecuentes: las mismas preguntas que usa el asistente, pensadas también para Google
function Faq() {
  const { status, faqs } = useFaqs()
  const settings = useSettings()
  const whatsappUrl = whatsappFor(settings)

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      {/* React 19 lleva <title> y <meta> al <head> automáticamente */}
      <title>Preguntas frecuentes — Ayy Que Monna</title>
      <meta name="description" content="Envíos, medios de pago, materiales y cuidados de la bijouterie Ayy Que Monna." />
      {status === 'ready' && faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(buildFaqSchema(faqs, settings)) }} />
      )}

      <header className="text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-fucsia-deep">Ayuda</p>
        <h1 className="mt-3 text-4xl md:text-5xl">
          Preguntas <span className="text-gradient">frecuentes</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-stone">Todo lo que necesitás saber antes de comprar.</p>
      </header>

      {status === 'loading' && (
        <p role="status" className="mt-16 animate-pulse text-center text-xs uppercase tracking-widest text-stone">
          Cargando…
        </p>
      )}
      {status === 'error' && (
        <p role="alert" className="mt-16 text-center text-sm">
          No pudimos cargar las preguntas. Recargá la página en unos segundos.
        </p>
      )}

      {/* <details> y <summary>: acordeón nativo, accesible con teclado y lector de pantalla sin JS extra */}
      <div className="mt-12 space-y-3">
        {faqs.map((faq) => (
          <details key={faq.id} className="group rounded-2xl border border-line bg-white open:border-fucsia">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 [&::-webkit-details-marker]:hidden">
              <h2 className="font-sans text-base font-normal">{faq.question}</h2>
              <ChevronDown
                size={18}
                strokeWidth={1.5}
                aria-hidden="true"
                className="shrink-0 text-fucsia-deep transition-transform duration-300 ease-soft group-open:rotate-180"
              />
            </summary>
            <p className="px-6 pb-6 text-sm leading-relaxed text-stone">{fillAnswer(faq.answer, settings)}</p>
          </details>
        ))}
      </div>

      <aside className="mt-16 rounded-2xl bg-brand-soft px-6 py-10 text-center">
        <h2 className="font-display text-2xl">¿No encontraste tu respuesta?</h2>
        <p className="mt-3 text-sm text-stone">Escribinos y te respondemos a la brevedad.</p>
        {whatsappUrl && (
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6">
            <MessageCircle size={16} strokeWidth={1.5} aria-hidden="true" />
            Escribir por WhatsApp
          </a>
        )}
      </aside>
    </section>
  )
}

export default Faq
