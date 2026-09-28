import { useMemo, useState } from 'react'
import { buildFaqIndex, classifyMatch, matchFaqs } from '../../../utils/bot/faqMatcher.js'

const VERDICT = {
  sure: 'El asistente respondería directamente:',
  maybe: 'El asistente no está seguro y ofrecería elegir entre:',
  none: 'El asistente no sabría responder con las preguntas frecuentes (buscaría productos o guardaría la pregunta).',
}

// Probador: escribí una pregunta como la haría una clienta y mirá qué contestaría el bot.
// Solo tiene en cuenta las preguntas VISIBLES (las ocultas el bot no las usa).
function BotTester({ faqs }) {
  const [text, setText] = useState('')
  const index = useMemo(() => buildFaqIndex(faqs.filter((f) => f.isVisible)), [faqs])
  const { level, results } = classifyMatch(matchFaqs(index, text))
  const shown = level === 'sure' ? results.slice(0, 1) : level === 'maybe' ? results.slice(0, 3) : []

  return (
    <section aria-labelledby="tester-title" className="self-start rounded-2xl border border-line bg-white p-6">
      <h2 id="tester-title" className="font-display text-2xl">Probar el asistente</h2>
      <p className="mt-2 text-sm text-stone">
        Escribí una pregunta como la haría una clienta. Si no encuentra la respuesta correcta, agregale palabras clave.
      </p>
      <label htmlFor="tester-input" className="mt-4 block text-xs uppercase tracking-widest">
        Pregunta de prueba
      </label>
      <input
        id="tester-input"
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Ej: ¿mandan por correo?"
        className="mt-2 h-11 w-full border border-line bg-bone px-4 text-sm outline-none focus:border-ink"
      />
      {/* aria-live: el resultado se anuncia mientras se escribe, sin mover el foco */}
      <div aria-live="polite" className="mt-4 text-sm">
        {text.trim() && (
          <>
            <p>{VERDICT[level]}</p>
            <ul className="mt-2 space-y-1">
              {shown.map(({ faq, score }) => (
                <li key={faq.id} className="flex justify-between gap-4 border-l-2 border-fucsia pl-3">
                  <span>{faq.question}</span>
                  <span className="shrink-0 text-xs tabular-nums text-stone">puntaje {score.toFixed(1)}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  )
}

export default BotTester
