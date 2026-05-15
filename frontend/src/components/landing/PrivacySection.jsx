import { motion } from 'framer-motion'
import { Lock, EyeOff, Shield, Keyboard, Zap } from 'lucide-react'

const PILLARS = [
  { icon: EyeOff,    label: 'Modo anónimo',         desc: 'Úsala sin cuenta. Ningún dato personal requerido.' },
  { icon: Lock,      label: 'Sin rastreo',           desc: 'No usamos analytics de usuario ni cookies de terceros.' },
  { icon: Shield,    label: 'Datos locales',         desc: 'Preferencias en localStorage — nunca en servidores externos.' },
  { icon: Keyboard,  label: 'Navegación por teclado', desc: 'Totalmente accesible sin ratón. Tab, flechas, Enter.' },
  { icon: Zap,       label: 'Reduced motion',        desc: 'Respetamos prefers-reduced-motion. Sin animaciones si las configuras.' },
]

export default function PrivacySection() {
  return (
    <section
      className="py-24 sm:py-36 relative overflow-hidden"
      style={{ backgroundColor: '#04040C' }}
      aria-labelledby="privacy-heading"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(124,92,191,0.12) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="badge bg-purple-soft/15 text-purple-light border border-purple-soft/20 mb-6 inline-flex">
            <Lock size={11} aria-hidden="true" />
            Privacidad y Accesibilidad
          </span>
          <h2
            id="privacy-heading"
            className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-white leading-tight tracking-tighter mb-6"
          >
            Tu seguridad
            <br />
            <span className="text-purple-light">no es opcional.</span>
          </h2>
          <p className="text-white/45 text-lg leading-relaxed max-w-xl mx-auto mb-16">
            SafeGuide fue construido pensando en las personas más vulnerables. Cada decisión de diseño prioriza privacidad, accesibilidad y confianza.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl p-5"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div className="w-9 h-9 rounded-xl bg-purple-soft/15 border border-purple-soft/20 flex items-center justify-center mb-4">
                <p.icon size={16} className="text-purple-light" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1.5">{p.label}</h3>
              <p className="text-white/40 text-xs leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
