import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, MapPin, Phone } from 'lucide-react'

export default function FinalCTA() {
  const navigate = useNavigate()

  return (
    <section
      className="relative py-28 sm:py-40 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #5A3F9B 0%, #7C5CBF 50%, #6B4FAE 100%)' }}
      aria-labelledby="cta-heading"
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 60% 80% at 100% 0%, rgba(255,255,255,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 0% 100%, rgba(0,0,0,0.15) 0%, transparent 70%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Grid noise */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-white/50 text-sm font-semibold tracking-widest uppercase mb-6">
            Dar el primer paso
          </p>
          <h2
            id="cta-heading"
            className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-white tracking-tighter leading-tight mb-6"
          >
            No tienes que
            <br />
            hacerlo sola.
          </h2>
          <p className="text-white/55 text-lg leading-relaxed max-w-xl mx-auto mb-12">
            SafeGuide está aquí ahora. Sin esperas, sin registro, sin juicios. Solo orientación real cuando más la necesitas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button
              onClick={() => navigate('/chat')}
              className="inline-flex items-center gap-2.5 bg-white text-purple-dark font-bold px-8 py-4 rounded-2xl text-base hover:bg-cream active:scale-[0.97] transition-all duration-150 shadow-lg"
            >
              Hablar con SafeGuide ahora
              <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button
              onClick={() => navigate('/mapa')}
              className="btn-secondary-light px-8 py-4 text-base rounded-2xl"
            >
              <MapPin size={16} aria-hidden="true" />
              Ver recursos cerca de ti
            </button>
          </div>

          {/* Emergency strip */}
          <div
            className="inline-flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-8 py-4 rounded-2xl"
            style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <span className="text-white/50 text-xs uppercase tracking-widest font-semibold">Emergencias:</span>
            {[
              { label: 'LÍNEA VIDA', number: '800 911 2000', href: 'tel:8009112000' },
              { label: '911', number: '911', href: 'tel:911' },
              { label: 'CNDH', number: '800 715 2000', href: 'tel:8007152000' },
            ].map(({ label, number, href }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
                aria-label={`Llamar a ${label}: ${number}`}
              >
                <Phone size={12} aria-hidden="true" />
                <span className="text-xs font-medium">{label}</span>
                <span className="font-mono text-xs text-white/60">{number}</span>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
