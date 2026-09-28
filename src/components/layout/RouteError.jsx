import { useRouteError } from 'react-router-dom'
import { isChunkLoadError } from '../../utils/lazyImport.js'

// Pantalla para errores inesperados (en lugar del mensaje técnico de React Router).
// Va como "errorElement" en router.jsx. El detalle queda en la consola para poder revisarlo.
function RouteError() {
  const error = useRouteError()
  console.error(error)
  // Caso típico: se publicó una versión nueva mientras la página estaba abierta
  const isNewVersion = isChunkLoadError(error)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bone px-6 text-center">
      <h1 className="font-display text-3xl">{isNewVersion ? 'Hay una versión nueva' : 'Uy, algo salió mal'}</h1>
      <p className="mt-4 max-w-sm text-sm text-stone">
        {isNewVersion
          ? 'Actualizamos la tienda mientras la tenías abierta. Recargá para ver la última versión.'
          : 'Recargá la página para seguir. Si vuelve a pasar, escribinos y lo solucionamos.'}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => window.location.reload()} className="btn-primary">
          Recargar
        </button>
        <a href="/" className="btn-outline">
          Ir al inicio
        </a>
      </div>
    </main>
  )
}

export default RouteError
