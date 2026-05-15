import { X, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

export default function EmergencyBanner({ onDismiss }) {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      role="alert"
      aria-live="assertive"
      className="fixed top-0 left-0 right-0 z-50 bg-red-600"
    >
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
            <Phone size={14} className="text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Si estás en peligro inmediato:</p>
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-1">
              <a
                href="tel:8009112000"
                className="text-white/90 hover:text-white text-sm flex items-center gap-1.5 transition-colors"
              >
                LÍNEA VIDA <span className="font-mono font-bold">800 911 2000</span>
              </a>
              <a
                href="tel:911"
                className="text-white/90 hover:text-white text-sm flex items-center gap-1.5 transition-colors"
              >
                Emergencias <span className="font-mono font-bold">911</span>
              </a>
            </div>
          </div>
        </div>
        <button
          onClick={onDismiss}
          aria-label="Cerrar alerta de emergencia"
          className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </motion.div>
  )
}
