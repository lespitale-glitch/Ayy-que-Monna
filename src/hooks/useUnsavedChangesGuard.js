import { useEffect } from 'react'
import { useBlocker } from 'react-router-dom'

// Protege cambios sin guardar:
// - dentro del panel, frena la navegación y devuelve un "blocker" para mostrar un diálogo;
// - al cerrar o recargar la pestaña, el navegador muestra su propio aviso.
export function useUnsavedChangesGuard(isDirty) {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => isDirty && currentLocation.pathname !== nextLocation.pathname,
  )

  useEffect(() => {
    if (!isDirty) return
    const warn = (event) => event.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [isDirty])

  return blocker
}
