import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-6 py-32 text-center">
      <p className="text-xs uppercase tracking-widest text-stone">Error 404</p>
      <h1 className="mt-4 text-4xl">No encontramos esta página</h1>
      <Link
        to="/tienda"
        className="btn-outline mt-10"
      >
        Volver a la tienda
      </Link>
    </section>
  )
}

export default NotFound
