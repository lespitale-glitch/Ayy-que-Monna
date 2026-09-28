import { normalize } from '../text.js'

// Intenciones que no son preguntas frecuentes. Se buscan con expresiones regulares
// sobre el texto normalizado (sin acentos). \b = borde de palabra.
const PATTERNS = {
  human:
    /\b(whats ?app|wpp|wsp|whatsapp|telefono|celular|contacto|contactarme|contactarlos|contactarte)\b|\b(hablar|comunicarme|contactar(me)?|atender|atienda|escribir(le)?)\b.*\b(persona|alguien|humano|vendedora?|duena|ustedes|equipo)\b/,
  thanks: /^(muchas )?(gracias|genial|perfecto|joya|buenisimo|barbaro|dale|ok|okey|listo|re bien|mil gracias)\b/,
  bye: /^(chau|adios|nos vemos|hasta luego|bye)\b/,
  greeting: /^(hola|holis|holaa+|buenas|buen dia|buenos dias|buenas tardes|buenas noches|hey|que tal)\b/,
}

export function detectIntent(text) {
  const t = normalize(text).replace(/[^a-z0-9ñ\s]/g, ' ').replace(/\s+/g, ' ').trim()
  if (PATTERNS.human.test(t)) return 'human'
  for (const intent of ['thanks', 'bye', 'greeting']) if (PATTERNS[intent].test(t)) return intent
  return null
}
