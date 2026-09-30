import { useEffect, useState } from 'react'
import { fetchSettings, updateSettings } from '../services/settingsService.js'
import { getAdminErrorMessage } from '../utils/adminErrors.js'
import { toSettings } from '../utils/settings.js'
import { applyTheme } from '../utils/theme.js'

// Carga y guarda los ajustes de la tienda en /admin/ajustes
export function useSettingsEditor() {
  // status: 'loading' | 'ready' | 'error'
  const [load, setLoad] = useState({ status: 'loading', settings: null })
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  // Sube en cada guardado: el formulario lo usa como "key" para reiniciarse con lo guardado
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let ignore = false
    fetchSettings()
      .then((settings) => {
        if (ignore) return
        setLoad({ status: 'ready', settings })
        applyTheme(settings) // el panel también usa los colores guardados
      })
      .catch((error) => {
        if (ignore) return // ya se salió de la página: no es un error real
        console.error(error)
        setLoad({ status: 'error', settings: null })
      })
    return () => {
      ignore = true
    }
  }, [])

  // Devuelve true si se guardó; si falla, el mensaje queda en saveError
  const save = async (values) => {
    setSaveError(null)
    setIsSaving(true)
    try {
      const settings = await updateSettings(toSettings(values))
      setLoad({ status: 'ready', settings })
      // Los colores nuevos se ven al instante en el panel (en la tienda, al recargar)
      applyTheme(settings)
      setVersion((v) => v + 1)
      return true
    } catch (error) {
      console.error(error)
      setSaveError(getAdminErrorMessage(error))
      return false
    } finally {
      setIsSaving(false)
    }
  }

  return { ...load, isSaving, saveError, version, save }
}
