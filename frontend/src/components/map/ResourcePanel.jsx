import { X, Phone, Clock, MapPin, ExternalLink, MessageCircle, Navigation } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const TYPE_CONFIG = {
  refugio:     { label: 'Refugio',           color: '#E8705A' },
  legal:       { label: 'Asesoría Legal',    color: '#7C5CBF' },
  psicologico: { label: 'Apoyo Psicológico', color: '#3B82F6' },
  denuncia:    { label: 'Denuncia',          color: '#EF4444' },
  salud:       { label: 'Salud',             color: '#10B981' },
}

// Panel always has a white/light background, so all text is always dark
function PanelContent({ resource, onClose }) {
  const navigate = useNavigate()
  const cfg = TYPE_CONFIG[resource.type] || { label: resource.type, color: '#7C5CBF' }
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(`${resource.address}, ${resource.city}`)}`

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Mobile drag handle */}
      <div className="md:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
        <div className="w-9 h-1 rounded-full bg-gray-200" />
      </div>

      {/* Header */}
      <div className="flex items-start gap-3 px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex-1 min-w-0">
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2"
            style={{ background: `${cfg.color}18`, color: cfg.color, border: `1px solid ${cfg.color}35` }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} aria-hidden="true" />
            {cfg.label}
          </div>
          <h2 className="font-display font-bold text-gray-900 text-base leading-snug">
            {resource.name}
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            {resource.city}, {resource.state}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all flex-shrink-0"
          aria-label="Cerrar panel"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 min-h-0" style={{ scrollbarWidth: 'thin' }}>
        {resource.description && (
          <p className="text-gray-600 text-sm leading-relaxed">
            {resource.description}
          </p>
        )}
        <div className="space-y-4">
          {[
            { icon: MapPin,  label: 'Dirección', value: resource.address, isPhone: false },
            { icon: Clock,   label: 'Horario',   value: resource.hours,   isPhone: false },
            { icon: Phone,   label: 'Teléfono',  value: resource.phone,   isPhone: true  },
          ].filter(r => r.value).map(({ icon: Icon, label, value, isPhone }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5 border border-gray-200/60">
                <Icon size={13} className="text-gray-500" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xs text-gray-400 font-semibold uppercase tracking-wider mb-1">{label}</p>
                {isPhone ? (
                  <a href={`tel:${value?.replace(/\s/g, '')}`} className="text-sm font-medium font-mono" style={{ color: cfg.color }}>
                    {value}
                  </a>
                ) : (
                  <p className="text-gray-800 text-sm leading-snug">{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-4 border-t border-gray-100 grid grid-cols-2 gap-2.5 flex-shrink-0">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-xs py-2.5 flex items-center justify-center gap-1.5"
        >
          <Navigation size={13} aria-hidden="true" />
          Cómo llegar
        </a>
        <button onClick={() => navigate('/chat')} className="btn-primary text-xs py-2.5">
          <MessageCircle size={13} aria-hidden="true" />
          Orientación
        </button>
      </div>
    </div>
  )
}

export default function ResourcePanel({ resource, onClose }) {
  if (!resource) return null

  const panelStyle = {
    background: 'rgba(255,255,255,0.97)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(0,0,0,0.09)',
  }

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="md:hidden fixed inset-0 z-[1001]"
        style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Desktop floating panel */}
      <motion.aside
        initial={{ opacity: 0, x: -20, scale: 0.97 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -16, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 420, damping: 38 }}
        className="hidden md:flex fixed flex-col z-[1002]"
        style={{
          ...panelStyle,
          left: '16px',
          top: 'calc(64px + 16px)',
          width: '320px',
          maxHeight: 'calc(100vh - 64px - 32px)',
          borderRadius: '20px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.16)',
        }}
        aria-label={`Recurso: ${resource.name}`}
      >
        <PanelContent resource={resource} onClose={onClose} />
      </motion.aside>

      {/* Mobile bottom sheet */}
      <motion.aside
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 420, damping: 42 }}
        className="md:hidden fixed bottom-16 left-0 right-0 z-[1002] flex flex-col"
        style={{
          ...panelStyle,
          borderRadius: '24px 24px 0 0',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
          maxHeight: '65vh',
        }}
        aria-label={`Recurso: ${resource.name}`}
      >
        <PanelContent resource={resource} onClose={onClose} />
      </motion.aside>
    </>
  )
}
