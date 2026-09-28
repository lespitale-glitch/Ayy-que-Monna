import ProductThumb from './ProductThumb.jsx'
import RowActions from './RowActions.jsx'
import Switch from './Switch.jsx'
import StockControl from './StockControl.jsx'
import { PRODUCT_TOGGLES } from './productToggles.js'
import { getCategory } from '../../utils/products.js'
import { formatPrice } from '../../utils/formatPrice.js'

// Vista de tabla para pantallas grandes (en móvil se usa AdminProductCards)
function AdminProductsTable({ products, savingIds, onToggle, onStockChange, onDelete }) {
  return (
    <table className="w-full border-collapse text-left text-sm">
      <caption className="sr-only">Productos del catálogo</caption>
      <thead>
        <tr className="border-b border-ink text-[10px] uppercase tracking-widest text-stone">
          <th scope="col" className="py-3 pr-4 font-normal">
            Producto
          </th>
          <th scope="col" className="px-4 py-3 font-normal">
            Categoría
          </th>
          <th scope="col" className="px-4 py-3 text-right font-normal">
            Precio
          </th>
          <th scope="col" className="px-4 py-3 font-normal">
            Stock
          </th>
          {PRODUCT_TOGGLES.map((t) => (
            <th key={t.key} scope="col" className="px-3 py-3 text-center font-normal">
              {t.label}
            </th>
          ))}
          <th scope="col" className="py-3 pl-4 font-normal">
            <span className="sr-only">Acciones</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-line">
        {products.map((product) => {
          const isSaving = savingIds.has(product.id)
          return (
            <tr key={product.id} className={product.isVisible ? '' : 'bg-line/30'}>
              <th scope="row" className="py-3 pr-4 font-normal">
                <div className="flex items-center gap-4">
                  <ProductThumb product={product} />
                  <div>
                    <p className="text-xs uppercase tracking-widest">{product.name}</p>
                    <p className="mt-1 font-mono text-xs text-stone">{product.id}</p>
                  </div>
                </div>
              </th>
              <td className="px-4 py-3">{getCategory(product.category)?.label ?? product.category}</td>
              <td className="px-4 py-3 text-right tabular-nums">{formatPrice(product.price)}</td>
              <td className="px-4 py-3">
                <StockControl product={product} onChange={onStockChange} />
              </td>
              {PRODUCT_TOGGLES.map((t) => (
                <td key={t.key} className="px-3 py-3 text-center">
                  <Switch
                    checked={t.get(product)}
                    onChange={(value) => onToggle(product, t, value)}
                    label={`${t.label}: ${product.name}`}
                    showLabel={false}
                    disabled={isSaving}
                  />
                </td>
              ))}
              <td className="py-3 pl-4">
                <RowActions item={product} editTo={`/admin/productos/${product.id}`} onDelete={onDelete} disabled={isSaving} />
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default AdminProductsTable
