import { useProducts } from '../../hooks/useProducts.js'

// Muestra el contenido de la página solo cuando el catálogo está listo.
// Así las páginas no tienen que preocuparse por "cargando" o "error".
function CatalogGate({ children }) {
  const { status, reload } = useProducts()

  if (status === 'loading') {
    return (
      <div role="status" className="flex min-h-[60vh] items-center justify-center">
        <p className="animate-pulse text-xs uppercase tracking-widest text-stone">Cargando…</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <section
        role="alert"
        className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center"
      >
        <h1 className="text-3xl">No pudimos cargar la tienda</h1>
        <p className="mt-4 text-sm text-stone">Revisá tu conexión e intentá de nuevo en unos segundos.</p>
        <button type="button" onClick={reload} className="btn-outline mt-8">
          Reintentar
        </button>
      </section>
    )
  }

  return children
}

export default CatalogGate
