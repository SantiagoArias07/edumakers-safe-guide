import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, MapPin, Shield, Lock, Sparkles } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { TiltCard } from '../ui/TiltCard'

const PREVIEW_MESSAGES = [
  { role: 'assistant', content: 'Hola. Este es un espacio seguro y confidencial. ¿Qué está pasando?' },
  { role: 'user',      content: 'Me cuesta mucho pedir ayuda. No sé por dónde empezar.' },
  { role: 'assistant', content: 'Que estés aquí ya es el primer paso. Cuéntame, te escucho sin juzgarte.' },
]

function ChatPreview() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (count >= PREVIEW_MESSAGES.length) return
    const t = setTimeout(() => setCount(c => c + 1), count === 0 ? 600 : 1400)
    return () => clearTimeout(t)
  }, [count])

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-white/10 bg-white dark:bg-ink-card"
      style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.06)' }}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-white/8 bg-gray-50/80 dark:bg-white/[0.03]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
          <div className="w-3 h-3 rounded-full bg-green-400/70" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-purple-soft flex items-center justify-center">
              <Shield size={11} className="text-white" />
            </div>
            <span className="text-xs font-semibold text-gray-700">SafeGuide</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-2xs text-gray-400">En línea</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="px-5 py-5 space-y-4 min-h-[220px]">
        <AnimatePresence>
          {PREVIEW_MESSAGES.slice(0, count).map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-3.5 py-2.5 rounded-xl text-xs leading-relaxed max-w-[80%] ${
                  msg.role === 'user'
                    ? 'bg-purple-soft text-white rounded-tr-sm'
                    : 'bg-gray-100/90 text-gray-800 rounded-tl-sm border border-gray-200/60'
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {count > 0 && count < PREVIEW_MESSAGES.length && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="px-4 py-3 rounded-xl rounded-tl-sm bg-gray-100/90 border border-gray-200/60 flex gap-1.5 items-center">
              <div className="typing-dot text-gray-400" />
              <div className="typing-dot text-gray-400" />
              <div className="typing-dot text-gray-400" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input bar */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-white/8 flex items-center gap-2.5">
        <div className="flex-1 bg-gray-100 dark:bg-white/8 rounded-xl px-4 py-2.5 text-xs text-gray-400 dark:text-white/30 select-none">
          Escribe lo que está pasando...
        </div>
        <div className="w-8 h-8 rounded-lg bg-purple-soft flex items-center justify-center">
          <ArrowRight size={14} className="text-white" />
        </div>
      </div>
    </div>
  )
}

const stagger = (i) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
})

const btnSpring = { type: 'spring', stiffness: 500, damping: 28 }

export default function Hero() {
  const navigate = useNavigate()
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])

  return (
    <section ref={sectionRef} className="relative bg-white dark:bg-bg-dark pt-20 pb-24 sm:pt-28 overflow-hidden">
      {/* Parallax gradient */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          y: bgY,
          backgroundImage: `
            radial-gradient(ellipse 70% 50% at 60% 0%, rgba(124,92,191,0.09) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 100% 100%, rgba(232,112,90,0.06) 0%, transparent 70%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left */}
          <div>
            {/* Badge with float animation */}
            <motion.div {...stagger(0)} className="mb-6">
              <motion.span
                className="badge-purple"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
              >
                <Shield size={11} aria-hidden="true" />
                Espacio seguro · Confidencial · México
              </motion.span>
            </motion.div>

            <motion.h1
              {...stagger(1)}
              className="font-display font-extrabold text-5xl sm:text-6xl lg:text-[3.75rem] xl:text-7xl leading-[1.04] tracking-tighter text-gray-950 dark:text-cream mb-6"
            >
              Orientación
              <br />
              real cuando
              <br />
              <span className="text-purple-soft">más la necesitas.</span>
            </motion.h1>

            <motion.p {...stagger(2)} className="text-gray-500 dark:text-white/55 text-lg leading-relaxed mb-9 max-w-lg">
              Guía especializada en derechos, recursos y apoyo para personas que viven situaciones de violencia o injusticia en México. Sin registro, sin juicios, disponible ahora.
            </motion.p>

            {/* Animated CTA buttons */}
            <motion.div {...stagger(3)} className="flex flex-col sm:flex-row gap-3 mb-10">
              <motion.button
                onClick={() => navigate('/chat')}
                className="btn-primary-lg group"
                whileHover={{ y: -3, scale: 1.03 }}
                whileTap={{ y: 0, scale: 0.97 }}
                transition={btnSpring}
              >
                Hablar con SafeGuide
                <motion.span
                  animate={{ x: [0, 2, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ArrowRight size={18} aria-hidden="true" />
                </motion.span>
              </motion.button>

              <motion.button
                onClick={() => navigate('/mapa')}
                className="btn-secondary text-base px-7 py-3.5"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ y: 0, scale: 0.98 }}
                transition={btnSpring}
              >
                <MapPin size={16} aria-hidden="true" />
                Ver recursos en mi ciudad
              </motion.button>
            </motion.div>

            {/* Trust indicators with stagger */}
            <motion.div {...stagger(4)} className="flex flex-wrap gap-x-6 gap-y-2.5">
              {[
                { icon: Lock,     text: '100% confidencial' },
                { icon: Shield,   text: 'Sin cuenta requerida' },
                { icon: Sparkles, text: 'IA especializada en México' },
                { icon: MapPin,   text: '200+ recursos verificados' },
              ].map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.07 }}
                  className="flex items-center gap-1.5 text-gray-400 dark:text-white/35 text-sm"
                >
                  <Icon size={13} className="text-purple-soft/60" aria-hidden="true" />
                  {text}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: TiltCard chat preview */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:pl-6"
          >
            <div className="relative">
              <div
                className="absolute -inset-8 rounded-3xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(124,92,191,0.12), transparent 80%)' }}
                aria-hidden="true"
              />
              <TiltCard maxTilt={10} glowRgb="124,92,191" className="rounded-2xl">
                <ChatPreview />
              </TiltCard>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
