import FormField from '../form/FormField.jsx'
import { fieldA11y, inputClass } from '../form/fieldA11y.js'
import { LIMITS } from '../../../utils/heroSlideForm.js'

const CUSTOM = 'otra'

// A dónde lleva el botón: una página de la tienda (lista) u "Otra dirección" escrita a mano
function LinkPicker({ value, options, onChange, error, disabled }) {
  const isKnown = options.some((o) => o.value === value)
  const selected = isKnown ? value : CUSTOM

  return (
    <div className="grid gap-4">
      <FormField id="ctaLink" label="El botón lleva a" error={selected === CUSTOM ? undefined : error}>
        <select
          {...fieldA11y('ctaLink', { error: selected === CUSTOM ? undefined : error })}
          value={selected}
          onChange={(e) => onChange(e.target.value === CUSTOM ? '' : e.target.value)}
          disabled={disabled}
          className={`${inputClass} h-12`}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
          <option value={CUSTOM}>Otra dirección…</option>
        </select>
      </FormField>
      {selected === CUSTOM && (
        <FormField
          id="ctaLinkCustom"
          label="Dirección"
          hint='Una página de la tienda (ej: "/producto/aros-luna") o un enlace que empiece con https://'
          error={error}
        >
          <input
            {...fieldA11y('ctaLinkCustom', { error, hint: true })}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            maxLength={LIMITS.ctaLink}
            spellCheck={false}
            autoCapitalize="none"
            disabled={disabled}
            className={`${inputClass} h-12 font-mono`}
          />
        </FormField>
      )}
    </div>
  )
}

export default LinkPicker
