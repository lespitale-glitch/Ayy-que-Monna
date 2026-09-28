import { useMemo, useState } from 'react'
import SettingsForm from '../../components/admin/settings/SettingsForm.jsx'
import { useSettingsEditor } from '../../hooks/useSettingsEditor.js'
import { valuesFromSettings } from '../../utils/settings.js'

// /admin/ajustes: WhatsApp, Instagram y envíos de la tienda
function AdminSettings() {
  const editor = useSettingsEditor()
  const [flash, setFlash] = useState('')
  // useMemo: los valores iniciales se arman una vez por cada versión guardada
  const initialValues = useMemo(() => editor.settings && valuesFromSettings(editor.settings), [editor.settings])

  const handleSubmit = async (values) => {
    setFlash('')
    if (await editor.save(values)) setFlash('Ajustes guardados. La tienda los muestra al recargar la página.')
  }

  return (
    <section>
      <p className="text-xs uppercase tracking-widest text-stone">Configuración</p>
      <h1 className="mt-2 text-4xl">Ajustes de la tienda</h1>

      {/* role="status": el lector de pantalla anuncia el mensaje sin mover el foco */}
      <p role="status" className={flash ? 'mt-6 border-l-2 border-fucsia bg-white p-4 text-sm' : 'sr-only'}>
        {flash}
      </p>

      {editor.status === 'loading' && (
        <p role="status" className="animate-pulse py-24 text-center text-xs uppercase tracking-widest text-stone">
          Cargando ajustes…
        </p>
      )}
      {editor.status === 'error' && (
        <p role="alert" className="mt-10 text-sm">
          No se pudieron cargar los ajustes. Recarga la página para intentar de nuevo.
        </p>
      )}
      {editor.status === 'ready' && (
        <SettingsForm
          // Tras guardar, "version" cambia y el formulario vuelve a empezar desde lo guardado
          key={editor.version}
          initialValues={initialValues}
          isSaving={editor.isSaving}
          saveError={editor.saveError}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  )
}

export default AdminSettings
