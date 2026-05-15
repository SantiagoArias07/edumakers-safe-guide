import { motion } from 'framer-motion'

const STACK = [
  { name: 'React 18',       role: 'Frontend',       color: '#61DAFB20', border: '#61DAFB30', text: '#61DAFB' },
  { name: 'FastAPI',        role: 'Backend',        color: '#00917820', border: '#00917830', text: '#00C896' },
  { name: 'TanStack Query', role: 'State / Cache',  color: '#EF444420', border: '#EF444430', text: '#FF6B6B' },
  { name: 'TailwindCSS',    role: 'Styling',        color: '#38BDF820', border: '#38BDF830', text: '#38BDF8' },
  { name: 'Vitest + RTL',   role: 'Testing',        color: '#6EE7B720', border: '#6EE7B730', text: '#6EE7B7' },
  { name: 'PostgreSQL',     role: 'Database',       color: '#336791aa', border: '#33679130', text: '#80AACC' },
  { name: 'JWT + bcrypt',   role: 'Auth',           color: '#F59E0B20', border: '#F59E0B30', text: '#FBBF24' },
  { name: 'Groq / OpenRouter', role: 'AI Provider', color: '#7C5CBF20', border: '#7C5CBF30', text: '#9B7FD4' },
  { name: 'Leaflet',        role: 'Maps',           color: '#3FB55020', border: '#3FB55030', text: '#5CD670' },
  { name: 'Framer Motion',  role: 'Animation',      color: '#E0145920', border: '#E0145930', text: '#FF6080' },
]

const DECISIONS = [
  {
    title: 'TanStack Query v5',
    body: 'Server state management con caching, optimistic updates y stale-while-revalidate. Sin Redux, sin boilerplate.',
  },
  {
    title: 'Multi-provider AI',
    body: 'Ollama (local), Groq o OpenRouter — switcheable vía variable de entorno. Mismo código, cualquier proveedor.',
  },
  {
    title: 'Accessibility-first',
    body: 'ARIA landmarks, focus management, reduced motion, skip links, keyboard navigation completa.',
  },
  {
    title: 'Anonymous by design',
    body: 'Funciona completamente sin cuenta. Las preferencias van a localStorage, no a servidores externos.',
  },
]

export default function EngineeringSection() {
  return (
    <section
      className="py-24 sm:py-32"
      style={{ backgroundColor: '#07070F' }}
      aria-labelledby="eng-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-white/40 text-sm font-semibold tracking-widest uppercase mb-3">
            Engineering
          </p>
          <h2 id="eng-heading" className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight mb-4">
            Construido en serio.
          </h2>
          <p className="text-white/40 text-base max-w-lg">
            Cada tecnología fue elegida con intención. Sin over-engineering, sin librerías innecesarias.
          </p>
        </motion.div>

        {/* Stack grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-16">
          {STACK.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="rounded-xl px-4 py-3.5"
              style={{ background: item.color, border: `1px solid ${item.border}` }}
            >
              <div className="font-semibold text-sm mb-0.5" style={{ color: item.text }}>
                {item.name}
              </div>
              <div className="text-white/35 text-xs">{item.role}</div>
            </motion.div>
          ))}
        </div>

        {/* Engineering decisions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {DECISIONS.map((d, i) => (
            <motion.div
              key={d.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl p-6"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <h3 className="font-semibold text-white text-sm mb-2">{d.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{d.body}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
