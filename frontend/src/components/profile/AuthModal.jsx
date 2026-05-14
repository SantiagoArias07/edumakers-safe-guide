import { useState, useId } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function AuthModal({ onClose }) {
  const { login, register } = useAuth()
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ email: '', password: '', name: '', city: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const uid = useId()

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email.trim() || !form.password.trim()) return
    setLoading(true)
    setError('')
    try {
      if (tab === 'login') {
        await login(form.email, form.password)
      } else {
        if (!form.name.trim()) { setError('El nombre es requerido'); setLoading(false); return }
        await register(form.email, form.password, form.name, form.city)
      }
      onClose?.()
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al procesar la solicitud')
    } finally {
      setLoading(false)
    }
  }

  const emailId = `${uid}-email`
  const passwordId = `${uid}-password`
  const nameId = `${uid}-name`
  const cityId = `${uid}-city`
  const errorId = `${uid}-error`

  return (
    <div className="max-w-sm w-full mx-auto">
      <div className="flex bg-gray-100 dark:bg-white/5 rounded-xl p-1 mb-6" role="tablist" aria-label="Tipo de acceso">
        {[
          { id: 'login', label: 'Iniciar sesión' },
          { id: 'register', label: 'Crear cuenta' },
        ].map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => { setTab(t.id); setError('') }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-soft/50 ${
              tab === t.id
                ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-cream shadow-sm'
                : 'text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        aria-label={tab === 'login' ? 'Formulario de inicio de sesión' : 'Formulario de registro'}
        aria-describedby={error ? errorId : undefined}
        noValidate
      >
        {tab === 'register' && (
          <div>
            <label htmlFor={nameId} className="block text-xs text-gray-500 dark:text-white/50 mb-1.5">
              Nombre
            </label>
            <input
              id={nameId}
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Tu nombre"
              className="input-field"
              autoComplete="name"
              required
            />
          </div>
        )}

        <div>
          <label htmlFor={emailId} className="block text-xs text-gray-500 dark:text-white/50 mb-1.5">
            Correo electrónico
          </label>
          <input
            id={emailId}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
            className="input-field"
            autoComplete={tab === 'login' ? 'email' : 'email'}
            required
          />
        </div>

        <div>
          <label htmlFor={passwordId} className="block text-xs text-gray-500 dark:text-white/50 mb-1.5">
            Contraseña
          </label>
          <div className="relative">
            <input
              id={passwordId}
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="input-field pr-10"
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              aria-pressed={showPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-soft/50 rounded"
            >
              {showPassword ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {tab === 'register' && (
          <div>
            <label htmlFor={cityId} className="block text-xs text-gray-500 dark:text-white/50 mb-1.5">
              Ciudad <span className="text-gray-400">(opcional)</span>
            </label>
            <input
              id={cityId}
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Ej: Monterrey, CDMX..."
              className="input-field"
              autoComplete="address-level2"
            />
          </div>
        )}

        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-red-500 dark:text-red-400 text-xs bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg px-3 py-2"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          aria-disabled={loading}
          className="w-full btn-primary flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
        >
          {loading && <Loader2 size={15} className="animate-spin" aria-hidden="true" />}
          {tab === 'login' ? 'Entrar' : 'Crear cuenta'}
        </button>
      </form>

      <p className="text-center text-gray-400 dark:text-white/30 text-xs mt-6">
        Tus datos son privados y nunca se comparten con terceros.
      </p>
    </div>
  )
}
