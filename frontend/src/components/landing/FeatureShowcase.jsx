import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Shield, MessageCircle, MapPin, Lock, Eye, Scale, ArrowRight } from 'lucide-react'
import { TiltCard } from '../ui/TiltCard'

/* ── AI Assistant showcase ─────────────────────────────────── */
const AI_FEATURES = [
  { icon: Shield,    text: 'Validación emocional antes de orientar' },
  { icon: Scale,     text: 'Derechos, denuncia y procesos legales' },
  { icon: MapPin,    text: 'Recursos locales según tu ciudad' },
  { icon: Eye,       text: 'Detección de situaciones de emergencia' },
  { icon: Lock,      text: 'Conversaciones anónimas y confidenciales' },
  { icon: MessageCircle, text: 'Historia completa guardada (opcional)' },
]

function AISection({ navigate }) {
  return (
    <div style={{ backgroundColor: '#07070F' }} className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Preview: conversation with 3D tilt */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative">
              <div
                className="absolute -inset-10 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 60% 50% at 40% 50%, rgba(124,92,191,0.15), transparent 75%)' }}
                aria-hidden="true"
              />
            <TiltCard maxTilt={5} glowRgb="124,92,191" className="rounded-2xl">
            <div
              className="rounded-2xl overflow-hidden border border-white/8"
              style={{ background: '#0E0E1C', boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 24px 60px rgba(0,0,0,0.4)' }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="w-8 h-8 rounded-lg bg-purple-soft/20 border border-purple-soft/20 flex items-center justify-center">
                  <Shield size={15} className="text-purple-soft" />
                </div>
                <div>
                  <p className="text-white/90 font-semibold text-sm">SafeGuide</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-white/40 text-xs">Disponible · Confidencial</span>
                  </div>
                </div>
              </div>

              {/* Conversation */}
              <div className="px-5 py-6 space-y-4">
                {[
                  { role: 'bot', text: 'Entiendo que dar este paso es difícil. Lo que estás viviendo importa y merece atención. ¿Me puedes contar un poco más sobre la situación?' },
                  { role: 'user', text: 'Mi pareja me grita y controla todo lo que hago. No sé si eso cuenta como violencia.' },
                  { role: 'bot', text: 'Sí cuenta. Lo que describes — el control y las agresiones verbales — son formas de violencia reconocidas por la ley. No estás exagerando.\n\n¿En qué ciudad estás? Para darte información de recursos cercanos a ti.' },
                ].map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`px-4 py-3 rounded-xl text-xs leading-relaxed max-w-[82%] ${
                        msg.role === 'user'
                          ? 'bg-purple-soft text-white rounded-tr-sm'
                          : 'text-white/80 rounded-tl-sm whitespace-pre-line'
                      }`}
                      style={msg.role === 'bot' ? { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' } : {}}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            </TiltCard>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-purple-light text-sm font-semibold tracking-widest uppercase mb-4">
              Asistente IA
            </p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight leading-tight mb-6">
              Diseñado para ayuda humana real.
            </h2>
            <p className="text-white/50 text-base leading-relaxed mb-10">
              SafeGuide no es un chatbot genérico. Está entrenado específicamente para orientar en situaciones de violencia, derechos y bienestar en México — con protocolo de validación emocional y detección de emergencias.
            </p>

            <ul className="space-y-3.5 mb-10" aria-label="Capacidades de SafeGuide">
              {AI_FEATURES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-purple-soft/15 border border-purple-soft/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={13} className="text-purple-light" aria-hidden="true" />
                  </div>
                  <span className="text-white/70 text-sm">{text}</span>
                </li>
              ))}
            </ul>

            <button onClick={() => navigate('/chat')} className="btn-primary-lg">
              Hablar con SafeGuide
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/* ── Map showcase ──────────────────────────────────────────── */
const MAP_FEATURES = [
  { color: '#E8705A', type: 'Refugios', desc: 'Casas de acogida y albergues seguros' },
  { color: '#7C5CBF', type: 'Asesoría Legal', desc: 'Abogadas, CAVI, defensorías' },
  { color: '#3B82F6', type: 'Psicología', desc: 'Apoyo emocional especializado' },
  { color: '#EF4444', type: 'Denuncia', desc: 'Fiscalías y ministerios públicos' },
  { color: '#10B981', type: 'Salud', desc: 'IMSS, ISSSTE, clínicas comunitarias' },
]

function MapPreviewSVG() {
  const dots = [
    { cx: 45, cy: 35, r: 5, color: '#7C5CBF' },
    { cx: 68, cy: 55, r: 6, color: '#E8705A' },
    { cx: 55, cy: 70, r: 4.5, color: '#10B981' },
    { cx: 30, cy: 60, r: 5, color: '#3B82F6' },
    { cx: 80, cy: 35, r: 4, color: '#EF4444' },
    { cx: 25, cy: 40, r: 5.5, color: '#7C5CBF' },
    { cx: 72, cy: 72, r: 4, color: '#E8705A' },
    { cx: 40, cy: 75, r: 5, color: '#EF4444' },
    { cx: 60, cy: 42, r: 4, color: '#10B981' },
    { cx: 85, cy: 62, r: 5, color: '#3B82F6' },
    { cx: 50, cy: 28, r: 4.5, color: '#7C5CBF' },
    { cx: 15, cy: 55, r: 4, color: '#E8705A' },
  ]

  return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10" style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.1)', aspectRatio: '4/3' }}>
      {/* Map background */}
      <div className="absolute inset-0 bg-[#e8edf2] dark:bg-[#0c0c1a]" />

      {/* Grid lines (simulated map) */}
      <svg className="absolute inset-0 w-full h-full opacity-20 dark:opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* "Roads" */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <path d="M 0 50% L 100% 50%" stroke="#cbd5e1" strokeWidth="1.5" fill="none" className="dark:stroke-white/10" />
        <path d="M 50% 0 L 50% 100%" stroke="#cbd5e1" strokeWidth="1.5" fill="none" className="dark:stroke-white/10" />
        <path d="M 20% 0 L 80% 100%" stroke="#e2e8f0" strokeWidth="1" fill="none" className="dark:stroke-white/5" />
        <path d="M 0 30% Q 40% 40% 100% 60%" stroke="#e2e8f0" strokeWidth="1" fill="none" className="dark:stroke-white/5" />
      </svg>

      {/* Markers */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {dots.map((dot, i) => (
          <g key={i}>
            <circle cx={`${dot.cx}%`} cy={`${dot.cy}%`} r={dot.r + 3} fill={dot.color} opacity="0.18" />
            <circle cx={`${dot.cx}%`} cy={`${dot.cy}%`} r={dot.r} fill={dot.color} stroke="white" strokeWidth="2" />
          </g>
        ))}
      </svg>

      {/* Selected card overlay */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-white/95 dark:bg-ink-card/95 backdrop-blur-md rounded-xl p-3.5 border border-gray-200/80 dark:border-white/10 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-coral/15 flex items-center justify-center flex-shrink-0">
              <div className="w-3 h-3 rounded-full bg-coral" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-xs text-gray-900 dark:text-cream truncate">Casa de Acogida · Monterrey</p>
              <p className="text-gray-400 dark:text-white/40 text-xs mt-0.5">Lun-Dom · 24hrs · (81) 2083-2000</p>
            </div>
            <div className="flex-shrink-0">
              <div className="badge bg-coral/10 text-coral border-0 text-2xs">Refugio</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MapSection({ navigate }) {
  return (
    <section className="section-light" aria-labelledby="map-section-heading">
      <div className="container-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Map preview left */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <MapPreviewSVG />
          </motion.div>

          {/* Text right */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-coral text-sm font-semibold tracking-widest uppercase mb-4">
              Red de Recursos
            </p>
            <h2 id="map-section-heading" className="font-display font-bold text-4xl sm:text-5xl text-gray-900 dark:text-cream tracking-tight leading-tight mb-6">
              Apoyo verificado,<br />donde estés.
            </h2>
            <p className="text-gray-500 dark:text-white/50 text-base leading-relaxed mb-10">
              Un mapa interactivo con más de 200 recursos en México — refugios, asesoría legal, apoyo psicológico, centros de denuncia y servicios de salud. Filtrados, actualizados y con detalle completo.
            </p>

            <ul className="space-y-3.5 mb-10" aria-label="Tipos de recursos disponibles">
              {MAP_FEATURES.map(({ color, type, desc }) => (
                <li key={type} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} aria-hidden="true" />
                  <span className="text-gray-900 dark:text-cream text-sm font-medium">{type}</span>
                  <span className="text-gray-400 dark:text-white/35 text-sm">· {desc}</span>
                </li>
              ))}
            </ul>

            <button onClick={() => navigate('/mapa')} className="btn-secondary text-sm px-6 py-3">
              <MapPin size={15} aria-hidden="true" />
              Explorar el mapa completo
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default function FeatureShowcase() {
  const navigate = useNavigate()
  return (
    <>
      <AISection navigate={navigate} />
      <MapSection navigate={navigate} />
    </>
  )
}
