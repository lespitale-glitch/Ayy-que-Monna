import { useEffect, useRef, useState } from 'react'
import { ImagePlus } from 'lucide-react'
import ImageTile from './ImageTile.jsx'
import { compressImage } from '../../utils/compressImage.js'

// Fotos del producto: agregar (comprimidas a WebP), reordenar y quitar.
// La primera foto es la principal y la segunda se usa en el hover de la tienda.
// Las fotos nuevas se SUBEN recién al guardar el formulario (así no quedan archivos
// huérfanos en el Storage si se cancela).
function ImageUploader({ images, onChange, disabled, error, errorId }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [processError, setProcessError] = useState('')

  // Las vistas previas usan URLs temporales (blob:) que ocupan memoria:
  // al salir del formulario las liberamos todas.
  const imagesRef = useRef(images)
  useEffect(() => {
    imagesRef.current = images
  }, [images])
  useEffect(() => () => imagesRef.current.forEach((img) => img.previewUrl && URL.revokeObjectURL(img.previewUrl)), [])

  const handleFiles = async (event) => {
    const files = [...event.target.files]
    event.target.value = '' // permite volver a elegir el mismo archivo
    if (files.length === 0) return

    setIsProcessing(true)
    setProcessError('')
    const added = []
    for (const file of files) {
      try {
        const { blob } = await compressImage(file)
        added.push({ key: crypto.randomUUID(), blob, previewUrl: URL.createObjectURL(blob), name: file.name })
      } catch (err) {
        setProcessError(err.message)
      }
    }
    onChange([...images, ...added])
    setIsProcessing(false)
  }

  // Intercambia la foto "index" con su vecina (dir = -1 izquierda, +1 derecha)
  const move = (index, dir) => {
    const next = [...images]
    ;[next[index], next[index + dir]] = [next[index + dir], next[index]]
    onChange(next)
  }

  const makeMain = (index) => onChange([images[index], ...images.filter((_, i) => i !== index)])

  const remove = (index) => {
    const image = images[index]
    if (image.previewUrl) URL.revokeObjectURL(image.previewUrl)
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className="text-xs uppercase tracking-widest">Fotos</legend>
      <p className="mt-2 text-xs text-stone">
        La primera es la principal; la segunda aparece al pasar el mouse en la tienda. Se convierten a WebP (máx. 1600
        px).
      </p>

      {images.length > 0 && (
        <ol className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image, index) => (
            <ImageTile
              key={image.key}
              image={image}
              index={index}
              total={images.length}
              disabled={disabled}
              onMove={(dir) => move(index, dir)}
              onMakeMain={() => makeMain(index)}
              onRemove={() => remove(index)}
            />
          ))}
        </ol>
      )}

      {/* El input real está oculto visualmente pero sigue siendo enfocable con el teclado */}
      <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 border border-dashed border-stone px-4 py-6 text-xs uppercase tracking-widest transition-colors focus-within:border-ink focus-within:ring-1 focus-within:ring-ink hover:border-ink has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50">
        <ImagePlus size={18} strokeWidth={1.25} aria-hidden="true" />
        {isProcessing ? 'Procesando imágenes…' : 'Agregar fotos'}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFiles}
          disabled={disabled || isProcessing}
          className="sr-only"
        />
      </label>

      <div aria-live="polite">
        {isProcessing && <p className="sr-only">Procesando imágenes…</p>}
        {processError && <p className="mt-2 text-xs text-ink">✕ {processError}</p>}
      </div>
      {error && (
        <p id={errorId} className="mt-2 text-xs text-ink">
          <span aria-hidden="true">✕ </span>
          {error}
        </p>
      )}
    </fieldset>
  )
}

export default ImageUploader
