import { Shield, User, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

function formatText(text) {
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  text = text.replace(/\[EMERGENCIA\]/g, '<span class="text-red-500 font-bold">[EMERGENCIA]</span>')
  const lines = text.split('\n')
  const formatted = lines.map((line) => {
    if (/^\d+\.\s/.test(line)) return `<li class="ml-4">${line.replace(/^\d+\.\s/, '')}</li>`
    if (/^\*\s/.test(line)) return `<li class="ml-4 list-disc">${line.slice(2)}</li>`
    return line
  })
  return formatted.join('<br />')
}

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
          isUser
            ? 'bg-purple-soft/20 dark:bg-purple-soft/30'
            : 'bg-coral/10 dark:bg-coral/20 border border-coral/20 dark:border-coral/30'
        }`}
      >
        {isUser ? (
          <User size={14} className="text-purple-soft" />
        ) : (
          <Shield size={14} className="text-coral" />
        )}
      </div>

      {/* Bubble */}
      <div className={`flex flex-col gap-1 max-w-[78%] ${isUser ? 'items-end' : 'items-start'}`}>
        <span className="text-gray-400 dark:text-white/30 text-xs px-1">
          {isUser ? 'Tú' : 'SafeGuide'}
        </span>
        <div className={isUser ? 'chat-bubble-user' : 'chat-bubble-bot'}>
          {message.isError ? (
            <div className="flex items-start gap-2 text-red-500">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{message.content}</span>
            </div>
          ) : (
            <div
              className="leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatText(message.content) }}
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}
