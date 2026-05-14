import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Shield, Heart, MapPin } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-gray-50 dark:bg-bg-dark">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-50 to-purple-soft/5 dark:from-bg-dark dark:via-bg-dark dark:to-purple-dark/20 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-purple-soft/5 dark:bg-purple-soft/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-coral/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="inline-flex items-center gap-2 bg-purple-soft/10 border border-purple-soft/20 rounded-full px-4 py-2 mb-8"
        >
          <Shield size={14} className="text-purple-soft" />
          <span className="text-purple-soft text-xs font-medium">Espacio seguro y confidencial · México</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-gray-900 dark:text-cream leading-tight mb-6"
        >
          No estás solo.{' '}
          <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-soft to-coral">
            Aquí encontrarás
          </span>
          <br className="hidden sm:block" />
          ayuda real.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="text-gray-500 dark:text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Orientación confidencial, recursos verificados y un guía especializado para acompañarte en cada paso. Sin juicios, sin presiones.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => navigate('/chat')}
            className="btn-primary flex items-center gap-2 text-base px-8 py-4 group"
          >
            Hablar con SafeGuide
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => navigate('/mapa')}
            className="btn-secondary flex items-center gap-2 text-base"
          >
            <MapPin size={16} />
            Ver recursos cercanos
          </button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={4}
          className="flex flex-wrap items-center justify-center gap-6 mt-16 text-gray-400 dark:text-white/30 text-xs"
        >
          {[
            { icon: Shield, text: '100% confidencial' },
            { icon: Heart, text: 'Sin juicios' },
            { icon: MapPin, text: 'Recursos verificados en México' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5">
              <Icon size={12} className="text-purple-soft/60" />
              <span>{text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
