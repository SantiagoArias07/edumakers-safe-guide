import { motion } from 'framer-motion'
import { Scale, Home, Heart, Shield, Phone, Info, ArrowRight } from 'lucide-react'

const QUICK_STARTERS = [
  { icon: Scale,  text: '¿Cómo levanto una denuncia?',  color: 'text-purple-light' },
  { icon: Home,   text: 'Necesito un refugio o albergue', color: 'text-coral' },
  { icon: Heart,  text: 'Quiero apoyo psicológico',      color: 'text-blue-400' },
  { icon: Shield, text: '¿Cuáles son mis derechos?',     color: 'text-emerald-400' },
]

const EMERGENCY = [
  { name: 'LÍNEA VIDA', number: '800 911 2000', href: 'tel:8009112000', dot: 'bg-coral' },
  { name: 'Emergencias', number: '911',         href: 'tel:911',        dot: 'bg-red-500' },
  { name: 'CNDH',       number: '800 715 2000', href: 'tel:8007152000', dot: 'bg-purple-soft' },
]

const stagger = (i) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] },
})

export default function ChatContextPanel({ onSendPrompt }) {
  return (
    <aside
      className="hidden xl:flex flex-col border-l border-white/[0.06] overflow-y-auto"
      style={{ background: '#0D0D18', width: '268px', flexShrink: 0 }}
      aria-label="Panel contextual"
    >
      <div className="p-5 space-y-6 flex-1">

        {/* Quick starters */}
        <section aria-labelledby="starters-heading">
          <h3 id="starters-heading" className="text-white/30 text-2xs font-semibold uppercase tracking-widest mb-3">
            Empezar con
          </h3>
          <div className="space-y-1.5">
            {QUICK_STARTERS.map((item, i) => (
              <motion.button
                key={item.text}
                {...stagger(i)}
                onClick={() => onSendPrompt?.(item.text)}
                className="w-full flex items-start gap-3 px-3 py-3 rounded-xl text-left group transition-all duration-150 focus-visible:ring-2 focus-visible:ring-purple-soft/50"
                style={{ background: 'transparent' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                aria-label={`Iniciar conversación: ${item.text}`}
              >
                <item.icon size={14} className={`${item.color} flex-shrink-0 mt-0.5`} aria-hidden="true" />
                <span className="text-white/55 group-hover:text-white/85 text-xs leading-relaxed transition-colors">
                  {item.text}
                </span>
                <ArrowRight size={12} className="text-white/20 group-hover:text-white/40 transition-colors ml-auto flex-shrink-0 mt-0.5" aria-hidden="true" />
              </motion.button>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

        {/* Emergency numbers */}
        <section aria-labelledby="emergency-heading">
          <h3 id="emergency-heading" className="text-white/30 text-2xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Phone size={11} aria-hidden="true" />
            Líneas de crisis
          </h3>
          <div className="space-y-2">
            {EMERGENCY.map((item, i) => (
              <motion.a
                key={item.name}
                {...stagger(i + 4)}
                href={item.href}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl group transition-all duration-150"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                aria-label={`Llamar a ${item.name}: ${item.number}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${item.dot} flex-shrink-0`} aria-hidden="true" />
                  <span className="text-white/60 text-xs">{item.name}</span>
                </div>
                <span className="text-white/80 text-xs font-mono font-semibold group-hover:text-white transition-colors">
                  {item.number}
                </span>
              </motion.a>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

        {/* Privacy note */}
        <motion.section
          {...stagger(8)}
          className="rounded-xl p-4"
          style={{ background: 'rgba(124,92,191,0.07)', border: '1px solid rgba(124,92,191,0.15)' }}
          aria-labelledby="privacy-note"
        >
          <div className="flex items-start gap-2.5">
            <Info size={13} className="text-purple-light flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 id="privacy-note" className="text-purple-light text-xs font-semibold mb-1">
                Espacio confidencial
              </h3>
              <p className="text-white/35 text-xs leading-relaxed">
                Esta conversación es privada. Puedes usarla sin crear una cuenta. Nada se comparte con terceros.
              </p>
            </div>
          </div>
        </motion.section>

      </div>
    </aside>
  )
}
