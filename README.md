# Ayy Que Monna

Tienda online de bijouterie: React 19 + Vite + Tailwind CSS, con Supabase como backend del panel de administración.

- `PRD.md`: fases del proyecto y estado de cada una.
- `CLAUDE.md`: stack, arquitectura y normas de diseño.

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # y completar con los datos de Supabase (ver Paso 0)
npm run dev                  # http://localhost:5173
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción en `dist/` |
| `npm run lint` | Revisa el código con oxlint |
| `npm run db:seed` | Regenera `supabase/seed.sql` (colecciones, productos y preguntas frecuentes) |
| `npm run brand:logo` | Genera el logo web (`design/logo-completo.png` → WebP transparente) y los favicons desde `design/` |
| `npm run brand:hero` | Convierte las fotos originales del carrusel (`design/hero/`) a WebP en `public/hero/` |

## Contenido editable sin programar

- **Testimonios:** `src/data/testimonials.js`. La sección "Lo que dicen de nosotros" aparece sola
  cuando la lista tiene al menos un testimonio. Solo reseñas reales y con permiso de la clienta.
- **Carrusel del inicio:** desde el panel, en **/admin/inicio** (foto, textos, botón y orden).
- **Colecciones:** desde el panel, en **/admin/colecciones**. Las selecciones automáticas del menú
  (Novedades, Destacados, Dorados, Plateados) están en `src/data/selections.js`.
- **WhatsApp, Instagram, envíos y puntos de retiro:** desde el panel, en **/admin/ajustes**.
- **Colores de los botones y títulos destacados:** en **/admin/ajustes** → **Colores de la marca**.
  Sin Supabase (modo local) se usan los valores de `DEFAULT_SETTINGS` en `src/config.js`.

---

## Paso 0: configuración inicial de Supabase

Se hace **una sola vez**. Toma unos 15 minutos. Los nombres de los menús de Supabase pueden
cambiar un poco con el tiempo; si algo no coincide, busca la opción equivalente.

### 1. Crear el proyecto
1. Entra a [supabase.com](https://supabase.com) e inicia sesión (puedes usar tu cuenta de GitHub).
2. **New project** y completa:
   - **Name:** `ayy-que-monna`
   - **Database password:** genera una segura y **guárdala** en un gestor de contraseñas.
   - **Region:** `South America (São Paulo)`, la más cercana a Argentina.
3. Espera 1 o 2 minutos a que el proyecto termine de crearse.

### 2. Crear la base de datos
1. Menú lateral → **SQL Editor** → **New query**.
2. Copia **todo** el contenido de [`supabase/schema.sql`](supabase/schema.sql), pégalo y toca **Run**.
   Tiene que decir *Success. No rows returned*.
3. Otra **New query**: pega **todo** [`supabase/seed.sql`](supabase/seed.sql) y toca **Run**.
4. Verifica en **Table Editor** → `products` que haya **67 filas**, en `collections` **1** (Marina), en `faqs` **5** y en `hero_slides` **7**.
5. En **Storage** tiene que aparecer el bucket **`products`**, marcado como *Public*.

> Los dos archivos se pueden volver a ejecutar sin romper nada. El seed **no** pisa
> productos que ya existan, así que no se pierden las ediciones hechas desde el panel.

> **Cuando `schema.sql` cambia** (por ejemplo, al sumar los Ajustes de la tienda): vuelve a pegar
> el archivo completo en el SQL Editor y toca **Run**. Revisa que el selector de rol (arriba a la
> derecha del editor) diga **postgres**; con otro rol aparece *permission denied*.
> Al actualizar a las colecciones configurables, el archivo convierte solo la antigua "Colección Marina"
> (con sus productos) en una colección normal: no hace falta volver a cargar el seed.

### 3. Crear la cuenta de administradora
1. **Authentication** → **Users** → **Add user** → **Create new user**.
2. Escribe el email y una contraseña segura, y marca **Auto Confirm User**.
3. Vuelve al **SQL Editor** y ejecuta esto, cambiando el email por el que usaste:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'tu-email@ejemplo.com';
   ```
   Tiene que decir *Success. 1 row affected*. Si dice *0 rows*, revisa que el email sea exactamente el mismo.

### 4. Cerrar el registro público (importante)
El panel es para una sola persona: nadie más debería poder crearse una cuenta.
1. **Authentication** → **Sign In / Providers** (en versiones anteriores: *Settings*).
2. Desactiva **Allow new users to sign up** y guarda.

> Aunque alguien lograra registrarse, no podría modificar nada: solo pueden escribir
> los usuarios que están en la tabla `admins`. Cerrar el registro es una segunda capa de seguridad.

### 5. Conectar la app
1. **Project Settings** → **API** (o **API Keys**).
2. Copia:
   - **Project URL**, algo como `https://abcdefghijklmnop.supabase.co`
   - la clave **anon public**, o la **publishable key** (`sb_publishable_...`) en proyectos nuevos
3. Crea el archivo `.env.local` en la raíz del proyecto (copiando `.env.example`) y complétalo:
   ```bash
   VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
4. Reinicia `npm run dev`: Vite solo lee `.env.local` al arrancar.

> ⚠️ **Nunca** uses la clave **service_role** / **secret** en este proyecto: saltea todas las
> reglas de seguridad. La clave *anon/publishable* sí es pública por diseño; lo que protege los
> datos son las políticas RLS de `schema.sql`.

---

## Usar el panel de administración

Entra a **`/admin`** (en local: `http://localhost:5173/admin`; publicado: `https://tu-dominio/admin`).
No hay ningún enlace visible en la tienda a propósito. Sin sesión, te lleva a `/admin/login`.

| Quiero… | Dónde |
|---|---|
| Ver y buscar productos | `/admin`: búsqueda por nombre o id, filtros por categoría y estado |
| Ocultar un producto sin borrarlo | Interruptor **Visible** en la lista (vuelve cuando lo enciendes) |
| Marcar Destacado o Nuevo | Interruptores de la lista (se guardan al instante) |
| Crear una colección | **Colecciones** → **Nueva colección** → nombre, color y productos → **Crear colección** |
| Agregar o quitar productos de una colección | **Colecciones** → lápiz → marcar o desmarcar productos → **Guardar cambios** (o desde el formulario de cada producto) |
| Cambiar el orden de las colecciones | **Colecciones** → flechas ↑ ↓ (se guarda al instante) |
| Mostrar u ocultar una colección en el inicio | **Colecciones** → interruptor **En el inicio** |
| Crear un producto | **Nuevo producto** → completar datos → agregar fotos → **Crear producto** |
| Editar precio, nombre, descripción o fotos | Ícono del lápiz → **Guardar cambios** |
| Cambiar la foto principal | En el formulario: estrella ☆ sobre la foto o flechas ← → |
| Eliminar para siempre | Ícono de la papelera → confirmar (borra también sus fotos subidas) |
| Cambiar el orden de la tienda | **Ordenar catálogo** → arrastrar (o flechas ↑ ↓) → **Guardar orden** |
| Editar las preguntas frecuentes | **Preguntas** → lápiz o **Nueva pregunta** (se usan en el asistente y en /preguntas-frecuentes) |
| Ver qué preguntó la gente y el asistente no supo | **Preguntas** → **Sin responder** → **Crear respuesta** |
| Probar cómo responde el asistente | **Preguntas** → cuadro **Probar el asistente** |
| Cargar el stock de un producto | Lápiz → sección **Stock**: *Sin control*, *Con stock* (unidades y "avisar con") o *A pedido* |
| Descontar una venta de WhatsApp | Columna **Stock** de la lista → botón **−** (y **+** al reponer). Se guarda al instante |
| Ver qué hay que reponer | Aviso **Revisa el stock** arriba de la lista, o filtro **Stock** → *Stock bajo* / *Agotados* |
| Cambiar los colores de botones y títulos | **Ajustes** → **Colores de la marca** → combinación lista o tus dos colores (con vista previa) → **Guardar ajustes** |
| Mostrar u ocultar "Últimas unidades" | **Ajustes** → **Inventario** |
| Activar Google Analytics o Meta Pixel | **Ajustes** → **Analítica** → pegar el ID (ver "Analítica" más abajo) |
| Apagar el asistente | **Ajustes** → **Mostrar el asistente en la tienda** |
| Cambiar el carrusel del inicio | **Inicio** → **Nueva diapositiva** o lápiz → foto, textos y a dónde lleva el botón (con vista previa) |
| Cambiar el WhatsApp de pedidos | **Ajustes** → número con código de país → **Probar este número** → **Guardar ajustes** |
| Cambiar Instagram, envíos o puntos de retiro | **Ajustes** → editar → **Guardar ajustes** |
| Salir | **Cerrar sesión** (arriba a la derecha) |

Notas:
- Las fotos se comprimen solas (WebP, máx. 1600 px) y se suben recién al guardar.
- El **id** (la dirección `/producto/…`) se elige al crear y después no se puede cambiar.
- Si sales de un formulario o del orden con cambios sin guardar, el panel te pregunta antes.
- La tienda toma los cambios al recargar la página.

**Si no puedes entrar**

| Mensaje | Qué hacer |
|---|---|
| "Supabase no está configurado" | Falta `.env.local` o no reiniciaste `npm run dev` |
| "Email o contraseña incorrectos" | Revisa los datos; la cuenta tiene que estar confirmada en Supabase |
| "Esta cuenta no tiene acceso al panel" | Falta tu usuario en `admins` (Paso 0.3) |
| "No se pudo conectar con el servidor" | Revisa internet y la URL de `.env.local` |

---

## Avisos de stock por email (opcional, gratis)

Cuando un producto con stock baja de su límite ("avisar con") o se agota, la base de datos agrega una fila en
`stock_alerts` y una función de Supabase te manda un email con [Resend](https://resend.com)
(plan gratis: 3.000 emails por mes). Los avisos del panel funcionan igual sin hacer nada de esto.
Se configura **una sola vez**; los menús de Supabase pueden cambiar un poco de nombre con el tiempo.

### 1. Resend
1. Crea una cuenta en [resend.com](https://resend.com) con **el email donde quieres recibir los avisos**.
2. **API Keys** → **Create API Key** (permiso *Sending access*) → copia la clave (empieza con `re_`).
   Guárdala en un gestor de contraseñas: no se vuelve a mostrar.

> Con el remitente de prueba de Resend (`onboarding@resend.dev`) solo se puede enviar al email de tu cuenta
> de Resend. Para una sola administradora alcanza. Si más adelante verificas tu dominio en Resend,
> puedes usar un remitente propio con el secreto `ALERT_EMAIL_FROM`.

### 2. Secretos de la función
En Supabase: **Edge Functions** → **Secrets** (o *Manage secrets*) → agrega:

| Nombre | Valor |
|---|---|
| `RESEND_API_KEY` | la clave `re_…` de Resend |
| `ALERT_EMAIL_TO` | el email de tu cuenta de Resend |
| `WEBHOOK_SECRET` | una contraseña larga inventada (ej: generada por tu gestor de contraseñas) |
| `SITE_URL` | *(opcional)* tu dominio, para que el email traiga el enlace al producto |

### 3. Crear la función
1. **Edge Functions** → **Deploy a new function** → **Via Editor**.
2. Nombre: `stock-alert`. Borra el ejemplo y pega **todo** [`supabase/functions/stock-alert/index.ts`](supabase/functions/stock-alert/index.ts).
3. **Deploy**.

### 4. Conectar la tabla con la función (Database Webhook)
1. **Database** → **Webhooks** (si pide activarlos, **Enable webhooks**) → **Create a new hook**.
2. Nombre: `aviso-stock` · Tabla: `stock_alerts` · Eventos: solo **Insert**.
3. Tipo: **Supabase Edge Functions** → función `stock-alert` · Método `POST`.
4. En **HTTP Headers**: toca **Add auth header with service key** y agrega otra cabecera
   `x-webhook-secret` con el mismo valor que pusiste en `WEBHOOK_SECRET`.
5. **Create webhook**.

### 5. Probar
En el panel, pon un producto en **Con stock** con 3 unidades y "avisar con" 2, y toca **−** una vez.
En un minuto te llega "Stock bajo: …". Si no llega: **Edge Functions** → `stock-alert` → **Logs**.

> 🔒 La clave de Resend vive solo en los secretos de Supabase. Nunca va en el código ni en `.env.local`.

---

## Analítica: Google Analytics 4 y Meta Pixel (opcional, gratis)

Cuando cargas un ID en **Ajustes → Analítica**, la tienda muestra un aviso de cookies. Solo si la visita
toca **Aceptar** se cargan los scripts de Google o Meta; si rechaza (o no elige), no se mide nada.
El panel `/admin` nunca se mide. Se registran: páginas vistas, producto visto, agregar al carrito,
"Finalizar pedido por WhatsApp" y contactos por WhatsApp desde el asistente o las preguntas frecuentes.

**Google Analytics 4**
1. En [analytics.google.com](https://analytics.google.com): **Administrar** → **Crear propiedad** (moneda: peso argentino).
2. **Flujos de datos** → **Web** → la dirección de tu tienda.
3. Copia el **ID de medición** (empieza con `G-`) y pégalo en **Ajustes → Analítica**.
4. Deja activada la **Medición mejorada** (con ella GA4 registra solo las páginas vistas).

**Meta Pixel** (para anuncios de Facebook e Instagram)
1. En el **Administrador de eventos** de Meta: **Conectar orígenes de datos** → **Web** → crea el píxel.
2. Elige instalarlo manualmente y copia solo el **ID del píxel** (son números). Pégalo en **Ajustes → Analítica**.

> Los datos tardan hasta 24–48 h en aparecer en los informes. Para probar al instante:
> **Tiempo real** en GA4, o **Probar eventos** en Meta (recuerda aceptar las cookies en la tienda).

---

## Deploy en Vercel

1. En [vercel.com](https://vercel.com): **Add New… → Project** e importa este repositorio.
   Vercel detecta Vite automáticamente.
2. En **Environment Variables** carga `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`, con los mismos valores que `.env.local`.
   Cuando tengas el dominio, suma `SITE_URL` (ej: `https://ayyquemonna.com.ar`): con eso cada build genera
   `sitemap.xml` para Google. Después, en Google Search Console, envía `https://tu-dominio/sitemap.xml`.
3. **Deploy**.

`vercel.json` redirige todas las rutas a `index.html`. Sin esa regla, abrir directamente una
dirección como `/tienda/aros` o `/admin` daría error 404, porque esas páginas las arma React
Router en el navegador y no existen como archivos en el servidor.

### Antes de publicar
- [ ] Cargar el número real de WhatsApp en **/admin/ajustes** (el de fábrica es de prueba).
- [ ] Verificar que el registro público de Supabase esté desactivado (Paso 0.4).
