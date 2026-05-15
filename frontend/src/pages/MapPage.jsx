import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import ResourceMap from '../components/map/ResourceMap'
import ResourceFilters from '../components/map/ResourceFilters'
import ResourcePanel from '../components/map/ResourcePanel'
import { resourcesApi } from '../api/resources'
import { queryKeys } from '../api/keys'
import { Search, Loader2, AlertCircle, X } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'

const LEGEND = [
  { color: '#E8705A', label: 'Refugio' },
  { color: '#7C5CBF', label: 'Legal' },
  { color: '#3B82F6', label: 'Psicológico' },
  { color: '#EF4444', label: 'Denuncia' },
  { color: '#10B981', label: 'Salud' },
]

export default function MapPage() {
  const [activeFilter, setActiveFilter] = useState(null)
  const [citySearch, setCitySearch] = useState('')
  const [focusCity, setFocusCity] = useState(null)
  const [selectedResource, setSelectedResource] = useState(null)

  useEffect(() => {
    const savedCity = localStorage.getItem('safeguide_map_city')
    if (savedCity) {
      setCitySearch(savedCity)
      setFocusCity(savedCity)
      localStorage.removeItem('safeguide_map_city')
    }
  }, [])

  const { data: resources = [], isLoading, isError } = useQuery({
    queryKey: queryKeys.resources.all(),
    queryFn: () => resourcesApi.getAll(),
    staleTime: Infinity,
  })

  const filtered = useMemo(() => {
    let result = resources
    if (activeFilter) result = result.filter((r) => r.type === activeFilter)
    if (citySearch.trim()) {
      const term = citySearch.toLowerCase()
      result = result.filter(
        (r) =>
          r.city?.toLowerCase().includes(term) ||
          r.state?.toLowerCase().includes(term)
      )
    }
    return result
  }, [resources, activeFilter, citySearch])

  const handleCitySearch = (e) => {
    e.preventDefault()
    setFocusCity(citySearch)
  }

  const handleSelect = (resource) => {
    setSelectedResource((prev) => (prev?.id === resource.id ? null : resource))
  }

  const clearSearch = () => {
    setCitySearch('')
    setFocusCity(null)
  }

  return (
    <div className="flex flex-col h-screen pt-16 pb-16 md:pb-0 overflow-hidden bg-gray-50 dark:bg-bg-dark">
      {/* Header */}
      <header className="bg-white dark:bg-bg-dark border-b border-gray-100 dark:border-white/8 px-4 sm:px-5 py-3 space-y-3 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-display font-bold text-lg text-gray-900 dark:text-cream">
              Mapa de Recursos
            </h1>
            <p className="text-gray-400 dark:text-white/35 text-xs mt-0.5" aria-live="polite" aria-atomic="true">
              {isLoading ? 'Cargando...' : `${filtered.length} recurso${filtered.length !== 1 ? 's' : ''} disponibles`}
            </p>
          </div>

          <form onSubmit={handleCitySearch} className="flex gap-2" role="search" aria-label="Buscar recursos por ciudad">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30 pointer-events-none" aria-hidden="true" />
              <label htmlFor="city-search" className="sr-only">Ciudad o estado</label>
              <input
                id="city-search"
                type="search"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                placeholder="Ciudad o estado..."
                className="input-field pl-8 pr-8 text-xs h-9 w-48"
                autoComplete="address-level2"
              />
              {citySearch && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-cream"
                  aria-label="Limpiar búsqueda"
                >
                  <X size={12} aria-hidden="true" />
                </button>
              )}
            </div>
            <button type="submit" className="btn-secondary text-xs px-3 h-9">
              Buscar
            </button>
          </form>
        </div>

        <ResourceFilters active={activeFilter} onChange={setActiveFilter} />
      </header>

      {/* Map + Panel */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Map */}
        <main id="main-content" className="flex-1 relative" aria-label="Mapa interactivo de recursos">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-bg-dark z-10" role="status" aria-label="Cargando mapa">
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={28} className="animate-spin text-purple-soft" aria-hidden="true" />
                <span className="text-gray-400 dark:text-white/40 text-sm">Cargando recursos...</span>
              </div>
            </div>
          )}
          {isError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" role="alert">
              <AlertCircle size={28} className="text-red-500" aria-hidden="true" />
              <p className="text-sm text-gray-600 dark:text-white/60">No se pudieron cargar los recursos.</p>
            </div>
          )}
          {!isLoading && !isError && (
            <ResourceMap
              resources={filtered}
              focusCity={focusCity}
              selectedId={selectedResource?.id}
              onSelect={handleSelect}
            />
          )}

          {/* Legend — floating over map */}
          <div className="absolute bottom-3 left-3 z-[400] bg-white/90 dark:bg-bg-card/90 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-white/8 px-3 py-2 shadow-md hidden sm:block">
            <ul className="flex flex-col gap-1.5" role="list" aria-label="Leyenda">
              {LEGEND.map((item) => (
                <li key={item.label} className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: item.color }}
                    aria-hidden="true"
                  />
                  <span className="text-gray-500 dark:text-white/50 text-xs">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </main>

        {/* Resource detail panel */}
        <AnimatePresence>
          {selectedResource && (
            <ResourcePanel
              resource={selectedResource}
              onClose={() => setSelectedResource(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
