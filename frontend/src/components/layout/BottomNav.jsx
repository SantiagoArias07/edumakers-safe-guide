import { Link, useLocation } from 'react-router-dom'
import { Home, MessageCircle, Map, User } from 'lucide-react'

const tabs = [
  { to: '/', icon: Home, label: 'Inicio' },
  { to: '/chat', icon: MessageCircle, label: 'Chat' },
  { to: '/mapa', icon: Map, label: 'Mapa' },
  { to: '/perfil', icon: User, label: 'Perfil' },
]

export default function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-bg-dark/95 backdrop-blur-md border-t border-gray-200/80 dark:border-white/8 safe-bottom"
      aria-label="Navegación principal"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch">
        {tabs.map(({ to, icon: Icon, label }) => {
          const isActive = pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] transition-colors duration-150 focus:outline-none focus-visible:bg-purple-soft/5 ${
                isActive ? 'text-purple-soft' : 'text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60'
              }`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={label}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.25 : 1.75}
                aria-hidden="true"
              />
              <span className={`text-2xs font-medium leading-none ${isActive ? 'text-purple-soft' : ''}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
