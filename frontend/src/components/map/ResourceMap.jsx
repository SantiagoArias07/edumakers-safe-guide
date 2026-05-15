import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'
import { useTheme } from '../../context/ThemeContext'

// Fix Leaflet default icon 404 errors in Vite production builds
// (Leaflet tries to load default marker images that don't exist in the built bundle)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl: null, iconUrl: null, shadowUrl: null })

const TYPE_COLORS = {
  refugio:     '#E8705A',
  legal:       '#7C5CBF',
  psicologico: '#3B82F6',
  denuncia:    '#EF4444',
  salud:       '#10B981',
}

function createIcon(color, isSelected) {
  const size = isSelected ? 22 : 13
  const ring = isSelected ? `, 0 0 0 7px ${color}22` : ''
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;background:${color};border:${isSelected ? 3 : 2}px solid white;border-radius:50%;box-shadow:0 2px 12px ${color}80${ring};transition:all 0.25s ease;cursor:pointer;"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
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
        return (
          <Marker
            key={resource.id}
            position={[resource.lat, resource.lng]}
            icon={createIcon(color, resource.id === selectedId)}
            eventHandlers={{ click: () => onSelect(resource) }}
          />
        )
      })}
    </MapContainer>
  )
}
