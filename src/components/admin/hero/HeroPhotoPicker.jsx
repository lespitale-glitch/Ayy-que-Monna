import { useEffect, useRef, useState } from 'react'
import { ImagePlus } from 'lucide-react'
import { compressImage } from '../../../utils/compressImage.js'

// Elegir la foto de la diapositiva. Se comprime al elegirla (grande 1600 px y chica 800 px)
// y se sube recién al guardar, igual que las fotos de productos.
function HeroPhotoPicker({ photo, onChange, error, disabled }) {
  const inputRef = useRef(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [pickError, setPickError] = useState(null)
  const preview = photo?.url ?? photo?.previewUrl

  // Libera la vista previa en memoria al cambiar de foto o salir (evita pérdidas de memoria)
  useEffect(() => {
    const url = photo?.previewUrl
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [photo])

  const handleFile = async (event) => {
    const [file] = event.target.files
    event.target.value = '' // permite volver a elegir la misma foto
    if (!file) return
    setPickError(null)
    setIsProcessing(true)
    try {
      // compressImage devuelve { blob, width, height }: nos quedamos con el blob (el archivo listo)
      const [large, small] = await Promise.all([compressImage(file, 1600), compressImage(file, 800)])
      onChange({ large: large.blob, small: small.blob, previewUrl: URL.createObjectURL(large.blob) })
    } catch (err) {
      setPickError(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const message = pickError ?? error
  return (
    <div id="photo">
      <p className="text-xs uppercase tracking-widest">Foto</p>
      <div className="mt-2 overflow-hidden rounded-2xl border border-line bg-white">
        {preview ? (
          <img src={preview} alt="Foto elegida para la diapositiva" className="aspect-[4/3] w-full object-cover" />
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center text-sm text-stone">Todavía no elegiste una foto</div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} className="sr-only" tabIndex={-1} aria-hidden="true" />
      <button
        type="button"
        onClick={() => inputRef.current.click()}
        disabled={disabled || isProcessing}
        aria-describedby={message ? 'photo-error' : 'photo-hint'}
        className="btn-outline mt-3 px-4 py-2 disabled:opacity-50"
      >
        <ImagePlus size={14} strokeWidth={1.5} aria-hidden="true" />
        {isProcessing ? 'Preparando foto…' : preview ? 'Cambiar foto' : 'Elegir foto'}
      </button>
      {message ? (
        <p id="photo-error" role="alert" className="mt-2 text-xs text-ink">
          <span aria-hidden="true">✕ </span>
          {message}
        </p>
      ) : (
        <p id="photo-hint" className="mt-2 text-xs text-stone">
          Horizontal y de buena calidad. En celular se ve recortada en 4:3; en computadora, a lo ancho.
        </p>
      )}
    </div>
  )
}

export default HeroPhotoPicker
