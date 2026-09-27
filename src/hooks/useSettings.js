import { useContext } from 'react'
import { SettingsContext } from '../context/settingsContext.js'

// const { whatsappNumber, pickupPoints } = useSettings()
export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings debe usarse dentro de <SettingsProvider>')
  }
  return context
}
