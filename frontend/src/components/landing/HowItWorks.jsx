import { motion } from 'framer-motion'
import { MessageCircle, Compass, MapPin } from 'lucide-react'

const steps = [
  {
    icon: MessageCircle,
    number: '01',
    title: 'Cuéntanos',
    description: 'Escribe lo que estás viviendo en un espacio seguro y confidencial. SafeGuide te escucha sin juzgar.',
    color: 'text-purple-soft',
    bg: 'bg-purple-soft/10',
    border: 'border-purple-soft/20',
  },
  {
    icon: Compass,
    number: '02',
    title: 'Te orientamos',
    description: 'Recibe orientación especializada sobre tus derechos, los pasos a seguir y los recursos disponibles según tu situación.',
    color: 'text-coral',
    bg: 'bg-coral/10',
    border: 'border-coral/20',
  },
  {
    icon: MapPin,
    number: '03',
    title: 'Encuentra ayuda cercana',
    description: 'Visualiza en el mapa los refugios, centros legales, psicológicos y de denuncia más cercanos a ti en México.',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white dark:bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-purple-soft text-sm font-semibold tracking-widest uppercase">Cómo funciona</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 dark:text-cream mt-3">
            Tres pasos hacia la ayuda
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`relative card ${step.border} group hover:scale-[1.02] transition-transform`}
            >
              <div className="absolute -top-3 -right-3 text-5xl font-display font-black text-gray-900/5 dark:text-white/15 select-none">
                {step.number}
              </div>

              <div className={`w-12 h-12 rounded-xl ${step.bg} border ${step.border} flex items-center justify-center mb-5`}>
                <step.icon size={22} className={step.color} />
              </div>

              <h3 className="font-display font-semibold text-xl text-gray-900 dark:text-cream mb-3">{step.title}</h3>
              <p className="text-gray-500 dark:text-white/55 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
