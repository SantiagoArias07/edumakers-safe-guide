import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'

// Note: Using CircleMarker instead of Marker+divIcon to avoid
// Leaflet's default icon initialization issues in Vite production builds.

const TYPE_COLORS = {
  refugio:     '#E8705A',
  legal:       '#7C5CBF',
  psicologico: '#3B82F6',
  denuncia:    '#EF4444',
  salud:       '#10B981',
}

function FlyToCity({ city, resources }) {
  const map = useMap()
  useEffect(() => {
    if (!city) return
    const found = resources.find(r => r.city?.toLowerCase().includes(city.toLowerCase()))
    if (found) map.flyTo([found.lat, found.lng], 12, { duration: 1.4, easeLinearity: 0.3 })
  }, [city, resources, map])
  return null
}

function FlyToSelected({ resource }) {
  const map = useMap()
  useEffect(() => {
    if (!resource) return
    map.flyTo([resource.lat, resource.lng], Math.max(map.getZoom(), 13), { duration: 0.8, easeLinearity: 0.3 })
  }, [resource, map])
  return null
}

export default function ResourceMap({ resources, focusCity, selectedId, onSelect, selectedResource }) {
  const { isDark } = useTheme()

  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

  const tileAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'

  return (
    <MapContainer center={[23.6, -102.5]} zoom={5} className="w-full h-full" zoomControl={false}>
      <TileLayer url={tileUrl} attribution={tileAttr} />
      <FlyToCity city={focusCity} resources={resources} />
      <FlyToSelected resource={selectedResource} />

      {resources.map(resource => {
        const color = TYPE_COLORS[resource.type] || '#7C5CBF'
        const isSelected = resource.id === selectedId
        return (
          <CircleMarker
            key={resource.id}
            center={[resource.lat, resource.lng]}
            radius={isSelected ? 12 : 7}
            pathOptions={{
              color: 'white',
              fillColor: color,
              fillOpacity: isSelected ? 1 : 0.85,
              weight: isSelected ? 3 : 2,
            }}
            eventHandlers={{ click: () => onSelect(resource) }}
          />
        )
      })}
    </MapContainer>
  )
}
