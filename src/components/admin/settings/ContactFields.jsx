import { ExternalLink } from 'lucide-react'
import FormField from '../form/FormField.jsx'
import { fieldA11y, inputClass } from '../form/fieldA11y.js'
import { WHATSAPP_PATTERN, onlyDigits } from '../../../utils/settings.js'
import { buildWhatsAppUrl } from '../../../utils/whatsapp.js'

// WhatsApp (adonde llegan los pedidos) e Instagram
function ContactFields({ values, errors, onField, disabled }) {
  const number = onlyDigits(values.whatsappNumber)
  // El enlace de prueba solo aparece cuando el número tiene un formato válido
  const testUrl = WHATSAPP_PATTERN.test(number) ? buildWhatsAppUrl(number) : null

  return (
    <fieldset className="grid content-start gap-6">
      <legend className="font-display text-2xl">Contacto</legend>

      <FormField
        id="whatsappNumber"
        label="WhatsApp de pedidos"
        hint="Con código de país, sin + ni espacios. Argentina: 549 + área + número (ej: 5491112345678)."
        error={errors.whatsappNumber}
      >
        <input
          {...fieldA11y('whatsappNumber', { error: errors.whatsappNumber, hint: true })}
          type="tel"
          inputMode="numeric"
          autoComplete="off"
          value={values.whatsappNumber}
          onChange={onField('whatsappNumber')}
          required
          disabled={disabled}
          className={`${inputClass} h-12 font-mono`}
        />
      </FormField>
      {testUrl && (
        <a
          href={testUrl}
          target="_blank"
          rel="noreferrer"
          className="-mt-2 inline-flex w-fit items-center gap-2 text-xs uppercase tracking-widest text-fucsia-deep underline-offset-4 hover:underline"
        >
          <ExternalLink size={14} strokeWidth={1.5} aria-hidden="true" />
          Probar este número en WhatsApp
          <span className="sr-only">(se abre en una pestaña nueva)</span>
        </a>
      )}

      <FormField
        id="instagramHandle"
        label="Usuario de Instagram"
        hint="Sin @. Si lo dejas vacío, Instagram no aparece en la tienda."
        error={errors.instagramHandle}
      >
        <div className="flex">
          <span aria-hidden="true" className="flex h-12 items-center border border-r-0 border-line bg-line/30 px-3 text-sm text-stone">
            @
          </span>
          <input
            {...fieldA11y('instagramHandle', { error: errors.instagramHandle, hint: true })}
            type="text"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            value={values.instagramHandle}
            onChange={onField('instagramHandle')}
            disabled={disabled}
            className={`${inputClass} h-12`}
          />
        </div>
      </FormField>
    </fieldset>
  )
}

export default ContactFields
