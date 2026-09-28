import { useId } from 'react'
import { useConsent } from '../../hooks/useConsent.js'
import { useSettings } from '../../hooks/useSettings.js'
import { hasAnalytics, trackerNames } from '../../utils/consent.js'

// Aviso de cookies. Aparece solo si hay algo para medir (IDs en Ajustes) y la visita todavía
// no eligió, o si pidió cambiar su elección desde el pie de página.
// No roba el foco: está primero en el HTML, así el teclado y los lectores de pantalla llegan enseguida.
function CookieBanner() {
  const settings = useSettings()
  const { consent, isReopened, choose } = useConsent()
  const titleId = useId()

  if (settings.status !== 'ready' || !hasAnalytics(settings)) return null
  if (consent !== null && !isReopened) return null

  return (
    <section
      aria-labelledby={titleId}
      className="fixed inset-x-2 bottom-2 z-[45] rounded-2xl border border-line bg-white p-5 shadow-lg sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-md"
    >
      <h2 id={titleId} className="font-display text-lg">
        ¿Nos ayudás a mejorar la tienda?
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-stone">
        Usamos cookies de {trackerNames(settings)} para saber qué productos se miran más y cómo llegás a la tienda.
        Solo se activan si aceptás, y podés cambiar tu elección cuando quieras desde el pie de página.
      </p>
      {/* Los dos botones con el mismo tamaño: aceptar no tiene que ser más fácil que rechazar */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" onClick={() => choose('denied')} className="btn-outline h-11 px-3">
          Rechazar
        </button>
        <button type="button" onClick={() => choose('granted')} className="btn-primary h-11 px-3">
          Aceptar
        </button>
      </div>
    </section>
  )
}

export default CookieBanner
