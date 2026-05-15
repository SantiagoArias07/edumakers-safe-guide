import { motion } from 'framer-motion'
import { MessageCircle, Compass, MapPin } from 'lucide-react'

const STEPS = [
  {
    icon: MessageCircle,
    step: '01',
    title: 'Cuéntanos qué está pasando',
    body: 'Escribe en tus palabras lo que estás viviendo. SafeGuide valida cómo te sientes antes de orientarte — sin juzgar, sin presiones.',
    accent: { dot: 'bg-purple-soft', icon: 'text-purple-soft', num: 'text-purple-soft/20' },
  },
  {
    icon: Compass,
    step: '02',
    title: 'Recibe orientación específica',
    body: 'Información concreta sobre tus derechos, los pasos legales a seguir, y los recursos disponibles según tu situación y tu ciudad.',
    accent: { dot: 'bg-coral', icon: 'text-coral', num: 'text-coral/20' },
  },
  {
    icon: MapPin,
    step: '03',
    title: 'Encuentra apoyo cerca de ti',
    body: 'Refugios, centros de asesoría legal, apoyo psicológico y centros de denuncia verificados, ubicados en un mapa interactivo.',
    accent: { dot: 'bg-emerald-500', icon: 'text-emerald-500', num: 'text-emerald-500/20' },
  },
]

export default function HowItWorks() {
  return (
    <section className="section-light" aria-labelledby="hiw-heading">
      <div className="container-content">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-purple-soft text-sm font-semibold tracking-widest uppercase mb-3">
            Cómo funciona
          </p>
          <h2 id="hiw-heading" className="font-display font-bold text-4xl sm:text-5xl text-gray-900 dark:text-cream tracking-tight">
            Tres pasos, sin barreras.
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line — desktop only */}
          <div
            className="hidden md:block absolute top-[2.1rem] left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px"
            style={{ background: 'linear-gradient(90deg, rgba(124,92,191,0.3), rgba(232,112,90,0.3), rgba(16,185,129,0.3))' }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {STEPS.map((step, i) => (
              <motion.article
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                className="relative"
              >
                {/* Step indicator */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`relative w-11 h-11 rounded-xl ${step.accent.dot} flex items-center justify-center flex-shrink-0`}>
                    <step.icon size={20} className="text-white" aria-hidden="true" />
                    {/* Halo ring */}
                    <div className={`absolute inset-0 rounded-xl ${step.accent.dot} opacity-25 scale-150`} aria-hidden="true" />
                  </div>
                  <div className={`font-display font-black text-5xl leading-none select-none ${step.accent.num}`} aria-hidden="true">
                    {step.step}
                  </div>
                </div>

                <h3 className="font-display font-bold text-xl text-gray-900 dark:text-cream mb-3 leading-snug">
                  {step.title}
                </h3>
                <p className="text-gray-500 dark:text-white/50 text-sm leading-relaxed">
                  {step.body}
                </p>
              </motion.article>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
