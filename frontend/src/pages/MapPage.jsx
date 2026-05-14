import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import ResourceMap from '../components/map/ResourceMap'
import ResourceFilters from '../components/map/ResourceFilters'
import { resourcesApi } from '../api/resources'
import { queryKeys } from '../api/keys'
import { Search, Loader2, AlertCircle } from 'lucide-react'

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

  return (
    <div className="flex flex-col h-screen pt-16 overflow-hidden bg-gray-50 dark:bg-bg-dark">
      <header className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-white/8 bg-white dark:bg-bg-dark/80 backdrop-blur-md space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-xl text-gray-900 dark:text-cream">
              Mapa de Recursos
            </h1>
            <p className="text-gray-400 dark:text-white/40 text-xs mt-0.5" aria-live="polite" aria-atomic="true">
              {isLoading ? 'Cargando...' : `${filtered.length} recurso${filtered.length !== 1 ? 's' : ''} en México`}
            </p>
          </div>

          <form onSubmit={handleCitySearch} className="flex gap-2" role="search" aria-label="Buscar recursos por ciudad">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30" aria-hidden="true" />
              <label htmlFor="city-search" className="sr-only">Buscar por ciudad o estado</label>
              <input
                id="city-search"
                type="search"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                placeholder="Buscar por ciudad..."
                className="input-field pl-8 text-xs h-9 w-44"
                autoComplete="address-level2"
              />
            </div>
            <button type="submit" className="btn-secondary text-xs px-3 h-9">
              Ir
            </button>
          </form>
        </div>

        <ResourceFilters active={activeFilter} onChange={setActiveFilter} />
      </header>

      <main id="main-content" className="flex-1 relative" aria-label="Mapa de recursos">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-bg-dark" role="status" aria-label="Cargando recursos">
            <Loader2 size={32} className="animate-spin text-purple-soft" aria-hidden="true" />
          </div>
        )}
        {isError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" role="alert">
            <AlertCircle size={32} className="text-red-500" aria-hidden="true" />
            <p className="text-sm text-gray-600 dark:text-white/60">No se pudieron cargar los recursos.</p>
          </div>
        )}
        {!isLoading && !isError && (
          <ResourceMap resources={filtered} focusCity={focusCity} />
        )}
      </main>

      <footer className="px-4 py-2 border-t border-gray-200 dark:border-white/8 bg-white dark:bg-bg-dark/80" aria-label="Leyenda del mapa">
        <ul className="flex flex-wrap gap-3" role="list">
          {LEGEND.map((item) => (
            <li key={item.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} aria-hidden="true" />
              <span className="text-gray-400 dark:text-white/40 text-xs">{item.label}</span>
            </li>
          ))}
        </ul>
      </footer>
    </div>
  )
}
