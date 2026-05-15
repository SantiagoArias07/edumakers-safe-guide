import { motion } from 'framer-motion'
import { Scale, Home, Heart, Shield, Phone, Info, ArrowRight } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const QUICK_STARTERS = [
  { icon: Scale,  text: '¿Cómo levanto una denuncia?',   colorClass: 'text-purple-soft dark:text-purple-light' },
  { icon: Home,   text: 'Necesito un refugio o albergue', colorClass: 'text-coral' },
  { icon: Heart,  text: 'Quiero apoyo psicológico',       colorClass: 'text-blue-500 dark:text-blue-400' },
  { icon: Shield, text: '¿Cuáles son mis derechos?',      colorClass: 'text-emerald-600 dark:text-emerald-400' },
]

const EMERGENCY = [
  { name: 'LÍNEA VIDA', number: '800 911 2000', href: 'tel:8009112000', dotCls: 'bg-coral' },
  { name: 'Emergencias', number: '911',          href: 'tel:911',        dotCls: 'bg-red-500' },
  { name: 'CNDH',       number: '800 715 2000', href: 'tel:8007152000', dotCls: 'bg-purple-soft' },
]

const stagger = (i) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] },
})

export default function ChatContextPanel({ onSendPrompt }) {
  const { isDark } = useTheme()

  const sideBg    = isDark ? '#0D0D18'               : '#FAFAFA'
  const sideBorder= isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
  const labelColor= isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.35)'
  const itemText  = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.5)'
  const itemHover = isDark ? 'rgba(255,255,255,0.85)' : '#1f2937'
  const itemHoverBg=isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'
  const arrowColor= isDark ? 'rgba(255,255,255,0.2)'  : 'rgba(0,0,0,0.2)'
  const emBg      = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'
  const emBorder  = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'
  const emBgHover = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const emName    = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)'
  const emNum     = isDark ? 'rgba(255,255,255,0.8)'  : '#1f2937'
  const emNumHov  = isDark ? 'white'                  : '#111827'
  const divColor  = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
  const noteBg    = isDark ? 'rgba(124,92,191,0.07)'  : 'rgba(124,92,191,0.06)'
  const noteBorder= isDark ? 'rgba(124,92,191,0.15)'  : 'rgba(124,92,191,0.2)'
  const noteTitle = isDark ? '#9B7FD4'                : '#7C5CBF'
  const noteText  = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.45)'
  const phoneIcon = isDark ? 'rgba(255,255,255,0.3)'  : 'rgba(0,0,0,0.35)'

  return (
    <aside
      className="hidden xl:flex flex-col overflow-y-auto"
      style={{ background: sideBg, borderLeft: `1px solid ${sideBorder}`, width: '268px', flexShrink: 0 }}
      aria-label="Panel contextual"
    >
      <div className="p-5 space-y-6 flex-1">

        {/* Quick starters */}
        <section aria-labelledby="starters-heading">
          <h3 id="starters-heading" className="text-2xs font-semibold uppercase tracking-widest mb-3" style={{ color: labelColor }}>
            Empezar con
          </h3>
          <div className="space-y-1">
            {QUICK_STARTERS.map((item, i) => (
              <motion.button
                key={item.text}
                {...stagger(i)}
                onClick={() => onSendPrompt?.(item.text)}
                className={`w-full flex items-start gap-3 px-3 py-3 rounded-xl text-left group transition-all duration-150 focus-visible:ring-2 focus-visible:ring-purple-soft/50`}
                style={{ background: 'transparent' }}
                onMouseEnter={e => { e.currentTarget.style.background = itemHoverBg }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                aria-label={`Iniciar: ${item.text}`}
              >
                <item.icon size={14} className={`${item.colorClass} flex-shrink-0 mt-0.5`} aria-hidden="true" />
                <span className="text-xs leading-relaxed transition-colors flex-1" style={{ color: itemText }}
                  onMouseEnter={e => e.currentTarget.style.color = itemHover}
                  onMouseLeave={e => e.currentTarget.style.color = itemText}
                >
                  {item.text}
                </span>
                <ArrowRight size={12} className="ml-auto flex-shrink-0 mt-0.5 transition-colors" style={{ color: arrowColor }} aria-hidden="true" />
              </motion.button>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="h-px" style={{ background: divColor }} />

        {/* Emergency numbers */}
        <section aria-labelledby="emergency-heading">
          <h3 id="emergency-heading" className="text-2xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-1.5" style={{ color: labelColor }}>
            <Phone size={11} style={{ color: phoneIcon }} aria-hidden="true" />
            Líneas de crisis
          </h3>
          <div className="space-y-2">
            {EMERGENCY.map((item, i) => (
              <motion.a
                key={item.name}
                {...stagger(i + 4)}
                href={item.href}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl group transition-all duration-150 no-underline"
                style={{ background: emBg, border: `1px solid ${emBorder}` }}
                onMouseEnter={e => { e.currentTarget.style.background = emBgHover }}
                onMouseLeave={e => { e.currentTarget.style.background = emBg }}
                aria-label={`Llamar a ${item.name}: ${item.number}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${item.dotCls} flex-shrink-0`} aria-hidden="true" />
                  <span className="text-xs" style={{ color: emName }}>{item.name}</span>
                </div>
                <span
                  className="text-xs font-mono font-semibold transition-colors"
                  style={{ color: emNum }}
                  onMouseEnter={e => e.currentTarget.style.color = emNumHov}
                  onMouseLeave={e => e.currentTarget.style.color = emNum}
                >
                  {item.number}
                </span>
              </motion.a>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="h-px" style={{ background: divColor }} />

        {/* Privacy note */}
        <motion.section
          {...stagger(8)}
          className="rounded-xl p-4"
          style={{ background: noteBg, border: `1px solid ${noteBorder}` }}
          aria-labelledby="privacy-note"
        >
          <div className="flex items-start gap-2.5">
            <Info size={13} style={{ color: noteTitle }} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 id="privacy-note" className="text-xs font-semibold mb-1" style={{ color: noteTitle }}>
                Espacio confidencial
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: noteText }}>
                Esta conversación es privada. Puedes usarla sin crear una cuenta. Nada se comparte con terceros.
              </p>
            </div>
          </div>
        </motion.section>

      </div>
    </aside>
  )
}
