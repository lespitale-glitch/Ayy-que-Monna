import { useEffect, useState } from 'react'
import { fetchSettings, updateSettings } from '../services/settingsService.js'
import { getAdminErrorMessage } from '../utils/adminErrors.js'
import { toSettings } from '../utils/settings.js'

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
        if (!ignore) setLoad({ status: 'ready', settings })
      })
      .catch((error) => {
        console.error(error)
        if (!ignore) setLoad({ status: 'error', settings: null })
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
