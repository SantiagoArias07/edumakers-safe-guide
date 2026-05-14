import { motion } from 'framer-motion'
import { Lock, MapPin, Scale } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const offerings = [
  {
    icon: Lock,
    title: 'Orientación confidencial',
    description: 'Conversa con SafeGuide en un espacio 100% privado. Protocolos de primeros auxilios emocionales. Nunca minimizamos lo que estás viviendo.',
    cta: 'Iniciar conversación',
    path: '/chat',
    lightGradient: 'from-purple-soft/5 to-purple-soft/10',
    darkGradient: 'dark:from-purple-soft/20 dark:to-purple-dark/10',
    iconColor: 'text-purple-soft',
    iconBg: 'bg-purple-soft/15',
    border: 'border-purple-soft/20',
  },
  {
    icon: MapPin,
    title: 'Recursos locales verificados',
    description: 'Refugios, centros de atención legal, apoyo psicológico y más, en tu ciudad. Información actualizada de instituciones, organizaciones civiles y fiscalías de todo México.',
    cta: 'Ver el mapa',
    path: '/mapa',
    lightGradient: 'from-coral/5 to-coral/10',
    darkGradient: 'dark:from-coral/20 dark:to-coral-dark/10',
    iconColor: 'text-coral',
    iconBg: 'bg-coral/15',
    border: 'border-coral/20',
  },
  {
    icon: Scale,
    title: 'Información legal concreta',
    description: 'Conoce tus derechos y los pasos concretos para acceder a la justicia. Orientación sobre instituciones, leyes aplicables y cómo levantar una denuncia en México.',
    cta: 'Hablar con SafeGuide',
    path: '/chat',
    lightGradient: 'from-emerald-500/5 to-emerald-500/10',
    darkGradient: 'dark:from-emerald-500/20 dark:to-emerald-900/10',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-500/15',
    border: 'border-emerald-500/20',
  },
]

export default function WhatWeOffer() {
  const navigate = useNavigate()

  return (
    <section className="py-24 bg-gray-50 dark:bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-coral text-sm font-semibold tracking-widest uppercase">Qué ofrecemos</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 dark:text-cream mt-3">
            Todo lo que necesitas en un lugar
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offerings.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`relative overflow-hidden rounded-2xl border ${item.border} bg-gradient-to-br ${item.lightGradient} ${item.darkGradient} p-6 flex flex-col`}
            >
              <div className={`w-11 h-11 rounded-xl ${item.iconBg} flex items-center justify-center mb-5`}>
                <item.icon size={20} className={item.iconColor} />
              </div>

              <h3 className="font-display font-semibold text-xl text-gray-900 dark:text-cream mb-3">{item.title}</h3>
              <p className="text-gray-500 dark:text-white/55 text-sm leading-relaxed flex-1">{item.description}</p>

              <button
                onClick={() => navigate(item.path)}
                className={`mt-6 text-sm font-medium ${item.iconColor} hover:opacity-80 transition-opacity flex items-center gap-1 group`}
              >
                {item.cta}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
