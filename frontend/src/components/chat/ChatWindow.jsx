import { useEffect, useRef, useState } from 'react'
import { Send, Shield, Loader2, Save, MapPin, CheckCircle } from 'lucide-react'
import ChatMessage from './ChatMessage'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: 'Hola, soy SafeGuide. Este es un espacio seguro y confidencial. Estoy aquí para escucharte, orientarte y ayudarte a encontrar los recursos que necesitas.\n\n¿Qué está pasando? Cuéntame con tus palabras.',
  id: 'welcome',
}

export default function ChatWindow({ messages, loading, onSend, onSave, isSaved }) {
  const [input, setInput] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSaveClick = async () => {
    await onSave()
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2000)
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      onSend(input.trim())
      setInput('')
      if (textareaRef.current) textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const allMessages = messages.length === 0 ? [WELCOME_MESSAGE] : [WELCOME_MESSAGE, ...messages]

  return (
    <div className="flex flex-col h-full bg-white dark:bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-bg-dark/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-coral/10 dark:bg-coral/20 border border-coral/20 dark:border-coral/30 flex items-center justify-center">
            <Shield size={16} className="text-coral" />
          </div>
          <div>
            <h2 className="text-gray-900 dark:text-cream font-semibold text-sm">SafeGuide</h2>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-gray-400 dark:text-white/40 text-xs">En línea · Confidencial</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/mapa')}
            className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-white/50 hover:text-coral transition-colors px-3 py-1.5 rounded-lg hover:bg-coral/5 dark:hover:bg-coral/10"
          >
            <MapPin size={13} />
            Ver mapa
          </button>
          {user && messages.length > 0 && (
            <button
              onClick={handleSaveClick}
              className={`flex items-center gap-1.5 text-xs transition-colors px-3 py-1.5 rounded-lg ${
                saveSuccess
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-gray-400 dark:text-white/50 hover:text-purple-soft hover:bg-purple-soft/5 dark:hover:bg-purple-soft/10'
              }`}
            >
              {saveSuccess ? <CheckCircle size={13} /> : <Save size={13} />}
              {saveSuccess ? 'Guardado' : isSaved ? 'Actualizar' : 'Guardar'}
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        <AnimatePresence>
          {allMessages.map((msg) => (
            <ChatMessage key={msg.id || `${msg.role}-${msg.content.slice(0, 20)}`} message={msg} />
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-coral/10 dark:bg-coral/20 border border-coral/20 dark:border-coral/30 flex items-center justify-center shrink-0 mt-1">
              <Shield size={14} className="text-coral" />
            </div>
            <div className="chat-bubble-bot flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-gray-400 dark:text-white/40" />
              <span className="text-gray-400 dark:text-white/40 text-xs">SafeGuide está escribiendo...</span>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-bg-dark/30">
        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
              }}
              onKeyDown={handleKeyDown}
              placeholder="Cuéntame qué está pasando, este espacio es seguro y confidencial..."
              rows={1}
              className="input-field resize-none min-h-[44px] max-h-[120px] py-3 pr-4 text-sm"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-xl bg-coral hover:bg-coral-light disabled:bg-gray-200 dark:disabled:bg-white/10 disabled:text-gray-400 dark:disabled:text-white/20 text-white flex items-center justify-center transition-all shrink-0 shadow-lg shadow-coral/20 disabled:shadow-none"
          >
            <Send size={16} />
          </button>
        </form>
        <p className="text-gray-400 dark:text-white/20 text-xs mt-2 text-center">
          Presiona Enter para enviar · Shift+Enter para nueva línea
        </p>
      </div>
    </div>
  )
}
