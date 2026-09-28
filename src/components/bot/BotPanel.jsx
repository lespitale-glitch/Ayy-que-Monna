import { useEffect, useId, useRef, useState } from 'react'
import { Send, X } from 'lucide-react'
import BotMessage from './BotMessage.jsx'
import { useBot } from '../../hooks/useBot.js'

// Ventana del asistente. No es modal: se puede seguir usando la tienda con el panel abierto.
function BotPanel({ onClose }) {
  const { isReady, messages, send, choose } = useBot()
  const [text, setText] = useState('')
  const titleId = useId()
  const inputRef = useRef(null)
  const endRef = useRef(null)

  // Con llaves y sin "return": un useEffect solo puede devolver una función de limpieza.
  // scrollIntoView() devuelve una Promesa en los navegadores nuevos, y si el efecto la
  // devolviera, React intentaría ejecutarla como limpieza ("l is not a function").

  // Al abrir, el foco va al campo de texto
  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  // Con cada mensaje nuevo, bajamos hasta el final de la conversación
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages])

  const handleSubmit = (event) => {
    event.preventDefault()
    send(text)
    setText('')
  }

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      onKeyDown={(event) => event.key === 'Escape' && onClose()}
      className="fixed inset-x-2 bottom-2 z-40 flex h-[min(34rem,calc(100dvh-1rem))] flex-col overflow-hidden rounded-2xl border border-line bg-bone shadow-lg motion-safe:animate-fade-in sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-96"
    >
      {/* div (no <header>): dentro del panel, un <header> se leería como el encabezado de la página */}
      <div className="flex items-center justify-between gap-4 bg-brand-soft px-5 py-4">
        <div>
          <h2 id={titleId} className="font-display text-lg">
            Asistente <span className="text-gradient">Monna</span>
          </h2>
          <p className="text-xs text-stone">Respuestas al instante</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Cerrar el asistente" className="rounded-full p-2 hover:bg-white">
          <X size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      {/* role="log": los lectores de pantalla leen cada mensaje nuevo sin mover el foco.
          Va en un div que envuelve la lista: así la <ol> sigue siendo una lista. */}
      <div role="log" aria-live="polite" aria-label="Conversación" className="flex-1 overflow-y-auto px-4 py-5">
        <ol className="space-y-4">
          {!isReady && <li className="animate-pulse text-xs uppercase tracking-widest text-stone">Cargando…</li>}
          {messages.map((message) => (
            <BotMessage key={message.id} message={message} onChoose={choose} onNavigate={onClose} />
          ))}
          <li ref={endRef} aria-hidden="true" />
        </ol>
      </div>

      <form onSubmit={handleSubmit} className="border-t border-line bg-white px-3 py-3">
        <div className="flex gap-2">
          <label htmlFor="bot-input" className="sr-only">
            Escribí tu pregunta
          </label>
          <input
            ref={inputRef}
            id="bot-input"
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Escribí tu pregunta…"
            maxLength={300}
            autoComplete="off"
            className="h-11 min-w-0 flex-1 rounded-full border border-line bg-bone px-4 text-sm outline-none focus:border-ink"
          />
          <button type="submit" disabled={!text.trim()} aria-label="Enviar" className="btn-primary h-11 w-11 shrink-0 p-0 disabled:opacity-50">
            <Send size={16} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
        <p className="mt-2 px-2 text-[11px] leading-snug text-stone">
          Si no sé responder, guardo la pregunta de forma anónima para mejorar.
        </p>
      </form>
    </section>
  )
}

export default BotPanel
