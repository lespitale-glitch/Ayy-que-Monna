// Genera el logo web a partir del logo original (JPG con fondo crema).
// Uso: npm run brand:logo
//
// 1. Quita el fondo crema: cada píxel se vuelve más transparente cuanto más se
//    parece al color del fondo. En los bordes suaves recuperamos el color real
//    del trazo ("des-mezclando" el crema) para que no quede un halo claro.
// 2. Recorta el espacio vacío y exporta WebP con transparencia + favicons PNG.
import sharp from 'sharp'

const SOURCES = {
  wordmark: 'design/logo-original.jpg', // "Monna" (la M es el símbolo); se recorta la cola final
  symbol: 'design/logo-m-original.jpg', // la "M" sola
}
const OUT = 'src/assets/brand'
// El logotipo original termina con una cola en forma de "s" después de la "a" ("monnaꝭ").
// La marca es "Monna": recortamos la imagen justo después del palo recto de la "a" (columna 1040
// del archivo original de 1280 px). Así queda "M" (el logo) + "onna".
const WORDMARK_CUT_X = 1041

const LOW = 10 // distancia al fondo por debajo de la cual el píxel es 100% transparente
const HIGH = 70 // distancia a partir de la cual es 100% opaco

async function removeBackground(file, cropWidth) {
  // Si se pide, primero recortamos el ancho (para quitar la cola del logotipo)
  let image = sharp(file)
  if (cropWidth) {
    const { height } = await image.metadata()
    image = sharp(await image.extract({ left: 0, top: 0, width: cropWidth, height }).toBuffer())
  }
  const { data, info } = await image.removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height } = info

  // Color de fondo = promedio de las 4 esquinas
  const corners = [0, width - 1, (height - 1) * width, height * width - 1]
  const bg = [0, 1, 2].map((c) => corners.reduce((sum, p) => sum + data[p * 3 + c], 0) / corners.length)

  const out = Buffer.alloc(width * height * 4)
  for (let p = 0; p < width * height; p++) {
    const rgb = [data[p * 3], data[p * 3 + 1], data[p * 3 + 2]]
    const distance = Math.hypot(rgb[0] - bg[0], rgb[1] - bg[1], rgb[2] - bg[2])
    const alpha = Math.min(1, Math.max(0, (distance - LOW) / (HIGH - LOW)))
    for (let c = 0; c < 3; c++) {
      // color_original = (color_visto - fondo * (1 - alpha)) / alpha
      const unmixed = alpha > 0 ? (rgb[c] - bg[c] * (1 - alpha)) / alpha : 0
      out[p * 4 + c] = Math.round(Math.min(255, Math.max(0, unmixed)))
    }
    out[p * 4 + 3] = Math.round(alpha * 255)
  }
  return sharp(out, { raw: { width, height, channels: 4 } }).png()
}

async function run() {
  // trim() recorta los bordes transparentes; lo hacemos sobre un PNG intermedio
  const trimmed = async (file, cropWidth) => sharp(await (await removeBackground(file, cropWidth)).toBuffer()).trim()

  const wordmark = await trimmed(SOURCES.wordmark, WORDMARK_CUT_X)
  await wordmark.clone().resize({ height: 96 }).webp({ quality: 90, alphaQuality: 100 }).toFile(`${OUT}/logo-monna.webp`)

  const symbol = await trimmed(SOURCES.symbol)
  await symbol.clone().resize({ height: 160 }).webp({ quality: 90, alphaQuality: 100 }).toFile(`${OUT}/logo-m.webp`)

  // Favicons: la "M" centrada en un cuadrado transparente
  const square = (size) =>
    symbol.clone().resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png()
  await square(64).toFile('public/favicon.png')
  // El ícono de iOS no admite transparencia: pegamos la "M" sobre un cuadrado crema
  const icon = await square(140).toBuffer()
  await sharp({ create: { width: 180, height: 180, channels: 4, background: '#FFF8F3' } })
    .composite([{ input: icon, gravity: 'center' }])
    .flatten({ background: '#FFF8F3' })
    .png()
    .toFile('public/apple-touch-icon.png')

  console.log('Logo generado en', OUT, 'y favicons en public/')
}

run()
