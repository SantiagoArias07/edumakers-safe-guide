import { X, Phone, AlertTriangle } from 'lucide-react'

export default function EmergencyBanner({ onDismiss }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <AlertTriangle size={20} className="text-white shrink-0 mt-0.5 sm:mt-0 animate-pulse" />
          <div>
            <p className="text-white font-semibold text-sm">Si estás en peligro inmediato:</p>
            <div className="flex flex-wrap gap-4 mt-1">
              <a
                href="tel:800911200"
                className="text-white font-bold text-base flex items-center gap-1.5 hover:text-red-100 transition-colors"
              >
                <Phone size={14} />
                LÍNEA VIDA: <span className="font-mono">800 911 2000</span>
              </a>
              <a
                href="tel:911"
                className="text-white font-bold text-base flex items-center gap-1.5 hover:text-red-100 transition-colors"
              >
                <Phone size={14} />
                Emergencias: <span className="font-mono">911</span>
              </a>
            </div>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-white/80 hover:text-white p-1 rounded transition-colors shrink-0"
          aria-label="Cerrar alerta"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
