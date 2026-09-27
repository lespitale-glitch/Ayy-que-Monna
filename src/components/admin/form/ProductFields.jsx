import FormField from './FormField.jsx'
import { fieldA11y, inputClass } from './fieldA11y.js'
import { CATEGORIES } from '../../../config.js'
import { DESCRIPTION_MAX, NAME_MAX } from '../../../utils/productForm.js'

// Campos de texto del producto: nombre, id, precio, categoría y descripción
function ProductFields({ values, errors, onField, isNew, disabled }) {
  const idHint = isNew
    ? 'Se genera a partir del nombre. Es la dirección del producto: /producto/este-id'
    : 'El id no se puede cambiar: rompería los enlaces ya compartidos y los carritos guardados.'

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <FormField id="name" label="Nombre" hint="Se guarda en MAYÚSCULAS." error={errors.name} className="sm:col-span-2">
        <input
          {...fieldA11y('name', { error: errors.name, hint: true })}
          type="text"
          value={values.name}
          onChange={onField('name')}
          maxLength={NAME_MAX}
          required
          disabled={disabled}
          className={`${inputClass} h-12`}
        />
      </FormField>

      <FormField id="id" label="Id (slug)" hint={idHint} error={errors.id} className="sm:col-span-2">
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

      <FormField id="price" label="Precio (ARS)" hint="Número entero, sin puntos." error={errors.price}>
        <input
          {...fieldA11y('price', { error: errors.price, hint: true })}
          type="number"
          inputMode="numeric"
          min="1"
          step="1"
          value={values.price}
          onChange={onField('price')}
          required
          disabled={disabled}
          className={`${inputClass} h-12`}
        />
      </FormField>

      <FormField id="category" label="Categoría" error={errors.category}>
        <select
          {...fieldA11y('category', { error: errors.category })}
          value={values.category}
          onChange={onField('category')}
          required
          disabled={disabled}
          className={`${inputClass} h-12`}
        >
          <option value="">Elegir…</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        id="description"
        label="Descripción (opcional)"
        hint={`${values.description.length} / ${DESCRIPTION_MAX} caracteres`}
        error={errors.description}
        className="sm:col-span-2"
      >
        <textarea
          {...fieldA11y('description', { error: errors.description, hint: true })}
          rows={4}
          value={values.description}
          onChange={onField('description')}
          maxLength={DESCRIPTION_MAX}
          disabled={disabled}
          className={`${inputClass} py-3 leading-relaxed`}
        />
      </FormField>
    </div>
  )
}

export default ProductFields
