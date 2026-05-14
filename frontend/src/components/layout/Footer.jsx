import { Phone, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

const emergencyNumbers = [
  { name: 'LÍNEA VIDA', number: '800 911 2000', desc: '24 horas, gratuita' },
  { name: 'INMUJERES', number: '800 422 4460', desc: 'Orientación' },
  { name: 'CNDH', number: '800 715 2000', desc: 'Derechos humanos' },
  { name: 'Emergencias', number: '911', desc: 'Peligro inmediato' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-bg-navy border-t border-gray-200 dark:border-white/8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-purple-soft rounded-lg flex items-center justify-center">
                <Shield size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-lg text-gray-900 dark:text-cream">
                Safe<span className="text-coral">Guide</span> MX
              </span>
            </div>
            <p className="text-gray-500 dark:text-white/50 text-sm leading-relaxed">
              Orientación confidencial y recursos verificados para personas que viven o han vivido violencia de género en México.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-gray-900 dark:text-cream font-semibold mb-4 text-sm">Plataforma</h3>
            <ul className="space-y-2">
              {[
                { to: '/chat', label: 'Hablar con SafeGuide' },
                { to: '/mapa', label: 'Mapa de Recursos' },
                { to: '/perfil', label: 'Mi Perfil' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-500 dark:text-white/50 text-sm hover:text-coral transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency numbers */}
          <div>
            <h3 className="text-gray-900 dark:text-cream font-semibold mb-4 text-sm flex items-center gap-2">
              <Phone size={14} className="text-coral" />
              Números de Crisis
            </h3>
            <ul className="space-y-2">
              {emergencyNumbers.map((item) => (
                <li key={item.name} className="flex items-center justify-between">
                  <div>
                    <span className="text-gray-600 dark:text-white/70 text-xs">{item.name}</span>
                    <span className="text-gray-400 dark:text-white/40 text-xs ml-1">· {item.desc}</span>
                  </div>
                  <a
                    href={`tel:${item.number.replace(/\s/g, '')}`}
                    className="text-coral font-mono font-semibold text-sm hover:text-coral-light transition-colors"
                  >
                    {item.number}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-white/8 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 dark:text-white/30 text-xs">
            © 2026 SafeGuide MX · Información confidencial · No somos sustitutos de servicios de emergencia
          </p>
          <p className="text-gray-400 dark:text-white/30 text-xs">
            Datos de recursos: INMUJERES, CONAVIM, Fiscalías Estatales
          </p>
        </div>
      </div>
    </footer>
  )
}
