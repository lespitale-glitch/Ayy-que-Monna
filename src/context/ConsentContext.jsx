import { useMemo, useState } from 'react'
import { ConsentContext } from './consentContext.js'
import { readConsent, saveConsent } from '../utils/consent.js'

// Comparte la elección de cookies entre el aviso, el pie de página y AnalyticsManager
export function ConsentProvider({ children }) {
  const [consent, setConsentState] = useState(readConsent) // 'granted' | 'denied' | null
  const [isReopened, setIsReopened] = useState(false) // "Preferencias de cookies" en el footer

  const value = useMemo(
    () => ({
      consent,
      isReopened,
      choose: (choice) => {
        saveConsent(choice)
        setConsentState(choice)
        setIsReopened(false)
      },
      reopen: () => setIsReopened(true),
    }),
    [consent, isReopened],
  )

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
}
