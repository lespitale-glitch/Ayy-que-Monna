import { resolveTheme, themeVars } from '../../../utils/theme.js'

// Vista previa en vivo: las variables CSS se aplican solo a este recuadro (se heredan hacia adentro),
// así se ve el cambio al instante sin tocar el resto de la página hasta guardar.
function BrandPreview({ brandColorFrom, brandColorTo }) {
  // Si un color todavía no sirve (a medio escribir o sin contraste), se muestran los del logo
  const theme = resolveTheme({ brandColorFrom, brandColorTo })
  const isFallback = theme.brandColorFrom !== brandColorFrom || theme.brandColorTo !== brandColorTo

  return (
    <figure style={themeVars(theme)} className="rounded-2xl border border-line bg-bone p-6">
      <figcaption className="text-xs uppercase tracking-widest text-stone">
        Vista previa
        {isFallback && <span className="block normal-case tracking-normal">(con los colores del logo hasta que los dos pasen)</span>}
      </figcaption>
      {/* Decorativo: repite lo que ya dicen los campos, el lector de pantalla no lo necesita */}
      <div aria-hidden="true" className="mt-4">
        <p className="text-xs font-medium uppercase tracking-widest text-fucsia-deep">Aros</p>
        <p className="mt-2 font-display text-3xl leading-tight">
          Para cada <span className="text-gradient">ocasión!</span>
        </p>
        <span className="btn-primary mt-5">Ver aros</span>
      </div>
    </figure>
  )
}

export default BrandPreview
