import FormField from './FormField.jsx'
import { fieldA11y, inputClass } from './fieldA11y.js'
import { STOCK_MODES } from '../../../utils/stock.js'

// Stock del producto: modo (radios) y, si se cuentan unidades, cantidad y aviso de stock bajo
function StockFields({ values, errors, onField, setField, disabled }) {
  const isTracked = values.stockMode === 'tracked'

  return (
    <fieldset>
      <legend className="text-xs uppercase tracking-widest">Stock</legend>
      <div className="mt-4 grid gap-3">
        {STOCK_MODES.map((mode) => (
          <label key={mode.id} className="flex cursor-pointer gap-3 text-sm">
            <input
              type="radio"
              name="stockMode"
              value={mode.id}
              checked={values.stockMode === mode.id}
              onChange={() => setField('stockMode', mode.id)}
              disabled={disabled}
              aria-describedby={`stock-mode-${mode.id}`}
              className="mt-1 h-4 w-4 shrink-0 accent-ink"
            />
            <span>
              {mode.label}
              <span id={`stock-mode-${mode.id}`} className="block text-xs text-stone">
                {mode.help}
              </span>
            </span>
          </label>
        ))}
      </div>

      {isTracked && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          <FormField id="stock" label="Unidades" error={errors.stock}>
            <input
              {...fieldA11y('stock', { error: errors.stock })}
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              value={values.stock}
              onChange={onField('stock')}
              disabled={disabled}
              className={`${inputClass} h-12`}
            />
          </FormField>
          <FormField id="lowStockThreshold" label="Avisar con" hint="unidades o menos" error={errors.lowStockThreshold}>
            <input
              {...fieldA11y('lowStockThreshold', { error: errors.lowStockThreshold, hint: true })}
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              value={values.lowStockThreshold}
              onChange={onField('lowStockThreshold')}
              disabled={disabled}
              className={`${inputClass} h-12`}
            />
          </FormField>
        </div>
      )}
    </fieldset>
  )
}

export default StockFields
