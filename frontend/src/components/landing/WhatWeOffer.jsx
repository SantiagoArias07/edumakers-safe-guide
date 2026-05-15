import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, MapPin, Scale, ArrowRight } from 'lucide-react'

const cards = [
  {
    icon: MessageCircle,
    title: 'Asistente especializado',
    description: 'SafeGuide está entrenado para orientar en situaciones de violencia, conocimiento de derechos, procesos de denuncia, y acceso a servicios de apoyo en México.',
    cta: 'Iniciar conversación',
    path: '/chat',
    style: { iconBg: 'bg-purple-soft/10', iconColor: 'text-purple-soft', ctaColor: 'text-purple-soft' },
  },
  {
    icon: MapPin,
    title: 'Mapa de recursos',
    description: 'Refugios, centros legales, apoyo psicológico y fiscalías verificadas en todo el país. Filtra por tipo y ciudad para encontrar ayuda donde estás.',
    cta: 'Explorar el mapa',
    path: '/mapa',
    style: { iconBg: 'bg-coral/10', iconColor: 'text-coral', ctaColor: 'text-coral' },
  },
  {
    icon: Scale,
    title: 'Orientación legal concreta',
    description: 'Conoce la Ley General de Víctimas, cómo acceder a un defensor público, cómo levantar una denuncia en la Fiscalía y cuáles son tus derechos en cada paso.',
    cta: 'Consultar SafeGuide',
    path: '/chat',
    style: { iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-600 dark:text-emerald-400', ctaColor: 'text-emerald-600 dark:text-emerald-400' },
  },
]

export default function WhatWeOffer() {
  const navigate = useNavigate()

  return (
    <section className="py-24 bg-white dark:bg-bg-dark" aria-labelledby="offer-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-coral text-sm font-semibold tracking-widest uppercase mb-3">
            Qué ofrecemos
          </p>
          <h2 id="offer-heading" className="font-display font-bold text-3xl sm:text-4xl text-gray-900 dark:text-cream">
            Todo lo que necesitas, en un lugar
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card flex flex-col"
            >
              <div className={`w-11 h-11 rounded-xl ${card.style.iconBg} flex items-center justify-center mb-5`}>
                <card.icon size={20} className={card.style.iconColor} aria-hidden="true" />
              </div>
              <h3 className="font-display font-semibold text-lg text-gray-900 dark:text-cream mb-2">
                {card.title}
              </h3>
              <p className="text-gray-500 dark:text-white/50 text-sm leading-relaxed flex-1 mb-6">
                {card.description}
              </p>
              <button
                onClick={() => navigate(card.path)}
                className={`flex items-center gap-1.5 text-sm font-medium ${card.style.ctaColor} hover:opacity-75 transition-opacity group`}
                aria-label={`${card.cta} — ${card.title}`}
              >
                {card.cta}
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
