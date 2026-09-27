// Reduce una foto antes de subirla: lado mayor de 1600 px como máximo y formato WebP.
// Una foto de celular (4–8 MB) suele quedar en 100–300 KB sin pérdida visible.
const MAX_SIDE = 1600
const QUALITY = 0.82

// canvas.toBlob usa un "callback"; lo envolvemos en una Promesa para poder usar await
const canvasToBlob = (canvas, type) => new Promise((resolve) => canvas.toBlob(resolve, type, QUALITY))

export async function compressImage(file) {
  if (!file.type.startsWith('image/')) {
    throw new Error(`"${file.name}" no es una imagen.`)
  }

  // createImageBitmap decodifica la imagen y respeta la rotación de las fotos de celular (EXIF)
  let bitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    throw new Error(`No se pudo leer "${file.name}". Usa JPG, PNG o WebP.`)
  }

  // Math.min(1, …) evita agrandar fotos que ya son chicas
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  // Fondo blanco: si el navegador no soporta WebP y cae a JPEG, las zonas transparentes no quedan negras
  context.fillStyle = 'white'
  context.fillRect(0, 0, width, height)
  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  let blob = await canvasToBlob(canvas, 'image/webp')
  // Algunos navegadores viejos no generan WebP y devuelven PNG: en ese caso usamos JPEG
  if (!blob || blob.type !== 'image/webp') blob = await canvasToBlob(canvas, 'image/jpeg')
  if (!blob) throw new Error(`No se pudo procesar "${file.name}".`)

  return { blob, width, height }
}
