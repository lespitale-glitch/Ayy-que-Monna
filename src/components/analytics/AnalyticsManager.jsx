import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useConsent } from '../../hooks/useConsent.js'
import { useSettings } from '../../hooks/useSettings.js'
import { disableAnalytics, enableAnalytics, trackPageView } from '../../lib/analytics.js'

// No dibuja nada: enciende o apaga la analítica según la elección de cookies.
// Vive dentro del Layout de la tienda; al entrar al panel se desmonta y deja de medir.
function AnalyticsManager() {
  const { consent } = useConsent()
  const { status, ga4Id, metaPixelId } = useSettings()
  const { pathname } = useLocation()
  const canTrack = consent === 'granted' && status === 'ready' && Boolean(ga4Id || metaPixelId)

  useEffect(() => {
    if (!canTrack) {
      disableAnalytics()
      return
    }
    enableAnalytics({ ga4Id, metaPixelId })
    // La función de limpieza corre al desmontar (por ejemplo, al ir a /admin) o si cambia algo
    return () => disableAnalytics()
  }, [canTrack, ga4Id, metaPixelId])

  // Una página vista por cada cambio de dirección (solo se envía si la analítica está activa)
  useEffect(() => {
    if (canTrack) trackPageView()
  }, [pathname, canTrack])

  return null
}

export default AnalyticsManager
