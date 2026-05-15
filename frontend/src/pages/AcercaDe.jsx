import { motion } from 'framer-motion'
import { Mail, Globe, Shield, Calendar, MapPin, ExternalLink, Heart, Lock, Zap, Users } from 'lucide-react'

const stagger = (i, base = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay: base + i * 0.1, ease: [0.16, 1, 0.3, 1] },
})

/* ── Data ──────────────────────────────────────────────────── */
const ALLIES = [
  {
    icon: '🎓',
    name: 'Tec de Monterrey',
    role: 'Institución académica impulsora',
    description: 'SafeGuide nació dentro de la Semana Dignidad del Tecnológico de Monterrey, un proyecto de impacto social comprometido con la innovación al servicio de los derechos humanos.',
    url: 'https://tec.mx',
    domain: 'tec.mx',
    colorDot: 'bg-blue-500',
    accent: 'rgba(59,130,246,0.1)',
    accentBorder: 'rgba(59,130,246,0.25)',
  },
  {
    icon: '🚀',
    name: 'Edumakers MX',
    role: 'Organización aliada',
    description: 'Organización educativa que impulsa proyectos de impacto social en México mediante tecnología y comunidades de aprendizaje. Aliada clave en el desarrollo de SafeGuide.',
    url: 'https://gacetaehe.tec.mx/es/noticia/edu-maker-space-de-alumnos-para-alumnos',
    domain: 'gacetaehe.tec.mx',
    colorDot: 'bg-coral',
    accent: 'rgba(232,112,90,0.08)',
    accentBorder: 'rgba(232,112,90,0.2)',
  },
]

const EVENTS = [
  { date: '21 Mar', year: '2026', title: 'Clausura Semana Dignidad 2026', org: 'Tec de Monterrey', location: 'Campus Monterrey, NL', tag: 'Tec', tagColor: 'rgba(59,130,246,0.12)', tagText: '#3B82F6' },
  { date: '25 Abr', year: '2026', title: 'Foro Nacional: Acceso a la Justicia para Mujeres', org: 'ONU Mujeres México', location: 'Ciudad de México', tag: 'Evento', tagColor: 'rgba(124,92,191,0.12)', tagText: '#7C5CBF' },
  { date: '25 May', year: '2026', title: 'Congreso Nacional de Dignidad Humana', org: 'Tec de Monterrey', location: 'Campus Monterrey, NL', tag: 'Tec', tagColor: 'rgba(59,130,246,0.12)', tagText: '#3B82F6' },
  { date: '25 Nov', year: '2026', title: 'Día Internacional: Eliminación Violencia contra la Mujer', org: 'Nacional', location: 'Todo México', tag: 'Evento', tagColor: 'rgba(124,92,191,0.12)', tagText: '#7C5CBF' },
]

const PILLARS = [
  { icon: Lock,   title: 'Privacidad total',  body: 'Completamente anónima. Tus datos nunca se comparten sin tu consentimiento expreso.' },
  { icon: Heart,  title: 'Para todas',        body: 'Gratuita y disponible para cualquier persona en el país, sin importar su situación.' },
  { icon: Zap,    title: 'Disponible ya',     body: 'Orientación y recursos en tiempo real, cuando más los necesitas. Sin esperas.' },
  { icon: Shield, title: 'Emocionalmente segura', body: 'Validación emocional antes de cualquier información. Sin juicios, sin presiones.' },
]

export default function AcercaDe() {
  return (
    <div className="min-h-screen pb-24 md:pb-0">

      {/* ── Hero ── Light section ──────────────────────────── */}
      <section className="section-light pt-28" aria-labelledby="about-heading">
        <div className="container-content">
          <motion.div {...stagger(0)} className="mb-6">
            <span className="badge-purple">
              <Shield size={11} aria-hidden="true" />
              Impacto social · México · 2026
            </span>
          </motion.div>

          <motion.h1
            {...stagger(1)}
            id="about-heading"
            className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl tracking-tighter text-gray-900 dark:text-cream leading-[1.04] mb-6"
          >
            Un proyecto hecho
            <br />
            <span className="text-purple-soft">con propósito real.</span>
          </motion.h1>

          <motion.p {...stagger(2)} className="text-gray-500 dark:text-white/55 text-lg leading-relaxed max-w-2xl mb-16">
            SafeGuide es una plataforma de orientación, recursos y apoyo para personas que buscan ayuda, quieren conocer sus derechos o necesitan hablar con alguien en México. Confidencial, gratuita y disponible en cualquier momento.
          </motion.p>

          {/* Pillars grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILLARS.map((p, i) => (
              <motion.div key={p.title} {...stagger(i, 0.2)} className="card">
                <div className="w-10 h-10 rounded-xl bg-purple-soft/10 dark:bg-purple-soft/15 flex items-center justify-center mb-4">
                  <p.icon size={18} className="text-purple-soft" aria-hidden="true" />
                </div>
                <h3 className="font-display font-semibold text-gray-900 dark:text-cream text-sm mb-2">{p.title}</h3>
                <p className="text-gray-500 dark:text-white/45 text-xs leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partners ── Dark section ────────────────────────── */}
      <section
        className="py-24 sm:py-32"
        style={{ backgroundColor: '#07070F' }}
        aria-labelledby="partners-heading"
      >
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <p className="text-white/30 text-sm font-semibold tracking-widest uppercase mb-3 flex items-center gap-2">
              <Users size={14} aria-hidden="true" />
              Vinculación
            </p>
            <h2 id="partners-heading" className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight">
              Estamos vinculados con
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ALLIES.map((ally, i) => (
              <motion.div
                key={ally.name}
                {...stagger(i, 0.1)}
                className="rounded-2xl p-6"
                style={{
                  background: ally.accent,
                  border: `1px solid ${ally.accentBorder}`,
                }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                    aria-hidden="true"
                  >
                    {ally.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white text-base">{ally.name}</h3>
                      <div className={`w-1.5 h-1.5 rounded-full ${ally.colorDot} flex-shrink-0`} aria-hidden="true" />
                    </div>
                    <p className="text-white/35 text-xs">{ally.role}</p>
                  </div>
                </div>
                <p className="text-white/55 text-sm leading-relaxed mb-4">{ally.description}</p>
                <a
                  href={ally.url.startsWith('http') ? ally.url : `https://${ally.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors focus:outline-none focus-visible:underline"
                >
                  <Globe size={12} aria-hidden="true" />
                  {ally.domain}
                  <ExternalLink size={11} aria-hidden="true" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact + Events ── Light section ──────────────── */}
      <section className="section-light" aria-labelledby="contact-heading">
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Contact */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-10"
              >
                <p className="text-coral text-sm font-semibold tracking-widest uppercase mb-3">Contacto</p>
                <h2 id="contact-heading" className="font-display font-bold text-4xl sm:text-5xl text-gray-900 dark:text-cream tracking-tight">
                  Hablemos.
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="card border-coral/20 space-y-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center text-xl" aria-hidden="true">🚀</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-cream text-sm">Edumakers MX</h3>
                    <p className="text-gray-400 dark:text-white/35 text-xs">Organización responsable</p>
                  </div>
                </div>

                {[
                  { label: 'edumakerstec@gmail.com', href: 'mailto:edumakerstec@gmail.com' },
                  { label: 'cristina.reynaga@tec.mx', href: 'mailto:cristina.reynaga@tec.mx' },
                ].map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-soft/10 dark:bg-purple-soft/15 flex items-center justify-center flex-shrink-0">
                      <Mail size={13} className="text-purple-soft" aria-hidden="true" />
                    </div>
                    <span className="text-gray-600 dark:text-white/60 text-sm group-hover:text-coral transition-colors">
                      {label}
                    </span>
                  </a>
                ))}

                <a
                  href="https://gacetaehe.tec.mx/es/noticia/edu-maker-space-de-alumnos-para-alumnos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-soft/10 dark:bg-purple-soft/15 flex items-center justify-center flex-shrink-0">
                    <Globe size={13} className="text-purple-soft" aria-hidden="true" />
                  </div>
                  <span className="text-gray-600 dark:text-white/60 text-sm group-hover:text-coral transition-colors flex items-center gap-1">
                    gacetaehe.tec.mx
                    <ExternalLink size={11} aria-hidden="true" />
                  </span>
                </a>
              </motion.div>
            </div>

            {/* Events */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-10"
              >
                <p className="text-purple-soft text-sm font-semibold tracking-widest uppercase mb-3 flex items-center gap-1.5">
                  <Calendar size={14} aria-hidden="true" />
                  Eventos
                </p>
                <h2 className="font-display font-bold text-4xl sm:text-5xl text-gray-900 dark:text-cream tracking-tight">
                  Calendario.
                </h2>
              </motion.div>

              <div className="space-y-3">
                {EVENTS.map((ev, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className="card p-4 hover:border-purple-soft/30 transition-colors"
                  >
                    <div className="flex gap-4">
                      {/* Date */}
                      <div className="flex-shrink-0 text-center min-w-[44px]">
                        <div className="font-display font-bold text-sm leading-none text-purple-soft">{ev.date}</div>
                        <div className="text-gray-400 dark:text-white/30 text-xs mt-0.5">{ev.year}</div>
                      </div>

                      <div className="w-px self-stretch bg-purple-soft/20" aria-hidden="true" />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 dark:text-cream text-sm leading-snug">{ev.title}</h3>
                          <span
                            className="flex-shrink-0 text-2xs px-2 py-0.5 rounded-full font-semibold"
                            style={{ background: ev.tagColor, color: ev.tagText }}
                          >
                            {ev.tag}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 dark:text-white/35 text-xs">{ev.org}</span>
                          <div className="flex items-center gap-1 text-gray-400 dark:text-white/30 text-xs">
                            <MapPin size={10} aria-hidden="true" />
                            {ev.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center text-gray-400 dark:text-white/25 text-xs mt-20"
          >
            SafeGuide · Proyecto de impacto social · Semana Dignidad 2026 · Tec de Monterrey
          </motion.p>
        </div>
      </section>

    </div>
  )
}
