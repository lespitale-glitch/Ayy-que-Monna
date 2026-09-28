import { lazy, Suspense, useRef, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useSettings } from '../../hooks/useSettings.js'

// El panel (y el motor del bot) se descargan recién la primera vez que alguien toca "Ayuda":
// así no suman peso a la carga inicial de la tienda.
const BotPanel = lazy(() => import('./BotPanel.jsx'))

function BotLauncher() {
  const { botEnabled } = useSettings()
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef(null)

  if (!botEnabled) return null

  const close = () => {
    setIsOpen(false)
    // El foco vuelve al botón que abrió el panel
    requestAnimationFrame(() => buttonRef.current?.focus())
  }

  return (
    <>
      {!isOpen && (
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(true)}
          aria-haspopup="dialog"
          className="btn-primary fixed bottom-4 right-4 z-40 h-12 px-4 shadow-md sm:bottom-6 sm:right-6 sm:px-5"
        >
          <MessageCircle size={18} strokeWidth={1.5} aria-hidden="true" />
          Ayuda
        </button>
      )}
      {isOpen && (
        <Suspense
          fallback={
            <p role="status" className="fixed bottom-6 right-6 z-40 rounded-full bg-white px-5 py-3 text-xs uppercase tracking-widest text-stone shadow-md">
              Abriendo…
            </p>
          }
        >
          <BotPanel onClose={close} />
        </Suspense>
      )}
    </>
  )
}

export default BotLauncher
