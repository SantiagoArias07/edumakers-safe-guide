import { motion } from 'framer-motion'

const FILTERS = [
  { id: null,          label: 'Todos',              emoji: '🗺️' },
  { id: 'refugio',     label: 'Refugios',           emoji: '🏠' },
  { id: 'legal',       label: 'Legal',              emoji: '⚖️' },
  { id: 'psicologico', label: 'Psicológico',        emoji: '🧠' },
  { id: 'denuncia',    label: 'Denuncia',           emoji: '🚨' },
  { id: 'salud',       label: 'Salud',              emoji: '🏥' },
]

export default function ResourceFilters({ active, onChange }) {
  return (
    <div
      className="flex items-center gap-1.5 overflow-x-auto pb-0.5"
      style={{ scrollbarWidth: 'none' }}
      role="group"
      aria-label="Filtrar recursos por tipo"
    >
      {FILTERS.map((f) => {
        const isActive = active === f.id
        return (
          <motion.button
            key={f.id ?? 'all'}
            onClick={() => onChange(isActive ? null : f.id)}
            aria-pressed={isActive}
            className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-soft/60 transition-colors duration-150"
            style={{
              color: isActive ? 'white' : 'rgba(75,85,99,1)',
              background: isActive ? 'transparent' : 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(8px)',
              border: isActive ? '1px solid rgba(124,92,191,0.5)' : '1px solid rgba(0,0,0,0.08)',
            }}
            whileHover={{ y: -1, scale: 1.03 }}
            whileTap={{ y: 0, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          >
            {/* Active background pill */}
            {isActive && (
              <motion.div
                layoutId="active-filter-pill"
                className="absolute inset-0 rounded-full"
                style={{ background: 'linear-gradient(135deg, #7C5CBF, #6B4FAE)' }}
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              />
            )}
            <span className="relative z-10" aria-hidden="true">{f.emoji}</span>
            <span className="relative z-10">{f.label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
