import { X, Phone, Clock, MapPin, ExternalLink, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const TYPE_CONFIG = {
  refugio:    { label: 'Refugio',           dot: '#E8705A', bg: 'rgba(232,112,90,0.1)',  border: 'rgba(232,112,90,0.25)', text: '#E8705A' },
  legal:      { label: 'Asesoría Legal',    dot: '#7C5CBF', bg: 'rgba(124,92,191,0.1)', border: 'rgba(124,92,191,0.25)', text: '#7C5CBF' },
  psicologico:{ label: 'Apoyo Psicológico', dot: '#3B82F6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)', text: '#3B82F6' },
  denuncia:   { label: 'Denuncia',          dot: '#EF4444', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.25)',  text: '#EF4444' },
  salud:      { label: 'Salud',             dot: '#10B981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', text: '#10B981' },
}

export default function ResourcePanel({ resource, onClose }) {
  const navigate = useNavigate()
  if (!resource) return null

  const cfg = TYPE_CONFIG[resource.type] || { label: resource.type, dot: '#7C5CBF', bg: 'rgba(124,92,191,0.1)', border: 'rgba(124,92,191,0.25)', text: '#7C5CBF' }
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(`${resource.address}, ${resource.city}`)}`

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-20"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <motion.aside
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 40, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex md:w-80 lg:w-96 flex-col border-l border-gray-100 dark:border-white/8 bg-white dark:bg-ink-soft overflow-hidden"
        aria-label={`Detalle: ${resource.name}`}
      >
        <PanelContent resource={resource} cfg={cfg} mapsUrl={mapsUrl} onClose={onClose} navigate={navigate} />
      </motion.aside>

      {/* Mobile bottom sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-ink-soft rounded-t-3xl overflow-hidden"
        style={{ boxShadow: '0 -8px 40px rgba(0,0,0,0.2)' }}
        aria-label={`Detalle: ${resource.name}`}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-white/15" />
        </div>
        <PanelContent resource={resource} cfg={cfg} mapsUrl={mapsUrl} onClose={onClose} navigate={navigate} />
      </motion.div>
    </>
  )
}

function PanelContent({ resource, cfg, mapsUrl, onClose, navigate }) {
  return (
    <div className="flex flex-col h-full max-h-[70vh] md:max-h-none">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-white/8">
        <div className="flex-1 min-w-0">
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-2.5"
            style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.dot }} aria-hidden="true" />
            {cfg.label}
          </div>
          <h2 className="font-display font-semibold text-gray-900 dark:text-cream text-base leading-snug">
            {resource.name}
          </h2>
          <p className="text-gray-400 dark:text-white/40 text-xs mt-1">
            {resource.city}, {resource.state}
          </p>
        </div>
        <button
          onClick={onClose}
          className="btn-ghost p-1.5 -mr-1 flex-shrink-0"
          aria-label="Cerrar panel"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {resource.description && (
          <p className="text-gray-600 dark:text-white/55 text-sm leading-relaxed">
            {resource.description}
          </p>
        )}

        <div className="space-y-4">
          {[
            { icon: MapPin, label: 'Dirección', value: resource.address, type: 'text' },
            { icon: Clock,  label: 'Horario',   value: resource.hours,   type: 'text' },
            { icon: Phone,  label: 'Teléfono',  value: resource.phone,   type: 'phone' },
          ].map(({ icon: Icon, label, value, type }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-white/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon size={13} className="text-gray-500 dark:text-white/50" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xs text-gray-400 dark:text-white/35 font-semibold uppercase tracking-wider mb-0.5">
                  {label}
                </p>
                {type === 'phone' ? (
                  <a
                    href={`tel:${value?.replace(/\s/g, '')}`}
                    className="text-coral font-medium text-sm font-mono hover:text-coral-light transition-colors"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="text-gray-700 dark:text-white/75 text-sm">{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-100 dark:border-white/8 grid grid-cols-2 gap-2">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-xs py-2.5"
          aria-label="Ver cómo llegar"
        >
          <ExternalLink size={13} aria-hidden="true" />
          Cómo llegar
        </a>
        <button
          onClick={() => navigate('/chat')}
          className="btn-primary text-xs py-2.5"
        >
          <MessageCircle size={13} aria-hidden="true" />
          Pedir orientación
        </button>
      </div>
    </div>
  )
}
