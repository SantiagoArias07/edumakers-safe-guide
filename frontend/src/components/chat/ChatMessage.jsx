import { Shield, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

function parseContent(text) {
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  text = text.replace(
    /\[EMERGENCIA\]/g,
    `<span style="display:inline-flex;align-items:center;gap:4px;background:rgba(239,68,68,0.12);color:#EF4444;font-weight:700;font-size:11px;padding:2px 8px;border-radius:6px;border:1px solid rgba(239,68,68,0.25)">⚠ EMERGENCIA</span>`
  )
  const lines = text.split('\n')
  return lines
    .map((line) => {
      if (/^\d+\.\s/.test(line))
        return `<li style="margin-left:16px;list-style:decimal">${line.replace(/^\d+\.\s/, '')}</li>`
      if (/^[\*\-]\s/.test(line))
        return `<li style="margin-left:16px;list-style:disc">${line.slice(2)}</li>`
      if (!line.trim()) return '<br/>'
      return line
    })
    .join('\n')
}

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'
  const isWelcome = message.id === 'welcome'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Assistant avatar */}
      {!isUser && (
        <div
          className="w-6 h-6 rounded-lg bg-purple-soft/10 dark:bg-purple-soft/15 border border-purple-soft/15 flex items-center justify-center flex-shrink-0 mt-1"
          aria-hidden="true"
        >
          <Shield size={12} className="text-purple-soft" />
        </div>
      )}

      <div className={`flex flex-col gap-0.5 ${isUser ? 'items-end' : 'items-start'}`} style={{ maxWidth: '82%' }}>
        {message.isError ? (
          <div
            className="flex items-start gap-2 px-4 py-3 rounded-2xl rounded-tl-sm text-red-600 dark:text-red-400 text-sm"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span>{message.content}</span>
          </div>
        ) : (
          <div
            className={isUser ? 'bubble-user' : 'bubble-bot'}
            dangerouslySetInnerHTML={{ __html: parseContent(message.content) }}
            role={message.emergency ? 'alert' : undefined}
          />
        )}
      </div>
    </motion.div>
  )
}
