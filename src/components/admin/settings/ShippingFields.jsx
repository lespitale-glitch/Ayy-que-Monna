import FormField from '../form/FormField.jsx'
import { fieldA11y, inputClass } from '../form/fieldA11y.js'
import Switch from '../Switch.jsx'
import PickupPointsEditor from './PickupPointsEditor.jsx'
import { SHIPPING_NOTE_MAX } from '../../../utils/settings.js'

// Envíos (texto y costo "desde") y puntos de retiro gratis
function ShippingFields({ values, errors, onField, setField, disabled }) {
  return (
    <fieldset className="grid content-start gap-6">
      <legend className="font-display text-2xl">Envíos y retiro</legend>

      <Switch
        checked={values.shippingEnabled}
        onChange={(value) => setField('shippingEnabled', value)}
        label="Hago envíos"
        disabled={disabled}
      />
      <p className="-mt-3 text-xs text-stone">
        Si lo apagas, la tienda ya no muestra el texto ni el costo de envío (quedan guardados para más adelante).
      </p>

      <FormField
        id="shippingNote"
        label="Texto de envíos"
        hint={`Se muestra en el carrito y en cada producto. ${values.shippingNote.length}/${SHIPPING_NOTE_MAX}`}
        error={errors.shippingNote}
      >
        <textarea
          {...fieldA11y('shippingNote', { error: errors.shippingNote, hint: true })}
          rows={3}
          value={values.shippingNote}
          onChange={onField('shippingNote')}
          maxLength={SHIPPING_NOTE_MAX}
          disabled={disabled}
          className={`${inputClass} py-3`}
        />
      </FormField>

      <FormField
        id="shippingFrom"
        label="Costo desde (ARS)"
        hint='Opcional. En el inicio se ve como "desde $ …". Déjalo vacío para no mostrar un precio.'
        error={errors.shippingFrom}
      >
        <input
          {...fieldA11y('shippingFrom', { error: errors.shippingFrom, hint: true })}
          type="number"
          inputMode="numeric"
          min="0"
          step="1"
          value={values.shippingFrom}
          onChange={onField('shippingFrom')}
          disabled={disabled}
          className={`${inputClass} h-12 sm:max-w-60`}
        />
      </FormField>

      <PickupPointsEditor
        points={values.pickupPoints}
        onChange={(points) => setField('pickupPoints', points)}
        error={errors.pickupPoints}
        disabled={disabled}
      />
    </fieldset>
  )
}

export default ShippingFields
