import ProductThumb from './ProductThumb.jsx'
import RowActions from './RowActions.jsx'
import Switch from './Switch.jsx'
import StockControl from './StockControl.jsx'
import { PRODUCT_TOGGLES } from './productToggles.js'
import { getCategory } from '../../utils/products.js'
import { formatPrice } from '../../utils/formatPrice.js'

// Vista de tarjetas para móvil y tablet: misma información que la tabla, apilada
function AdminProductCards({ products, savingIds, onToggle, onStockChange, onDelete }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {products.map((product) => {
        const isSaving = savingIds.has(product.id)
        return (
          <li key={product.id} className={`border border-line p-4 ${product.isVisible ? 'bg-white' : 'bg-line/30'}`}>
            <div className="flex gap-4">
              <ProductThumb product={product} className="w-20" />
              <div className="min-w-0 flex-1">
                <h2 className="font-sans text-xs uppercase tracking-widest">{product.name}</h2>
                <p className="mt-1 truncate font-mono text-xs text-stone">{product.id}</p>
                <p className="mt-2 text-sm">
                  {formatPrice(product.price)}
                  <span className="text-stone"> · {getCategory(product.category)?.label ?? product.category}</span>
                </p>
              </div>
              <RowActions item={product} editTo={`/admin/productos/${product.id}`} onDelete={onDelete} disabled={isSaving} />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
              <span className="text-xs uppercase tracking-widest text-stone">Stock</span>
              <StockControl product={product} onChange={onStockChange} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4">
              {PRODUCT_TOGGLES.map((t) => (
                <Switch
                  key={t.key}
                  checked={t.get(product)}
                  onChange={(value) => onToggle(product, t, value)}
                  label={t.label}
                  disabled={isSaving}
                />
              ))}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default AdminProductCards
