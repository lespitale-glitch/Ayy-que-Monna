import { useParams } from 'react-router-dom'
import ProductGrid from '../../components/ProductGrid.jsx'
import NotFound from '../NotFound/NotFound.jsx'
import { findSelection, getSelectionProducts } from '../../data/selections.js'
import { useProducts } from '../../hooks/useProducts.js'
import { getTheme } from '../../utils/collections.js'

// Página de una selección especial: /seleccion/marina, /seleccion/dorados…
function Selection() {
  const { slug } = useParams()
  const { products, selections } = useProducts()
  const selection = findSelection(selections, slug)

  if (!selection) return <NotFound />
  const items = getSelectionProducts(products, selection)
  // Las colecciones usan su color; las selecciones automáticas, el texto normal
  const titleClass = selection.isCollection ? getTheme(selection.theme).title : ''

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <title>{`${selection.isCollection ? 'Colección ' : ''}${selection.label} — Ayy Que Monna`}</title>
      <header className="mb-12 text-center md:mb-16">
        <p className="text-xs font-medium uppercase tracking-widest text-fucsia-deep">
          {selection.isCollection ? 'Colección' : 'Colecciones'}
        </p>
        <h1 className={`mt-3 text-4xl md:text-6xl ${titleClass}`}>{selection.label}</h1>
        {selection.description && <p className="mx-auto mt-4 max-w-md text-sm text-stone">{selection.description}</p>}
        <p className="mt-4 text-xs uppercase tracking-widest text-stone">
          {items.length} {items.length === 1 ? 'producto' : 'productos'}
        </p>
      </header>
      <h2 className="sr-only">Productos</h2>
      <ProductGrid products={items} />
    </section>
  )
}

export default Selection
