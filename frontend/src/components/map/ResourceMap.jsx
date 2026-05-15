import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet'
import { useEffect } from 'react'

const TYPE_COLORS = {
  refugio:    '#E8705A',
  legal:      '#7C5CBF',
  psicologico:'#3B82F6',
  denuncia:   '#EF4444',
  salud:      '#10B981',
}

function FlyToCity({ city, resources }) {
  const map = useMap()
  useEffect(() => {
    if (!city) return
    const found = resources.find((r) =>
      r.city?.toLowerCase().includes(city.toLowerCase())
    )
    if (found) map.flyTo([found.lat, found.lng], 12, { duration: 1.2 })
  }, [city, resources, map])
  return null
}

export default function ResourceMap({ resources, focusCity, selectedId, onSelect }) {
  return (
    <MapContainer
      center={[23.6, -102.5]}
      zoom={5}
      className="w-full h-full"
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FlyToCity city={focusCity} resources={resources} />

      {resources.map((resource) => {
        const color = TYPE_COLORS[resource.type] || '#7C5CBF'
        const isSelected = resource.id === selectedId

        return (
          <CircleMarker
            key={resource.id}
            center={[resource.lat, resource.lng]}
            radius={isSelected ? 13 : 8}
            pathOptions={{
              color: 'white',
              fillColor: color,
              fillOpacity: isSelected ? 1 : 0.8,
              weight: isSelected ? 3 : 2,
            }}
            eventHandlers={{
              click: () => onSelect(resource),
            }}
            aria-label={resource.name}
          />
        )
      })}
    </MapContainer>
  )
}
