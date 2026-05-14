import { Link, useLocation } from 'react-router-dom'
import { Moon, Sun, Shield, Menu, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
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
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Close mobile menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  return (
    <nav
      ref={menuRef}
      className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-bg-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-white/8"
      aria-label="Navegación principal"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-purple-soft/50 rounded-lg"
            aria-label="SafeGuide MX - Ir al inicio"
          >
            <div className="w-8 h-8 bg-purple-soft rounded-lg flex items-center justify-center group-hover:bg-purple-light transition-colors" aria-hidden="true">
              <Shield size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-gray-900 dark:text-cream">
              Safe<span className="text-coral">Guide</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1" role="list">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  role="listitem"
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-soft/50 ${
                    isActive
                      ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-cream'
                      : 'text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-cream hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-cream hover:bg-gray-100 dark:hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-purple-soft/50"
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              aria-pressed={isDark}
            >
              {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
            </button>

            {user ? (
              <Link
                to="/perfil"
                className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-cream transition-colors focus:outline-none focus:ring-2 focus:ring-purple-soft/50 rounded-full"
                aria-label={`Perfil de ${user.name}`}
              >
                <div
                  className="w-8 h-8 rounded-full bg-purple-soft/20 dark:bg-purple-soft/30 flex items-center justify-center text-xs font-bold text-purple-soft dark:text-purple-light"
                  aria-hidden="true"
                >
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
              </Link>
            ) : (
              <Link to="/perfil" className="hidden md:block btn-secondary text-xs px-4 py-2">
                Iniciar sesión
              </Link>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-cream hover:bg-gray-100 dark:hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-purple-soft/50"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-white/95 dark:bg-bg-dark/95 border-t border-gray-200 dark:border-white/8 px-4 py-3 space-y-1"
          role="menu"
          aria-label="Menú de navegación móvil"
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                role="menuitem"
                aria-current={isActive ? 'page' : undefined}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-soft/50 ${
                  isActive
                    ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-cream'
                    : 'text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-cream hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
          <div className="pt-2 border-t border-gray-200 dark:border-white/8">
            <Link to="/perfil" role="menuitem" className="block px-4 py-3 rounded-lg text-sm font-medium text-purple-soft hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
              {user ? `Perfil de ${user.name}` : 'Iniciar sesión'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
