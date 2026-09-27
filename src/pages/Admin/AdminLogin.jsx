import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import AdminLoader from '../../components/admin/AdminLoader.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { getAuthErrorMessage } from '../../utils/authErrors.js'

const inputClass =
  'mt-2 block h-12 w-full border border-line bg-white px-4 text-sm outline-none transition-colors duration-300 ease-soft focus:border-ink'

function AdminLogin() {
  const { isConfigured, isLoading, isAdmin, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  // Página a la que se quería entrar antes de ser enviada al login
  const redirectTo = location.state?.from ?? '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isLoading) return <AdminLoader />
  // Si ya hay sesión de administradora, no tiene sentido mostrar el login
  if (isAdmin) return <Navigate to={redirectTo} replace />

  const handleSubmit = async (event) => {
    // Evita que el formulario recargue la página (comportamiento por defecto del navegador)
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await signIn(email.trim(), password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(getAuthErrorMessage(err))
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <p className="text-center font-serif text-3xl font-light">
          Ayy Que <span className="italic">Monna</span>
        </p>
        <h1 className="mt-3 text-center font-sans text-xs font-normal uppercase tracking-widest text-stone">
          Panel de administración
        </h1>

        {!isConfigured ? (
          <p role="alert" className="mt-10 border border-line bg-white p-6 text-sm leading-relaxed">
            Supabase no está configurado. Completa <code>.env.local</code> siguiendo el Paso 0 del README y reinicia{' '}
            <code>npm run dev</code>.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-6" noValidate>
            <div>
              <label htmlFor="email" className="text-xs uppercase tracking-widest">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="password" className="text-xs uppercase tracking-widest">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>

            {error && (
              <p role="alert" className="border-l-2 border-ink bg-white px-4 py-3 text-sm">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !email || !password}
              className="h-12 w-full bg-ink text-xs uppercase tracking-widest text-bone transition-colors duration-300 ease-soft hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSubmitting ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}

export default AdminLogin
