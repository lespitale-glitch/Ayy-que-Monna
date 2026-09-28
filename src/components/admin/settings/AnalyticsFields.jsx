import FormField from '../form/FormField.jsx'
import { fieldA11y, inputClass } from '../form/fieldA11y.js'

// Códigos de Google Analytics 4 y Meta Pixel. Vacíos = la tienda no mide nada.
function AnalyticsFields({ values, errors, onField, disabled }) {
  return (
    <fieldset className="grid content-start gap-6">
      <legend className="font-display text-2xl">Analítica</legend>
      <p className="-mt-2 text-xs text-stone">
        Solo se activan si la visita acepta las cookies (aparece un aviso en la tienda). El panel nunca se mide.
      </p>

      <FormField
        id="ga4Id"
        label="Google Analytics 4"
        hint="ID de medición: Analytics → Administrar → Flujos de datos → tu web. Empieza con G-."
        error={errors.ga4Id}
      >
        <input
          {...fieldA11y('ga4Id', { error: errors.ga4Id, hint: true })}
          type="text"
          value={values.ga4Id}
          onChange={onField('ga4Id')}
          placeholder="G-XXXXXXXXXX"
          autoCapitalize="characters"
          spellCheck={false}
          disabled={disabled}
          className={`${inputClass} h-12 font-mono`}
        />
      </FormField>

      <FormField
        id="metaPixelId"
        label="Meta Pixel (Facebook e Instagram)"
        hint="ID del píxel: Administrador de eventos de Meta → Orígenes de datos. Solo números."
        error={errors.metaPixelId}
      >
        <input
          {...fieldA11y('metaPixelId', { error: errors.metaPixelId, hint: true })}
          type="text"
          inputMode="numeric"
          value={values.metaPixelId}
          onChange={onField('metaPixelId')}
          spellCheck={false}
          disabled={disabled}
          className={`${inputClass} h-12 font-mono`}
        />
      </FormField>
    </fieldset>
  )
}

export default AnalyticsFields
