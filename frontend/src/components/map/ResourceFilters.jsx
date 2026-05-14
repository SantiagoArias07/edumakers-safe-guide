const FILTERS = [
  { id: null, label: 'Todos', emoji: '🗺️' },
  { id: 'refugio', label: 'Refugios', emoji: '🏠' },
  { id: 'legal', label: 'Asesoría Legal', emoji: '⚖️' },
  { id: 'psicologico', label: 'Apoyo Psicológico', emoji: '🧠' },
  { id: 'denuncia', label: 'Denuncia', emoji: '🚨' },
  { id: 'salud', label: 'Salud', emoji: '🏥' },
]

export default function ResourceFilters({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar recursos por tipo">
      {FILTERS.map((f) => {
        const isActive = active === f.id
        return (
          <button
            key={f.id ?? 'all'}
            onClick={() => onChange(isActive ? null : f.id)}
            aria-pressed={isActive}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-soft/60 ${
              isActive
                ? 'bg-purple-soft text-white shadow-lg shadow-purple-soft/25'
                : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/15'
            }`}
          >
            <span aria-hidden="true">{f.emoji}</span>
            {f.label}
          </button>
        )
      })}
    </div>
  )
}
