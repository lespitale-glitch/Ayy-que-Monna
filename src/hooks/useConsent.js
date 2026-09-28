import { useContext } from 'react'
import { ConsentContext } from '../context/consentContext.js'

// const { consent, choose, reopen } = useConsent()
export function useConsent() {
  const context = useContext(ConsentContext)
  if (!context) throw new Error('useConsent debe usarse dentro de <ConsentProvider>')
  return context
}
