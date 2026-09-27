import { useParams } from 'react-router-dom'

// Página provisoria: el detalle completo (galería, descripción, agregar al carrito) llega en el Paso 3.
function Product() {
  // useParams lee la parte variable de la URL: en /producto/anillo-ola, id = "anillo-ola"
  const { id } = useParams()

  return (
    <section className="mx-auto max-w-3xl px-6 py-32 text-center">
      <p className="text-xs uppercase tracking-widest text-stone">Producto</p>
      <h1 className="mt-4 text-4xl">{id}</h1>
    </section>
  )
}

export default Product
