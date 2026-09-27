import { useEffect, useLayoutEffect, useRef } from 'react'
import SearchPanel from './SearchPanel.jsx'

// Ventana emergente cuadrada y centrada, con el <dialog> nativo del navegador:
// mantiene el foco adentro, se cierra con Escape y oscurece el fondo.
function SearchModal({ open, onClose }) {
  const dialogRef = useRef(null)

  // useLayoutEffect corre ANTES que los efectos de los hijos: así el diálogo ya
  // está abierto cuando SearchPanel pone el foco en el campo de texto.
  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // Mientras está abierto, la página de fondo no se desplaza
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-label="Buscador de productos"
      onCancel={(event) => {
        event.preventDefault() // Escape: cerramos a través del estado de React
        onClose()
      }}
      // Clic en el fondo oscuro (fuera del contenido) cierra
      onClick={(event) => event.target === dialogRef.current && onClose()}
      className="h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-none overflow-hidden rounded-3xl bg-bone p-0 text-ink backdrop:bg-ink/40 backdrop:backdrop-blur-sm md:h-[min(46rem,90vh)] md:w-[min(46rem,90vh)]"
    >
      {open && <SearchPanel onClose={onClose} />}
    </dialog>
  )
}

export default SearchModal
