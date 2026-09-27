# PRD — Ayy Que Monna (rediseño)

## Visión
Modernizar la tienda de bijouterie Ayy Que Monna con una estética elegante y minimalista
(referencia: gortaristudio.com), conservando todos los productos e imágenes originales,
y sumar gestión de catálogo y newsletter.

## Usuarios
- **Clienta:** navega el catálogo, ve detalle, compra desde el móvil.
- **Administradora:** gestiona productos y su orden sin tocar código.

## Fase 1 — Setup
- [x] Repositorio Git conectado a GitHub y primer commit en `main`
- [x] Crear CLAUDE.md y PRD.md
- [x] Scaffold Vite + React + Tailwind + linter
- [x] Configurar tokens de diseño (colores, fuentes, espaciados)
- [x] `.gitignore` para las fotos originales pesadas (~500 MB)
- [x] Carpeta `legacy/` creada con instrucciones
- [ ] Copiar la web original (HTML/CSS, sin imágenes pesadas) en `legacy/`
- [ ] Muestra de imágenes optimizadas (WebP) en `src/assets/`
- [x] `products.json` con 8 productos de MUESTRA y la estructura definitiva
- [ ] Reemplazar la muestra por el inventario real (nombre, precio, descripción, categoría, imágenes)
**Hecho cuando:** `npm run dev` levanta una página con fuentes y colores de marca.

## Fase 2 — Frontend e-commerce
- [ ] Header minimalista (logo centrado, menú, icono carrito) y footer
- [ ] Home: hero con imagen grande, colecciones destacadas, grid de novedades
- [ ] Tienda: grid de productos con filtro por categoría
- [ ] Página de producto: galería, precio, descripción, "Agregar al carrito"
- [ ] Carrito lateral (drawer) con persistencia en localStorage
- [ ] Checkout: por definir (WhatsApp, Mercado Pago, etc.)
- [ ] Responsive, accesible y con imágenes optimizadas
**Hecho cuando:** se puede navegar y armar un carrito con todos los productos originales.

## Fase 3 — Panel Admin con Drag & Drop
- [ ] Ruta `/admin` protegida con login
- [ ] CRUD de productos (crear, editar, borrar, subir imágenes)
- [ ] Reordenar productos y colecciones con drag & drop (dnd-kit)
- [ ] Backend/persistencia: por decidir (Supabase, Firebase, etc.)
**Hecho cuando:** la administradora cambia el orden en el panel y se refleja en la tienda.

## Fase 4 — Newsletter
- [ ] Formulario de suscripción en el footer y en un modal discreto
- [ ] Integración con proveedor (por decidir: Mailchimp, Brevo, Resend)
- [ ] Mensajes de confirmación y validación de email
**Hecho cuando:** una suscripción queda registrada en el proveedor.

## Fuera de alcance (por ahora)
Multi-idioma, cuentas de cliente, gestión de stock avanzada.

## Preguntas abiertas
- Método de pago y de envío
- Proveedor de backend y de newsletter
- Dominio y hosting (Vercel/Netlify)
