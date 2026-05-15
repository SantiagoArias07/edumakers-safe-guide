import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import ResourceMap from '../components/map/ResourceMap'
import ResourceFilters from '../components/map/ResourceFilters'
import ResourcePanel from '../components/map/ResourcePanel'
import { resourcesApi } from '../api/resources'
import { queryKeys } from '../api/keys'
import { Search, X, Loader2, AlertCircle } from 'lucide-react'

const TYPE_COLORS = {
  refugio:     '#E8705A',
  legal:       '#7C5CBF',
  psicologico: '#3B82F6',
  denuncia:    '#EF4444',
  salud:       '#10B981',
}

const LEGEND = [
  { color: TYPE_COLORS.refugio,     label: 'Refugio' },
  { color: TYPE_COLORS.legal,       label: 'Legal' },
  { color: TYPE_COLORS.psicologico, label: 'Psicológico' },
  { color: TYPE_COLORS.denuncia,    label: 'Denuncia' },
  { color: TYPE_COLORS.salud,       label: 'Salud' },
]

export default function MapPage() {
  const [activeFilter, setActiveFilter]     = useState(null)
  const [citySearch,   setCitySearch]       = useState('')
  const [searchInput,  setSearchInput]      = useState('')
  const [focusCity,    setFocusCity]        = useState(null)
  const [selectedResource, setSelectedResource] = useState(null)
  const [searchFocused, setSearchFocused]   = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('safeguide_map_city')
    if (saved) {
      setCitySearch(saved)
      setSearchInput(saved)
      setFocusCity(saved)
      localStorage.removeItem('safeguide_map_city')
    }
  }, [])

  const { data: resources = [], isLoading, isError } = useQuery({
    queryKey: queryKeys.resources.all(),
    queryFn:  () => resourcesApi.getAll(),
    staleTime: Infinity,
  })

  const filtered = useMemo(() => {
    let r = resources
    if (activeFilter) r = r.filter(x => x.type === activeFilter)
    if (citySearch.trim()) {
      const t = citySearch.toLowerCase()
      r = r.filter(x => x.city?.toLowerCase().includes(t) || x.state?.toLowerCase().includes(t))
    }
    return r
  }, [resources, activeFilter, citySearch])

  const handleSearch = (e) => {
    e.preventDefault()
    setCitySearch(searchInput)
    setFocusCity(searchInput)
  }

  const clearSearch = () => {
    setSearchInput('')
    setCitySearch('')
    setFocusCity(null)
  }

  const handleSelect = (resource) => {
    setSelectedResource(prev => prev?.id === resource.id ? null : resource)
  }

  return (
    <div className="relative overflow-hidden" style={{ height: '100svh', paddingTop: '64px', paddingBottom: '56px' }}>
      <style>{`@media (min-width: 768px) { .map-page-wrap { padding-bottom: 0 !important; } }`}</style>

      {/* ── Map fills everything ── */}
      <div className="absolute inset-0 top-[64px] bottom-[56px] md:bottom-0">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-bg-dark" role="status" aria-label="Cargando mapa">
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={28} className="animate-spin text-purple-soft" aria-hidden="true" />
              <span className="text-gray-500 dark:text-white/40 text-sm">Cargando recursos...</span>
            </div>
          </div>
        ) : isError ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gray-100 dark:bg-bg-dark" role="alert">
            <AlertCircle size={28} className="text-red-500" aria-hidden="true" />
            <p className="text-sm text-gray-500 dark:text-white/50">No se pudieron cargar los recursos.</p>
          </div>
        ) : (
          <ResourceMap
            resources={filtered}
            focusCity={focusCity}
            selectedId={selectedResource?.id}
            selectedResource={selectedResource}
            onSelect={handleSelect}
          />
        )}
      </div>

      {/* ── Floating top bar ── */}
      <div className="absolute top-[64px] left-0 right-0 z-[1000] px-3 sm:px-5 pt-3 space-y-2.5">
        {/* Search pill */}
        <div className="flex justify-center">
          <motion.form
            onSubmit={handleSearch}
            className="relative flex items-center rounded-full overflow-hidden shadow-lg"
            animate={{ width: searchFocused ? '340px' : '280px' }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            style={{
              background: 'rgba(255,255,255,0.96)',
              backdropFilter: 'blur(16px)',
              border: searchFocused ? '1.5px solid rgba(124,92,191,0.5)' : '1.5px solid rgba(0,0,0,0.1)',
              boxShadow: searchFocused
                ? '0 0 0 4px rgba(124,92,191,0.1), 0 8px 32px rgba(0,0,0,0.14)'
                : '0 4px 20px rgba(0,0,0,0.12)',
            }}
            role="search"
            aria-label="Buscar recursos por ciudad"
          >
            <Search size={15} className="absolute left-4 text-gray-400 flex-shrink-0 pointer-events-none" aria-hidden="true" />
            <label htmlFor="map-search" className="sr-only">Ciudad o estado</label>
            <input
              id="map-search"
              type="search"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Buscar ciudad o estado..."
              autoComplete="address-level2"
              className="flex-1 bg-transparent pl-10 pr-3 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none min-w-0"
            />
            <AnimatePresence>
              {searchInput && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  type="button"
                  onClick={clearSearch}
                  className="p-2 mr-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                  aria-label="Limpiar búsqueda"
                >
                  <X size={14} aria-hidden="true" />
                </motion.button>
              )}
            </AnimatePresence>
            {searchInput && (
              <button
                type="submit"
                className="px-4 py-2 mr-1.5 rounded-full text-xs font-semibold text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #7C5CBF, #6B4FAE)' }}
              >
                Ir
              </button>
            )}
          </motion.form>
        </div>

        {/* Filter pills */}
        <div className="flex justify-center">
          <div
            className="px-3 py-2 rounded-2xl flex items-center"
            style={{
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <ResourceFilters active={activeFilter} onChange={setActiveFilter} />
          </div>
        </div>
      </div>

      {/* ── Resource count badge ── */}
      <AnimatePresence>
        {!isLoading && !isError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute z-[1000]"
            style={{ top: 'calc(64px + 112px)', right: '16px' }}
          >
            <div
              className="px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                color: '#374151',
              }}
              aria-live="polite"
              aria-atomic="true"
            >
              {filtered.length} recurso{filtered.length !== 1 ? 's' : ''}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating legend ── */}
      <div
        className="absolute z-[1000] hidden sm:block"
        style={{ bottom: '20px', left: '16px' }}
      >
        <div
          className="px-3 py-3 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
          aria-label="Leyenda del mapa"
        >
          <ul className="flex flex-col gap-2" role="list">
            {LEGEND.map(item => (
              <li key={item.label} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full border-2 border-white"
                  style={{ background: item.color, boxShadow: `0 1px 4px ${item.color}60` }}
                  aria-hidden="true"
                />
                <span className="text-xs text-gray-600">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Resource detail panel ── */}
      <AnimatePresence>
        {selectedResource && (
          <ResourcePanel
            resource={selectedResource}
            onClose={() => setSelectedResource(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
