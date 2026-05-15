import { motion } from 'framer-motion'

const STATS = [
  { value: '200+', label: 'Recursos verificados', sub: 'refugios, legales, psicológicos' },
  { value: '32',   label: 'Estados de México',    sub: 'cobertura nacional' },
  { value: '5',    label: 'Tipos de apoyo',        sub: 'orientación especializada' },
  { value: '24/7', label: 'Disponibilidad',        sub: 'sin restricciones horarias' },
]

export default function StatsBand() {
  return (
    <section
      className="py-14 sm:py-20"
      style={{ backgroundColor: '#07070F' }}
      aria-label="Impacto de SafeGuide"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center lg:text-left lg:pl-8 lg:border-l lg:border-white/10 first:lg:border-0 first:lg:pl-0"
            >
              <div className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight mb-1">
                {stat.value}
              </div>
              <div className="text-white/70 font-medium text-sm mb-0.5">{stat.label}</div>
              <div className="text-white/30 text-xs">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
