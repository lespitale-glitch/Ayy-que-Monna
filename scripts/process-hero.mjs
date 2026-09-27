// Convierte las fotos del Hero Slider (design/hero/*.jpg) a WebP optimizado.
// Uso: npm run brand:hero
// Genera dos tamaños por foto: -lg (hasta 1600 px) y -sm (800 px) para servir la chica en celulares.
import { readdirSync } from 'node:fs'
import sharp from 'sharp'

const SOURCE = 'design/hero'
const OUT = 'src/assets/hero'
const SIZES = { lg: 1600, sm: 800 }

for (const file of readdirSync(SOURCE).filter((f) => /\.(jpe?g|png)$/i.test(f))) {
  const name = file.replace(/\.\w+$/, '')
  for (const [size, width] of Object.entries(SIZES)) {
    // withoutEnlargement: si la foto es más chica que el ancho pedido, no se agranda
    const info = await sharp(`${SOURCE}/${file}`)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(`${OUT}/${name}-${size}.webp`)
    console.log(`${name}-${size}.webp`, `${info.width}x${info.height}`, `${Math.round(info.size / 1024)} KB`)
  }
}
