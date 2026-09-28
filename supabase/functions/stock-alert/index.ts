// Supabase Edge Function "stock-alert": envía un email cuando se agrega una fila a
// public.stock_alerts (stock bajo o agotado). La dispara un Database Webhook (ver README).
//
// Está escrita en JavaScript (sin tipos de TypeScript) para que se lea igual que el resto
// del proyecto; el archivo se llama index.ts porque es lo que espera Supabase.
//
// Secretos (Supabase → Edge Functions → Secrets). NUNCA van en el código:
//   RESEND_API_KEY   clave de la API de Resend
//   ALERT_EMAIL_TO   a quién le llega el aviso (con el remitente de prueba de Resend,
//                    tiene que ser el mismo email con el que creaste la cuenta de Resend)
//   WEBHOOK_SECRET   una contraseña larga inventada; el webhook la manda en la cabecera x-webhook-secret
//   ALERT_EMAIL_FROM (opcional) remitente; por defecto el de prueba de Resend
//   SITE_URL         (opcional) dominio de la tienda, para el enlace al panel
// Todo en un solo archivo, para poder pegarlo tal cual en el editor web de Supabase.

// --- Armado del email (función pura: se prueba sin red) ---

// Escapa los caracteres especiales de HTML: el nombre del producto lo escribe una persona
const escapeHtml = (text) =>
  String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

export function buildStockEmail(alert, siteUrl = '') {
  const isOut = alert.kind === 'out'
  const units = alert.stock === 1 ? '1 unidad' : `${alert.stock} unidades`
  const subject = isOut ? `Agotado: ${alert.product_name}` : `Stock bajo: ${alert.product_name} (${units})`
  const detail = isOut
    ? 'se quedó sin unidades. En la tienda ya se muestra como "Agotado" y no se puede agregar al carrito.'
    : `tiene ${units} (tu aviso es con ${alert.threshold} o menos).`
  const panelUrl = siteUrl ? `${siteUrl.replace(/\/+$/, '')}/admin/productos/${encodeURIComponent(alert.product_id)}` : ''

  const text = [`${alert.product_name} ${detail}`, panelUrl && `Editar el producto: ${panelUrl}`, '— Ayy Que Monna']
    .filter(Boolean)
    .join('\n\n')

  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#1A1A1A;line-height:1.5">
  <p><strong>${escapeHtml(alert.product_name)}</strong> ${escapeHtml(detail)}</p>
  ${panelUrl ? `<p><a href="${escapeHtml(panelUrl)}" style="color:#BE185D">Editar el producto en el panel</a></p>` : ''}
  <p style="color:#716C67;font-size:13px">Aviso automático de Ayy Que Monna</p>
</div>`

  return { subject, text, html }
}

// --- Servidor de la función ---

Deno.serve(async (request) => {
  // Solo aceptamos llamadas del webhook (que conoce el secreto)
  if (request.headers.get('x-webhook-secret') !== Deno.env.get('WEBHOOK_SECRET')) {
    return new Response('No autorizado', { status: 401 })
  }

  const payload = await request.json()
  const alert = payload.record
  if (payload.type !== 'INSERT' || payload.table !== 'stock_alerts' || !alert) {
    return new Response('Nada que hacer', { status: 200 })
  }

  const { subject, text, html } = buildStockEmail(alert, Deno.env.get('SITE_URL') ?? '')
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: Deno.env.get('ALERT_EMAIL_FROM') ?? 'Ayy Que Monna <onboarding@resend.dev>',
      to: [Deno.env.get('ALERT_EMAIL_TO')],
      subject,
      text,
      html,
    }),
  })

  if (!response.ok) {
    // Queda en los registros (Logs) de la función para poder revisarlo
    console.error('Resend respondió', response.status, await response.text())
    return new Response('No se pudo enviar el email', { status: 502 })
  }
  return new Response('Email enviado', { status: 200 })
})
