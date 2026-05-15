import { Link, useLocation } from 'react-router-dom'
import { Moon, Sun, Shield } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/chat', label: 'Chat' },
  { to: '/mapa', label: 'Mapa' },
  { to: '/acerca', label: 'Acerca de' },
]

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme()
  const { user } = useAuth()
  const { pathname } = useLocation()

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-bg-dark/90 backdrop-blur-md border-b border-gray-200/70 dark:border-white/8 h-16 flex items-center"
      aria-label="Navegación principal"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-soft/50 rounded-lg"
          aria-label="SafeGuide MX — Inicio"
        >
          <div className="w-7 h-7 bg-purple-soft rounded-lg flex items-center justify-center group-hover:bg-purple-dark transition-colors" aria-hidden="true">
            <Shield size={14} className="text-white" />
          </div>
          <span className="font-display font-bold text-base text-gray-900 dark:text-cream">
            Safe<span className="text-purple-soft">Guide</span>
          </span>
        </Link>

        {/* Desktop nav — hidden on mobile (bottom nav handles it) */}
        <div className="hidden md:flex items-center gap-0.5" role="list">
          {navLinks.map(({ to, label }) => {
            const isActive = pathname === to
            return (
              <Link
                key={to}
                to={to}
                role="listitem"
                aria-current={isActive ? 'page' : undefined}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-soft/50 ${
                  isActive
                    ? 'bg-purple-soft/8 dark:bg-purple-soft/15 text-purple-soft dark:text-purple-light'
                    : 'text-gray-500 dark:text-white/55 hover:text-gray-900 dark:hover:text-cream hover:bg-gray-100 dark:hover:bg-white/6'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="btn-ghost w-9 h-9 p-0"
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-pressed={isDark}
          >
            {isDark ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />}
          </button>

          {user ? (
            <Link
              to="/perfil"
              className="hidden md:flex w-8 h-8 rounded-full bg-purple-soft/15 dark:bg-purple-soft/25 items-center justify-center text-xs font-bold text-purple-soft dark:text-purple-light hover:bg-purple-soft/25 dark:hover:bg-purple-soft/35 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-soft/50"
              aria-label={`Perfil de ${user.name}`}
            >
              {user.name?.[0]?.toUpperCase() || 'U'}
            </Link>
          ) : (
            <Link to="/perfil" className="hidden md:block btn-secondary text-xs px-4 py-2 h-auto">
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
