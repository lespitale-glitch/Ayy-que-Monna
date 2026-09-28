import FormField from '../form/FormField.jsx'
import Switch from '../Switch.jsx'
import LinkPicker from './LinkPicker.jsx'
import { fieldA11y, inputClass } from '../form/fieldA11y.js'
import { LIMITS } from '../../../utils/heroSlideForm.js'

// Textos de la diapositiva: el orden sigue cómo se ven (etiqueta, título, botón)
const TEXT_FIELDS = [
  { field: 'eyebrow', label: 'Etiqueta (arriba del título)', hint: 'Opcional. Ej: "Recién llegados". Se ve en mayúsculas.' },
  { field: 'title', label: 'Título', hint: 'Ej: "Pequeños brillos para"' },
  { field: 'highlight', label: 'Final del título con color', hint: 'Opcional. Ej: "todos los días" (se ve con el degradado de la marca).' },
  { field: 'ctaLabel', label: 'Texto del botón', hint: 'Ej: "Explorar tienda"' },
]

function HeroSlideFields({ values, errors, onField, setField, linkOptions, disabled }) {
  return (
    <div className="grid content-start gap-6">
      {TEXT_FIELDS.map(({ field, label, hint }) => (
        <FormField key={field} id={field} label={label} hint={`${hint} ${values[field].length}/${LIMITS[field]}`} error={errors[field]}>
          <input
            {...fieldA11y(field, { error: errors[field], hint: true })}
            type="text"
            value={values[field]}
            onChange={onField(field)}
            maxLength={LIMITS[field]}
            disabled={disabled}
            className={`${inputClass} h-12`}
          />
        </FormField>
      ))}

      <LinkPicker value={values.ctaLink} options={linkOptions} onChange={(v) => setField('ctaLink', v)} error={errors.ctaLink} disabled={disabled} />

      <FormField
        id="alt"
        label="Descripción de la foto"
        hint="Para quienes usan lector de pantalla: qué muestra la foto (ej: “Collar con dije de flor puesto”). Déjala vacía si la foto es solo decorativa (un fondo o estampado)."
        error={errors.alt}
      >
        <input
          {...fieldA11y('alt', { error: errors.alt, hint: true })}
          type="text"
          value={values.alt}
          onChange={onField('alt')}
          maxLength={LIMITS.alt}
          disabled={disabled}
          className={`${inputClass} h-12`}
        />
      </FormField>

      <Switch checked={values.isVisible} onChange={(v) => setField('isVisible', v)} label="Visible en el inicio" disabled={disabled} />
    </div>
  )
}

export default HeroSlideFields
