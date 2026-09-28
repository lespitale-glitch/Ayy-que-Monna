import FormField from '../form/FormField.jsx'
import Switch from '../Switch.jsx'
import { fieldA11y, inputClass } from '../form/fieldA11y.js'
import { COLLECTION_THEMES } from '../../../utils/collections.js'
import { COLLECTION_DESCRIPTION_MAX, COLLECTION_NAME_MAX } from '../../../utils/collectionForm.js'

// Datos de la colección: nombre, id, descripción, color y dónde se muestra
function CollectionFields({ values, errors, onField, setField, isNew, disabled }) {
  const idHint = isNew
    ? 'Se genera a partir del nombre. Es la dirección de la colección: /seleccion/este-id'
    : 'El id no se puede cambiar: rompería los enlaces ya compartidos.'

  return (
    <div className="grid content-start gap-6">
      <FormField id="name" label="Nombre" hint='Sin la palabra "Colección": se agrega sola donde hace falta.' error={errors.name}>
        <input
          {...fieldA11y('name', { error: errors.name, hint: true })}
          type="text"
          value={values.name}
          onChange={onField('name')}
          maxLength={COLLECTION_NAME_MAX}
          required
          disabled={disabled}
          className={`${inputClass} h-12`}
        />
      </FormField>

      <FormField id="id" label="Id (slug)" hint={idHint} error={errors.id}>
        <input
          {...fieldA11y('id', { error: errors.id, hint: true })}
          type="text"
          value={values.id}
          onChange={onField('id')}
          readOnly={!isNew}
          required
          disabled={disabled}
          spellCheck={false}
          autoCapitalize="none"
          className={`${inputClass} h-12 font-mono read-only:bg-line/30 read-only:text-stone`}
        />
      </FormField>

      <FormField
        id="description"
        label="Descripción"
        hint={`Opcional. Se ve en el inicio, en el menú y en la página de la colección. ${values.description.length}/${COLLECTION_DESCRIPTION_MAX}`}
        error={errors.description}
      >
        <textarea
          {...fieldA11y('description', { error: errors.description, hint: true })}
          rows={3}
          value={values.description}
          onChange={onField('description')}
          maxLength={COLLECTION_DESCRIPTION_MAX}
          disabled={disabled}
          className={`${inputClass} py-3`}
        />
      </FormField>

      {/* Radios nativos: el teclado (flechas) y los lectores de pantalla ya saben usarlos */}
      <fieldset id="theme">
        <legend className="text-xs uppercase tracking-widest">Color</legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {Object.entries(COLLECTION_THEMES).map(([key, theme]) => (
            <label
              key={key}
              className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-line bg-white px-4 py-2 text-sm has-[:checked]:border-ink"
            >
              <input
                type="radio"
                name="theme"
                value={key}
                checked={values.theme === key}
                onChange={() => setField('theme', key)}
                disabled={disabled}
                className="h-4 w-4 accent-ink"
              />
              <span aria-hidden="true" className={`h-4 w-4 rounded-full ${theme.swatch}`} />
              {theme.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xs uppercase tracking-widest">Dónde se muestra</legend>
        <div className="mt-4 grid gap-4">
          <Switch checked={values.isVisible} onChange={(v) => setField('isVisible', v)} label="Visible en la tienda" disabled={disabled} />
          <Switch checked={values.showOnHome} onChange={(v) => setField('showOnHome', v)} label="Sección en el inicio" disabled={disabled} />
        </div>
      </fieldset>
    </div>
  )
}

export default CollectionFields
