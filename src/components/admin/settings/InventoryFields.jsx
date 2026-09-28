import Switch from '../Switch.jsx'

// Ajustes de inventario que se ven en la tienda
function InventoryFields({ values, setField, disabled }) {
  return (
    <fieldset className="grid content-start gap-4">
      <legend className="font-display text-2xl">Inventario</legend>
      <Switch
        checked={values.showLowStock}
        onChange={(value) => setField('showLowStock', value)}
        label='Mostrar "Últimas unidades"'
        disabled={disabled}
      />
      <p className="text-xs text-stone">
        Aparece en los productos con stock cuando quedan pocas unidades (el límite se elige en cada producto). Los
        agotados se muestran siempre. Los avisos por email se configuran una sola vez en Supabase (ver README).
      </p>
    </fieldset>
  )
}

export default InventoryFields
