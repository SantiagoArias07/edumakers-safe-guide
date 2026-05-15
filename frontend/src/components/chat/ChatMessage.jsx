import { Shield, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

function parseContent(text) {
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  text = text.replace(
    /\[EMERGENCIA\]/g,
    `<span style="display:inline-flex;align-items:center;gap:4px;background:rgba(239,68,68,0.14);color:#ef4444;font-weight:700;font-size:11px;padding:2px 8px;border-radius:6px;border:1px solid rgba(239,68,68,0.3)">⚠ EMERGENCIA</span>`
  )
  return text
    .split('\n')
    .map(line => {
      if (/^\d+\.\s/.test(line)) return `<li style="margin-left:1.1em;list-style-type:decimal">${line.replace(/^\d+\.\s/, '')}</li>`
      if (/^[\*\-]\s/.test(line)) return `<li style="margin-left:1.1em;list-style-type:disc">${line.slice(2)}</li>`
      if (!line.trim()) return '<br/>'
      return line
    })
    .join('\n')
}

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'
  const { isDark } = useTheme()

  const botBubbleStyle = isDark
    ? { background: 'rgba(255,255,255,0.055)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.85)' }
    : { background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.07)', color: '#1f2937' }

  const avatarStyle = isDark
    ? { background: 'rgba(124,92,191,0.15)', border: '1px solid rgba(124,92,191,0.2)' }
    : { background: 'rgba(124,92,191,0.1)', border: '1px solid rgba(124,92,191,0.2)' }

  const errorStyle = isDark
    ? { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }
    : { background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {!isUser && (
        <div
          className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={avatarStyle}
          aria-hidden="true"
        >
          <Shield size={13} className="text-purple-soft" />
        </div>
      )}

      <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`} style={{ maxWidth: '72%' }}>
        {message.isError ? (
          <div
            className="flex items-start gap-2 px-4 py-3 rounded-2xl rounded-tl-sm text-red-500 text-sm"
            style={errorStyle}
          >
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span className="leading-relaxed">{message.content}</span>
          </div>
        ) : isUser ? (
          <div
            className="px-4 py-3 rounded-2xl rounded-tr-sm text-white text-sm leading-relaxed"
            style={{
              background: 'linear-gradient(135deg, #7C5CBF, #6B4FAE)',
              boxShadow: '0 4px 20px rgba(124,92,191,0.3)',
            }}
            role={message.emergency ? 'alert' : undefined}
          >
            {message.content}
          </div>
        ) : (
          <div
            className="px-4 py-3.5 rounded-2xl rounded-tl-sm text-sm leading-relaxed"
            style={botBubbleStyle}
            dangerouslySetInnerHTML={{ __html: parseContent(message.content) }}
            role={message.emergency ? 'alert' : undefined}
          />
        )}
      </div>
    </motion.div>
  )
}
