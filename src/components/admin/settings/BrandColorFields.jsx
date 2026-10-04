import ColorInput from './ColorInput.jsx'
import BrandPreview from './BrandPreview.jsx'
import { THEME_PRESETS, normalizeHex, pairError } from '../../../utils/theme.js'

// Colores de la marca: los dos tonos del degradado de los botones principales y de los textos destacados
// El aviso de la combinación (muy claro + muy oscuro) aparece en vivo; el de formato, recién al guardar
// (mientras se escribe un código siempre está incompleto).
function BrandColorFields({ values, errors, setField, disabled }) {
  const from = normalizeHex(values.brandColorFrom)
  const to = normalizeHex(values.brandColorTo)

  const choosePreset = (preset) => {
    setField('brandColorFrom', preset.from)
    setField('brandColorTo', preset.to)
  }

  return (
    <fieldset className="grid content-start gap-6">
      <legend className="font-display text-2xl">Colores de la marca</legend>
      <p className="-mt-2 text-xs text-stone">
        Degradado de los botones principales y de las palabras destacadas de los títulos. Puede ser cualquier
        color: si es claro, las letras del botón se ponen negras y los textos destacados usan un tono más oscuro
        del mismo color, para que siempre se lean.
      </p>

      <div>
        <p id="theme-presets" className="text-xs uppercase tracking-widest">
          Combinaciones listas
        </p>
        <ul aria-labelledby="theme-presets" className="mt-3 flex flex-wrap gap-2">
          {THEME_PRESETS.map((preset) => {
            const isCurrent = preset.from === from && preset.to === to
            return (
              <li key={preset.id}>
                <button
                  type="button"
                  onClick={() => choosePreset(preset)}
                  // aria-pressed: el lector de pantalla anuncia cuál está elegida
                  aria-pressed={isCurrent}
                  disabled={disabled}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs disabled:opacity-50 ${
                    isCurrent ? 'border-ink bg-white' : 'border-line hover:border-ink'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="h-4 w-8 rounded-full"
                    style={{ backgroundImage: `linear-gradient(90deg, ${preset.from}, ${preset.to})` }}
                  />
                  {preset.label}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <ColorInput
          id="brandColorFrom"
          label="Color 1 (izquierda)"
          value={values.brandColorFrom}
          error={errors.brandColorFrom}
          setField={setField}
          disabled={disabled}
        />
        <ColorInput
          id="brandColorTo"
          label="Color 2 (derecha)"
          value={values.brandColorTo}
          error={errors.brandColorTo ?? pairError(from, to)}
          setField={setField}
          disabled={disabled}
        />
      </div>

      <BrandPreview brandColorFrom={from} brandColorTo={to} />
    </fieldset>
  )
}

export default BrandColorFields
