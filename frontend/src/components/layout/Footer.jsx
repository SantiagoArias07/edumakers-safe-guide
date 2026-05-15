import { Phone, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

const emergencyNumbers = [
  { name: 'LÍNEA VIDA', number: '800 911 2000', desc: '24h, gratuita' },
  { name: 'INMUJERES', number: '800 422 4460', desc: 'Orientación' },
  { name: 'CNDH', number: '800 715 2000', desc: 'Derechos humanos' },
  { name: 'Emergencias', number: '911', desc: 'Peligro inmediato' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-bg-navy border-t border-gray-200/60 dark:border-white/8 pb-20 md:pb-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-soft/50 rounded-lg inline-flex" aria-label="SafeGuide MX">
              <div className="w-7 h-7 bg-purple-soft rounded-lg flex items-center justify-center" aria-hidden="true">
                <Shield size={14} className="text-white" />
              </div>
              <span className="font-display font-bold text-base text-gray-900 dark:text-cream">
                Safe<span className="text-purple-soft">Guide</span>
              </span>
            </Link>
            <p className="text-gray-500 dark:text-white/45 text-sm leading-relaxed max-w-xs">
              Orientación confidencial y recursos verificados para personas en situación de violencia en México.
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Navegación del sitio">
            <h3 className="text-gray-900 dark:text-cream font-semibold mb-4 text-sm">Plataforma</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/chat', label: 'Hablar con SafeGuide' },
                { to: '/mapa', label: 'Mapa de Recursos' },
                { to: '/perfil', label: 'Mi Perfil' },
                { to: '/acerca', label: 'Acerca de' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-500 dark:text-white/45 text-sm hover:text-purple-soft dark:hover:text-purple-light transition-colors focus:outline-none focus-visible:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Emergency numbers */}
          <div>
            <h3 className="text-gray-900 dark:text-cream font-semibold mb-4 text-sm flex items-center gap-1.5">
              <Phone size={13} className="text-coral" aria-hidden="true" />
              Líneas de Crisis
            </h3>
            <ul className="space-y-3">
              {emergencyNumbers.map((item) => (
                <li key={item.name} className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-gray-700 dark:text-white/65 text-xs font-medium">{item.name}</span>
                    <span className="text-gray-400 dark:text-white/30 text-xs ml-1.5">· {item.desc}</span>
                  </div>
                  <a
                    href={`tel:${item.number.replace(/\s/g, '')}`}
                    className="text-coral font-mono font-semibold text-sm hover:text-coral-light transition-colors focus:outline-none focus-visible:underline"
                    aria-label={`Llamar a ${item.name}: ${item.number}`}
                  >
                    {item.number}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200/60 dark:border-white/8 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-400 dark:text-white/30 text-xs">
            © 2026 SafeGuide MX · No somos sustitutos de servicios de emergencia
          </p>
          <p className="text-gray-400 dark:text-white/30 text-xs">
            Recursos: INMUJERES · CONAVIM · Fiscalías Estatales
          </p>
        </div>
      </div>
    </footer>
  )
}
