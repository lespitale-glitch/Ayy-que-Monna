// Vocabulario del asistente. Todo va sin acentos y en minúsculas (así llega el texto
// después de normalizarlo) y en "raíz" (sin la s del plural, ver stem() en botText.js).

// Palabras que no aportan significado a la pregunta ("¿de qué...?", "quisiera saber...")
export const STOPWORDS = new Set(
  `a al algo algun alguna alguno ante asi aca ahi alla bien buen cada como con consulta consultar cual cuale cuando
  de del donde dond e el ella ello en entre era es esa ese eso esta estan este esto hay hace hacen hola buena buenas
  buen dia dias tarde noche la las le les lo los me mi mis mucho muy nada ni no nos o otra otro para pero poco por porfa
  favor pregunta preguntar puede pueden puedo que queria quiero quisiera saber se sea ser si sin sobre solo son su sus
  tambien te tenes tengo tiene tienen toda todo tu tus un una uno unos unas usted ustede vos y ya estoy seria podria
  hago haria gustaria necesito busco buscando buscaba mostrame mostrar ver unos gracias gracia chau adios genial
  perfecto joya dale ok okey listo holis hey tal mil hermana mama amiga novia novio hija abuela tia prima mujer
  hombre chica chico nena nene alguien cuanto cuanta coleccion jaja jajaja onda`.split(/\s+/),
)

// Grupos de sinónimos: cada palabra de la lista se trata como la "raíz" del grupo.
// Así "mandan", "despachan" y "correo" cuentan todas como "envio".
const GROUPS = {
  envio: 'envio enviar envian enviame enviarme enviarias mandan mandar manda mandarme despacho despachan correo andreani oca llega llegan llegaria tarda tardan demora domicilio delivery',
  retiro: 'retiro retirar retira retiran buscarlo buscar paso pasar punto',
  pago: 'pago pagar pagan pague abono abonar transferencia transferir tarjeta efectivo mercadopago cuota alia cbu debito credito',
  material: 'material acero quirurgico alergia alergica alergico hipoalergenico oxida oxidan negro negra hechos hecho',
  cuidado: 'cuidar cuidado cuido limpiar limpio limpieza brillo mojar moja mojo agua ducha banar banarme banarse pileta perfume crema guardar humedad',
  pedido: 'comprar compro compra pedido pedir pido encargar encargo carrito reservar reserva',
  // "cuánto" NO va acá: aparece en "cuánto tarda" y confundía precio con envío
  precio: 'precio precios cuesta cuestan sale salen valor vale',
  regalo: 'regalo regalar regalito obsequio cumple cumpleano aniversario',
}

// { mandan: 'envio', correo: 'envio', ... }
export const SYNONYMS = Object.fromEntries(
  Object.entries(GROUPS).flatMap(([root, words]) => words.split(/\s+/).map((word) => [word, root])),
)

// Palabras que indican una categoría de producto
export const CATEGORY_WORDS = {
  aro: 'aros', arito: 'aros', argolla: 'aros', pendiente: 'aros', caravana: 'aros', abridor: 'aros',
  collar: 'collares', collare: 'collares', cadena: 'collares', cadenita: 'collares', dije: 'collares', gargantilla: 'collares', choker: 'collares',
  anillo: 'anillos', sortija: 'anillos', alianza: 'anillos',
  pulsera: 'pulseras', esclava: 'pulseras', brazalete: 'pulseras', tobillera: 'pulseras',
}

// Terminación (coincide con FINISHES de utils/search.js)
export const FINISH_WORDS = { dorado: 'dorado', dorada: 'dorado', oro: 'dorado', plateado: 'plateado', plateada: 'plateado', plata: 'plateado' }

export const CHEAP_WORDS = new Set(['barato', 'barata', 'economico', 'economica'])
