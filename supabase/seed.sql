-- =============================================================================
-- Ayy Que Monna — Carga inicial de productos
-- =============================================================================
-- ARCHIVO GENERADO por scripts/generate-seed.mjs a partir de src/data/products.json.
-- No editar a mano: modificar el JSON y ejecutar "npm run db:seed".
--
-- Cómo usarlo: Supabase → SQL Editor → pegar este archivo → Run
-- (DESPUÉS de haber ejecutado schema.sql).
-- Es seguro ejecutarlo de nuevo: los productos que ya existen no se modifican.
-- Productos: 67
-- =============================================================================

insert into public.products
  (id, name, description, price, category, images, is_featured, is_new, collection, is_visible, position)
values
  ('esclava-simple', 'ESCLAVA SIMPLE', 'Consultar color disponible por WhatsApp.', 6500, 'pulseras', array['/products/esclavasS.jpeg']::text[], true, true, null, true, 1),
  ('esclava-bamboo', 'ESCLAVA BAMBOO', 'Consultar color disponible por WhatsApp.', 6500, 'pulseras', array['/products/esclavasB.jpeg']::text[], true, true, null, true, 2),
  ('esclava-flores', 'ESCLAVA FLORES', 'Consultar color disponible por WhatsApp.', 6500, 'pulseras', array['/products/esclavasF.jpeg']::text[], true, true, null, true, 3),
  ('collar-lili', 'COLLAR LILI', '', 6300, 'collares', array['/products/collarLili.jpeg']::text[], true, true, null, true, 4),
  ('collar-tortuga-dorado', 'COLLAR TORTUGA DORADO', '', 6100, 'collares', array['/products/collarTortugaD.jpeg']::text[], false, true, 'marina', true, 5),
  ('collar-tortuga-plateado', 'COLLAR TORTUGA PLATEADO', '', 6100, 'collares', array['/products/collarTortugaP.jpeg']::text[], false, true, 'marina', true, 6),
  ('collar-caballito-de-mar-dorado', 'COLLAR CABALLITO DE MAR DORADO', '', 7500, 'collares', array['/products/collarCaballitoD.jpeg']::text[], false, true, 'marina', true, 7),
  ('collar-caballito-de-mar-plateado', 'COLLAR CABALLITO DE MAR PLATEADO', '', 7500, 'collares', array['/products/collarCaballito.jpeg']::text[], false, true, 'marina', true, 8),
  ('collar-ballena', 'COLLAR BALLENA', '', 9500, 'collares', array['/products/collarBallena.jpeg']::text[], false, true, 'marina', true, 9),
  ('collar-estrella', 'COLLAR ESTRELLA', '', 5800, 'collares', array['/products/collarEstrellaP.jpeg']::text[], false, true, null, true, 10),
  ('aros-pali', 'AROS PALI', '', 6350, 'aros', array['/products/arosPali.jpeg']::text[], true, true, null, true, 11),
  ('pulsera-arabe', 'PULSERA ARABE', '', 2500, 'pulseras', array['/products/pulseraArabe.jpeg']::text[], false, true, null, true, 12),
  ('pulsera-blues', 'PULSERA BLUES', '', 2500, 'pulseras', array['/products/pulseraBlues.jpeg']::text[], false, true, null, true, 13),
  ('pulsera-verde-agua', 'PULSERA VERDE AGUA', '', 2500, 'pulseras', array['/products/pulseraVerdeAgua.jpeg']::text[], false, true, null, true, 14),
  ('pulsera-lili', 'PULSERA LILI', '', 2500, 'pulseras', array['/products/pulseraLili.jpeg']::text[], false, true, null, true, 15),
  ('anillos-sol-y-luna', 'ANILLOS SOL Y LUNA', '', 6800, 'anillos', array['/products/anillosSolLuna.jpg']::text[], false, false, null, true, 16),
  ('collar-cristal', 'COLLAR CRISTAL', '', 4700, 'collares', array['/products/collarCristal.jpg']::text[], false, false, null, true, 17),
  ('collar-glow', 'COLLAR GLOW', '', 5300, 'collares', array['/products/collarGlow.jpg']::text[], false, false, null, true, 18),
  ('aros-brillantes-dorados', 'AROS BRILLANTES DORADOS', '', 3800, 'aros', array['/products/arosBrillantes.jpg']::text[], false, false, null, true, 19),
  ('aros-amor-plateados', 'AROS AMOR PLATEADOS', '', 3100, 'aros', array['/products/arosAmorP.jpg']::text[], false, false, null, true, 20),
  ('anillo-primavera-plateado', 'ANILLO PRIMAVERA PLATEADO', '', 4200, 'anillos', array['/products/AnilloPrimaveraP.jpg']::text[], true, false, null, true, 21),
  ('collar-serpiente-dorado', 'COLLAR SERPIENTE DORADO', '', 3300, 'collares', array['/products/cadenaSerpienteDd.jpg', '/products/cadenaSerpienteD.jpg']::text[], false, false, null, true, 22),
  ('collar-serpiente-plateado', 'COLLAR SERPIENTE PLATEADO', '', 3300, 'collares', array['/products/cadenaSSS.png']::text[], false, false, null, true, 23),
  ('aros-brillito-dorados', 'AROS BRILLITO DORADOS', '', 1500, 'aros', array['/products/aritosBrillitoD.jpg']::text[], false, false, null, true, 24),
  ('aros-brillito-plateados', 'AROS BRILLITO PLATEADOS', '', 1500, 'aros', array['/products/aritosBrillitoP.jpg']::text[], false, false, null, true, 25),
  ('collar-celeste-dorado', 'COLLAR CELESTE DORADO', '', 3500, 'collares', array['/products/collarCelesteD.jpg']::text[], false, false, 'marina', true, 26),
  ('collar-celeste-plateado', 'COLLAR CELESTE PLATEADO', '', 3500, 'collares', array['/products/collarCelesteP.jpg']::text[], false, false, 'marina', true, 27),
  ('anillo-coeur-plateado', 'ANILLO COEUR PLATEADO', '', 3700, 'anillos', array['/products/anilloCoeurP.jpg']::text[], false, false, null, true, 28),
  ('anillo-coeur-dorado', 'ANILLO COEUR DORADO', '', 3700, 'anillos', array['/products/anilloCoeurD.jpg']::text[], false, false, null, true, 29),
  ('aros-flora', 'AROS FLORA', '', 5875, 'aros', array['/products/arosFlora.jpg']::text[], true, false, null, true, 30),
  ('aros-lumine', 'AROS LUMINE', '', 5100, 'aros', array['/products/arosLumine.jpg']::text[], false, false, null, true, 31),
  ('aros-lagoon', 'AROS LAGOON', '', 5100, 'aros', array['/products/arosLagoon.jpg']::text[], false, false, null, true, 32),
  ('anillo-enigma', 'ANILLO ENIGMA', '', 3300, 'anillos', array['/products/anilloEnigma.jpg']::text[], false, false, null, true, 33),
  ('relicario-lumine', 'RELICARIO LUMINE', '', 7500, 'collares', array['/products/collarLumine.jpg']::text[], false, false, null, true, 34),
  ('anillo-inca', 'ANILLO INCA', '', 3100, 'anillos', array['/products/anilloInca.jpg']::text[], false, false, null, true, 35),
  ('collar-arte', 'COLLAR ARTE', '', 6000, 'collares', array['/products/collarArte.jpg']::text[], true, false, null, true, 36),
  ('collar-margarita', 'COLLAR MARGARITA', '', 6250, 'collares', array['/products/collarMargarita.jpg']::text[], true, false, null, true, 37),
  ('anillo-dots-plateado', 'ANILLO DOTS PLATEADO', '', 2700, 'anillos', array['/products/anilloDotsP.jpg']::text[], false, false, null, true, 38),
  ('pulsera-azul-dorada', 'PULSERA AZUL DORADA', '', 2000, 'pulseras', array['/products/pulseraDoradaAzul1.jpg', '/products/pulseraDoradaAzul.jpg']::text[], false, true, null, true, 39),
  ('pulsera-azul-verde', 'PULSERA AZUL VERDE', '', 2000, 'pulseras', array['/products/pAzulVerde.jpg']::text[], false, true, null, true, 40),
  ('pulsera-violeta-rosa-y-azul', 'PULSERA VIOLETA, ROSA Y AZUL', '', 2000, 'pulseras', array['/products/pVAR.jpg']::text[], false, true, null, true, 41),
  ('pulsera-violeta', 'PULSERA VIOLETA', '', 2000, 'pulseras', array['/products/pv.jpg']::text[], false, true, null, true, 42),
  ('pulsera-princesa', 'PULSERA PRINCESA', '', 2000, 'pulseras', array['/products/pprin.jpg', '/products/pulseraPrincesa.jpg']::text[], false, true, null, true, 43),
  ('anillo-dots-dorado', 'ANILLO DOTS DORADO', '', 2700, 'anillos', array['/products/anilloDotsD.jpg']::text[], false, false, null, true, 44),
  ('anillo-cherist', 'ANILLO CHERIST', '', 2500, 'anillos', array['/products/anilloCherist.jpg']::text[], false, false, null, true, 45),
  ('collar-amor-plateado', 'COLLAR AMOR PLATEADO', '', 3700, 'collares', array['/products/collarAmorP.jpg']::text[], false, false, null, true, 46),
  ('collar-amor-dorado', 'COLLAR AMOR DORADO', '', 3700, 'collares', array['/products/collarAmorD.jpg']::text[], false, false, null, true, 47),
  ('aros-texturados-dorados', 'AROS TEXTURADOS DORADOS', '', 3000, 'aros', array['/products/arosTexturados.jpg']::text[], false, false, null, true, 48),
  ('aros-texturados-plateados', 'AROS TEXTURADOS PLATEADOS', '', 3000, 'aros', array['/products/arosTexturadosP.jpg']::text[], false, false, null, true, 49),
  ('collar-tulipan', 'COLLAR TULIPAN', '', 6450, 'collares', array['/products/collarTulipan.jpg']::text[], true, false, null, true, 50),
  ('collar-ofelia', 'COLLAR OFELIA', '', 6000, 'collares', array['/products/collarOfelia.jpg']::text[], true, false, null, true, 51),
  ('pulsera-medusa', 'PULSERA MEDUSA', '', 6300, 'pulseras', array['/products/pulseraMedusa1.jpg']::text[], false, false, 'marina', true, 52),
  ('anillo-bob-esponja', 'ANILLO BOB ESPONJA', '', 2500, 'anillos', array['/products/anilloBob.jpg']::text[], true, false, null, true, 53),
  ('anillo-tempestad', 'ANILLO TEMPESTAD', '', 2900, 'anillos', array['/products/anilloTempestad.jpg']::text[], false, false, null, true, 54),
  ('anillo-primavera', 'ANILLO PRIMAVERA', '', 4200, 'anillos', array['/products/AnilloPrimavera.jpg']::text[], true, false, null, true, 55),
  ('anillo-infinito', 'ANILLO INFINITO', '', 2800, 'anillos', array['/products/anilloInfinito.jpg']::text[], false, false, null, true, 56),
  ('anillo-infinito-plateado', 'ANILLO INFINITO PLATEADO', '', 1800, 'anillos', array['/products/anilloInfinitoP.jpg']::text[], false, false, null, true, 57),
  ('anillo-bamboo', 'ANILLO BAMBOO', '', 2100, 'anillos', array['/products/anilloBamboo.jpg']::text[], false, false, null, true, 58),
  ('anillo-floral', 'ANILLO FLORAL', '', 2300, 'anillos', array['/products/anilloFloral.jpg']::text[], true, false, null, true, 59),
  ('anillo-granate', 'ANILLO GRANATE', '', 3000, 'anillos', array['/products/anilloGranate.jpg']::text[], false, false, null, true, 60),
  ('anillo-margarita', 'ANILLO MARGARITA', '', 2500, 'anillos', array['/products/anilloMargarita.jpg']::text[], true, false, null, true, 61),
  ('anillo-ola', 'ANILLO OLA', '', 1900, 'anillos', array['/products/anilloOla.jpg']::text[], false, false, 'marina', true, 62),
  ('pulsera-marina', 'PULSERA MARINA', '', 5000, 'pulseras', array['/products/pulseraMarina.jpg']::text[], false, false, 'marina', true, 63),
  ('pulsera-caballito-de-mar', 'PULSERA CABALLITO DE MAR', '', 5800, 'pulseras', array['/products/pulseraCaballito.jpg']::text[], false, false, null, true, 64),
  ('collar-acuatico-dorado', 'COLLAR ACUATICO DORADO', '', 5750, 'collares', array['/products/collarAcuatico.jpg']::text[], false, false, 'marina', true, 65),
  ('collar-acuatico-plateado', 'COLLAR ACUATICO PLATEADO', '', 5750, 'collares', array['/products/collarAcuaticoP.jpg']::text[], false, false, 'marina', true, 66),
  ('anillo-floral-plateado', 'ANILLO FLORAL PLATEADO', '', 2300, 'anillos', array['/products/anilloFloralP.jpg']::text[], true, false, 'marina', true, 67)
on conflict (id) do nothing;
