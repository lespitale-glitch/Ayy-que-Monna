import FormField from '../form/FormField.jsx'
import { fieldA11y, inputClass } from '../form/fieldA11y.js'
import { HEX_PATTERN, normalizeHex } from '../../../utils/theme.js'

// Un color: el selector del navegador (cuadradito) + el código escrito (para pegar uno exacto).
// Los dos muestran el mismo valor; el que tiene id (y recibe el foco desde el resumen de errores) es el de texto.
function ColorInput({ id, label, value, error, setField, disabled }) {
  const hex = normalizeHex(value)
  // <input type="color"> solo acepta "#rrggbb" en minúsculas: mientras el texto sea inválido, muestra negro
  const pickerValue = HEX_PATTERN.test(hex) ? hex.toLowerCase() : '#000000'

  return (
    <FormField id={id} label={label} hint="Elígelo con el cuadrado o escribe el código (ej: #C2410C)." error={error}>
      <div className="flex gap-2">
        <input
          type="color"
          value={pickerValue}
          onChange={(event) => setField(id, event.target.value.toUpperCase())}
          aria-label={`${label}: selector`}
          disabled={disabled}
          className="h-12 w-14 shrink-0 cursor-pointer border border-line bg-white p-1 disabled:cursor-wait"
        />
        <input
          {...fieldA11y(id, { error, hint: true })}
          type="text"
          value={value}
          onChange={(event) => setField(id, event.target.value)}
          maxLength={9}
          autoCapitalize="characters"
          spellCheck={false}
          disabled={disabled}
          className={`${inputClass} h-12 font-mono`}
        />
      </div>
    </FormField>
  )
}

export default ColorInput
