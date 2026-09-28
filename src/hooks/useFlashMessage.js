import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// Mensaje que deja un formulario al guardar: navigate(ruta, { state: { flash: '…' } }).
// Lo leemos una vez y lo borramos del historial para que no vuelva a aparecer al recargar.
// Devuelve { type, text } o null.
export function useFlashMessage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [flash] = useState(location.state?.flash ?? null)
  const [flashType] = useState(location.state?.flashType ?? 'success')

  useEffect(() => {
    if (location.state?.flash) navigate(location.pathname, { replace: true, state: null })
  }, [location, navigate])

  return flash ? { type: flashType, text: flash } : null
}
