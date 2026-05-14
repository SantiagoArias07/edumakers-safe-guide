import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import { Phone, Clock, MapPin, ExternalLink } from 'lucide-react'

const TYPE_COLORS = {
  refugio: '#E8705A',
  legal: '#7C5CBF',
  psicologico: '#3B82F6',
  denuncia: '#EF4444',
  salud: '#10B981',
}

const TYPE_LABELS = {
  refugio: '🏠 Refugio',
  legal: '⚖️ Asesoría Legal',
  psicologico: '🧠 Apoyo Psicológico',
  denuncia: '🚨 Denuncia',
  salud: '🏥 Salud',
}

function FlyToCity({ city, resources }) {
  const map = useMap()

  useEffect(() => {
    if (!city) return
    const found = resources.find((r) =>
      r.city.toLowerCase().includes(city.toLowerCase())
    )
    if (found) {
      map.flyTo([found.lat, found.lng], 12, { duration: 1.5 })
    }
  }, [city, resources, map])

  return null
}

export default function ResourceMap({ resources, focusCity }) {
  return (
    <MapContainer
      center={[23.6, -102.5]}
      zoom={5}
      className="w-full h-full rounded-xl overflow-hidden"
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FlyToCity city={focusCity} resources={resources} />

      {resources.map((resource) => (
        <CircleMarker
          key={resource.id}
          center={[resource.lat, resource.lng]}
          radius={9}
          pathOptions={{
            color: TYPE_COLORS[resource.type] || '#7C5CBF',
            fillColor: TYPE_COLORS[resource.type] || '#7C5CBF',
            fillOpacity: 0.85,
            weight: 2,
          }}
        >
          <Popup maxWidth={280}>
            <div className="p-1">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-lg">{TYPE_LABELS[resource.type]?.split(' ')[0] || '📍'}</span>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">{resource.name}</h3>
                  <span className="text-xs text-gray-400 dark:text-white/50">{TYPE_LABELS[resource.type] || resource.type}</span>
                </div>
              </div>

              {resource.description && (
                <p className="text-gray-500 dark:text-white/60 text-xs mb-3 leading-relaxed">{resource.description}</p>
              )}

              <div className="space-y-1.5">
                <div className="flex items-start gap-1.5">
                  <MapPin size={11} className="text-gray-300 dark:text-white/40 mt-0.5 shrink-0" />
                  <span className="text-gray-600 dark:text-white/70 text-xs">{resource.address}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone size={11} className="text-gray-300 dark:text-white/40 shrink-0" />
                  <a
                    href={`tel:${resource.phone.replace(/\s/g, '')}`}
                    className="text-coral text-xs font-medium font-mono hover:text-coral-light"
                  >
                    {resource.phone}
                  </a>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={11} className="text-gray-300 dark:text-white/40 shrink-0" />
                  <span className="text-gray-500 dark:text-white/60 text-xs">{resource.hours}</span>
                </div>
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(resource.address + ', ' + resource.city)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center gap-1 text-xs text-purple-soft dark:text-purple-light hover:text-purple-dark transition-colors"
              >
                <ExternalLink size={11} />
                Cómo llegar
              </a>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
