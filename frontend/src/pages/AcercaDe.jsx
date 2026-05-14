import { motion } from 'framer-motion'
import { Mail, Globe, Heart, Users, Shield, Calendar, MapPin, ExternalLink, Zap } from 'lucide-react'

const ALLIES = [
  {
    name: 'Tec de Monterrey',
    role: 'Institución académica impulsora',
    description:
      'SafeGuide nació como proyecto de impacto social dentro de la Semana Dignidad del Tecnológico de Monterrey, comprometida con la innovación al servicio de los derechos humanos.',
    url: 'https://tec.mx',
    icon: '🎓',
    color: 'blue',
  },
  {
    name: 'Edumakers MX',
    role: 'Organización aliada',
    description:
      'Edumakers es una organización educativa que impulsa proyectos de impacto social en México mediante tecnología y comunidades de aprendizaje. Aliada clave en el desarrollo de SafeGuide.',
    url: 'https://gacetaehe.tec.mx/es/noticia/edu-maker-space-de-alumnos-para-alumnos',
    icon: '🚀',
    color: 'coral',
  },
]

const CONTACT = {
  org: 'Edumakers MX',
  email: 'edumakerstec@gmail.com',
  email2: 'cristina.reynaga@tec.mx',
  webUrl: 'https://gacetaehe.tec.mx/es/noticia/edu-maker-space-de-alumnos-para-alumnos',
  webLabel: 'gacetaehe.tec.mx',
}

const EVENTS = [
  {
    date: '21 Mar',
    year: '2026',
    title: 'Clausura Semana Dignidad 2026',
    org: 'Tec de Monterrey',
    location: 'Campus Monterrey, NL',
    tag: 'Tec',
  },
  {
    date: '25 Abr',
    year: '2026',
    title: 'Foro Nacional: Acceso a la Justicia para Mujeres',
    org: 'ONU Mujeres México',
    location: 'Ciudad de México',
    tag: 'Evento',
  },
  {
    date: '25 May',
    year: '2026',
    title: 'Congreso Nacional de Dignidad Humana',
    org: 'Tec de Monterrey',
    location: 'Campus Monterrey, NL',
    tag: 'Tec',
  },
  {
    date: '25 Nov',
    year: '2026',
    title: 'Día Internacional: Eliminación de la Violencia contra la Mujer',
    org: 'Nacional',
    location: 'Todo México',
    tag: 'Evento',
  },
]

const TAG_STYLES = {
  Tec: 'bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400',
  Evento: 'bg-purple-soft/10 dark:bg-purple-soft/15 text-purple-soft',
}

const ALLY_STYLES = {
  blue: { icon: 'bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-500/20' },
  coral: { icon: 'bg-coral/10 text-coral', border: 'border-coral/20 dark:border-coral/25' },
}

export default function AcercaDe() {
  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-bg-dark">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-purple-soft/10 dark:bg-purple-soft/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Shield size={28} className="text-purple-soft" />
          </div>
          <h1 className="font-display font-bold text-3xl text-gray-900 dark:text-cream mb-3">
            Acerca de SafeGuide
          </h1>
          <p className="text-gray-500 dark:text-white/55 text-base max-w-xl mx-auto leading-relaxed">
            Una plataforma de orientación, recursos y apoyo para personas que buscan ayuda,
            quieren conocer sus derechos o necesitan hablar con alguien en México.
            Confidencial, gratuita y disponible en todo momento.
          </p>
        </motion.div>

        {/* Mission cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Shield, label: 'Privacidad', desc: 'Completamente anónima. Tus datos nunca se comparten sin tu consentimiento.' },
            { icon: Heart, label: 'Para todos', desc: 'Gratuita y disponible para cualquier persona en el país, sin importar su situación o necesidad.' },
            { icon: Zap, label: 'Inmediata', desc: 'Orientación y recursos disponibles en tiempo real, cuando más lo necesitas.' },
          ].map((item) => (
            <div key={item.label} className="card text-center">
              <div className="w-10 h-10 bg-purple-soft/10 dark:bg-purple-soft/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <item.icon size={18} className="text-purple-soft" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-cream text-sm mb-1">{item.label}</h3>
              <p className="text-gray-400 dark:text-white/40 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Allies */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Users size={18} className="text-purple-soft" />
            <h2 className="font-display font-bold text-xl text-gray-900 dark:text-cream">
              Estamos vinculados con
            </h2>
          </div>
          <div className="space-y-4">
            {ALLIES.map((ally) => {
              const styles = ALLY_STYLES[ally.color]
              return (
                <div key={ally.name} className={`card border ${styles.border}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${styles.icon}`}>
                      {ally.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-cream">{ally.name}</h3>
                        <span className="text-xs text-gray-400 dark:text-white/40">{ally.role}</span>
                      </div>
                      <p className="text-gray-500 dark:text-white/55 text-sm leading-relaxed mb-3">
                        {ally.description}
                      </p>
                      <a
                        href={ally.url.startsWith('http') ? ally.url : `https://${ally.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-purple-soft hover:text-purple-dark transition-colors"
                      >
                        <Globe size={12} />
                        {ally.url.replace('https://', '').replace('http://', '').split('/')[0]}
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Contact */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Mail size={18} className="text-coral" />
            <h2 className="font-display font-bold text-xl text-gray-900 dark:text-cream">
              Contacto
            </h2>
          </div>
          <div className="card border border-coral/20 dark:border-coral/25">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-coral/10 flex items-center justify-center text-2xl shrink-0">
                🚀
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-cream">{CONTACT.org}</h3>
                <div className="flex flex-col gap-2">
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-white/60 hover:text-coral transition-colors"
                  >
                    <Mail size={14} className="text-gray-400 dark:text-white/30 shrink-0" />
                    {CONTACT.email}
                  </a>
                  <a
                    href={`mailto:${CONTACT.email2}`}
                    className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-white/60 hover:text-coral transition-colors"
                  >
                    <Mail size={14} className="text-gray-400 dark:text-white/30 shrink-0" />
                    {CONTACT.email2}
                  </a>
                  <a
                    href={CONTACT.webUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-white/60 hover:text-coral transition-colors"
                  >
                    <Globe size={14} className="text-gray-400 dark:text-white/30 shrink-0" />
                    {CONTACT.webLabel}
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Events calendar */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Calendar size={18} className="text-emerald-600 dark:text-emerald-400" />
            <h2 className="font-display font-bold text-xl text-gray-900 dark:text-cream">
              Calendario de eventos
            </h2>
          </div>
          <p className="text-gray-400 dark:text-white/40 text-sm mb-5">
            Eventos relacionados con dignidad humana, derechos de las mujeres e impacto social en México.
          </p>

          <div className="space-y-3">
            {EVENTS.map((ev, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex gap-4 p-4 rounded-2xl border bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-purple-soft/30 dark:hover:border-purple-soft/30 transition-colors"
              >
                {/* Date badge */}
                <div className="shrink-0 text-center min-w-[52px]">
                  <div className="text-xs font-bold leading-none mb-0.5 text-purple-soft">
                    {ev.date}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-white/30">{ev.year}</div>
                </div>

                {/* Divider */}
                <div className="w-px self-stretch bg-purple-soft/20" />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-medium text-sm leading-snug text-gray-900 dark:text-cream">
                      {ev.title}
                    </h3>
                    <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${TAG_STYLES[ev.tag] || TAG_STYLES.Evento}`}>
                      {ev.tag}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-gray-400 dark:text-white/40 text-xs">{ev.org}</span>
                    <div className="flex items-center gap-1 text-gray-400 dark:text-white/30 text-xs">
                      <MapPin size={10} />
                      {ev.location}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer note */}
        <div className="text-center text-gray-400 dark:text-white/30 text-xs pb-4">
          SafeGuide · Proyecto de impacto social · Semana Dignidad 2026 · Tec de Monterrey
        </div>
      </div>
    </div>
  )
}
