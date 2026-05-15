import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'
import { useTheme } from '../../context/ThemeContext'

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
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${color};
      border:${isSelected ? 3 : 2}px solid white;
      border-radius:50%;
      box-shadow:0 2px 12px ${color}80${ring};
      transition:all 0.25s cubic-bezier(0.16,1,0.3,1);
      cursor:pointer;
    "></div>`,
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
    const currentZoom = map.getZoom()
    const targetZoom = Math.max(currentZoom, 13)
    map.flyTo([resource.lat, resource.lng], targetZoom, { duration: 0.8, easeLinearity: 0.3 })
  }, [resource, map])
  return null
}

export default function ResourceMap({ resources, focusCity, selectedId, onSelect, selectedResource }) {
  const { isDark } = useTheme()

  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

  const tileAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

  return (
    <MapContainer
      center={[23.6, -102.5]}
      zoom={5}
      className="w-full h-full"
      zoomControl={false}
    >
      <TileLayer url={tileUrl} attribution={tileAttr} />
      <FlyToCity city={focusCity} resources={resources} />
      <FlyToSelected resource={selectedResource} />

      {resources.map(resource => {
        const color = TYPE_COLORS[resource.type] || '#7C5CBF'
        const isSelected = resource.id === selectedId
        return (
          <Marker
            key={resource.id}
            position={[resource.lat, resource.lng]}
            icon={createIcon(color, isSelected)}
            eventHandlers={{ click: () => onSelect(resource) }}
            aria-label={resource.name}
          />
        )
      })}
    </MapContainer>
  )
}
