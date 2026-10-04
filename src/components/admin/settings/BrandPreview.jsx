import { resolveTheme, themeVars } from '../../../utils/theme.js'

// Vista previa en vivo: las variables CSS se aplican solo a este recuadro (se heredan hacia adentro),
// así se ve el cambio al instante sin tocar el resto de la página hasta guardar.
function BrandPreview({ brandColorFrom, brandColorTo }) {
  // Si un color todavía no sirve (a medio escribir o combinación ilegible), se muestran los del logo
  const theme = resolveTheme({ brandColorFrom, brandColorTo })
  const isFallback = theme.brandColorFrom !== brandColorFrom || theme.brandColorTo !== brandColorTo
  // Qué ajustó la tienda sola para que se lea (se lo contamos a la administradora)
  const notes = []
  if (!isFallback && theme.onBrand !== '#FFFFFF') notes.push('Como el botón es claro, sus letras van en negro.')
  if (!isFallback && (theme.textFrom !== brandColorFrom || theme.textTo !== brandColorTo))
    notes.push('Los textos destacados usan un tono más oscuro del mismo color para leerse sobre el fondo crema.')

  return (
    <figure style={themeVars(theme)} className="rounded-2xl border border-line bg-bone p-6">
      <figcaption className="text-xs uppercase tracking-widest text-stone">
        Vista previa
        {isFallback && <span className="block normal-case tracking-normal">(con los colores del logo hasta que la combinación sirva)</span>}
      </figcaption>
      {/* Decorativo: repite lo que ya dicen los campos, el lector de pantalla no lo necesita */}
      <div aria-hidden="true" className="mt-4">
        <p className="text-xs font-medium uppercase tracking-widest text-fucsia-deep">Aros</p>
        <p className="mt-2 font-display text-3xl leading-tight">
          Para cada <span className="text-gradient">ocasión!</span>
        </p>
        <span className="btn-primary mt-5">Ver aros</span>
      </div>
      {notes.length > 0 && (
        <ul className="mt-5 grid gap-1 text-xs text-stone">
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}
    </figure>
  )
}

export default BrandPreview
