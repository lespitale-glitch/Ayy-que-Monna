import { useEffect, useMemo, useState } from 'react'
import { SettingsContext } from './settingsContext.js'
import { fetchSettings } from '../services/settingsService.js'
import { DEFAULT_SETTINGS } from '../config.js'
import { applyTheme } from '../utils/theme.js'

// Ajustes de la tienda (WhatsApp, Instagram, envíos) compartidos con toda la tienda.
// A diferencia del catálogo, no bloquean la página: los textos usan los valores por
// defecto mientras cargan. Lo único que espera a "ready" es el botón de WhatsApp,
// para no mandar nunca un pedido a un número viejo.
export function SettingsProvider({ children }) {
  // status: 'loading' | 'ready' | 'error'
  const [state, setState] = useState({ status: 'loading', settings: DEFAULT_SETTINGS })

  useEffect(() => {
    let ignore = false
    fetchSettings()
      .then((settings) => {
        if (ignore) return
        setState({ status: 'ready', settings })
        // Colores de la marca → variables CSS en <html> (sin pedir nada extra: vienen con los ajustes)
        applyTheme(settings)
      })
      .catch((error) => {
        if (ignore) return // ya se salió de la página: no es un error real
        console.error('No se pudieron cargar los ajustes:', error)
        setState((prev) => ({ ...prev, status: 'error' }))
      })
    return () => {
      ignore = true
    }
  }, [])

  // Aplanamos: useSettings() devuelve { status, whatsappNumber, pickupPoints, … }
  const value = useMemo(() => ({ status: state.status, ...state.settings }), [state])

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}
