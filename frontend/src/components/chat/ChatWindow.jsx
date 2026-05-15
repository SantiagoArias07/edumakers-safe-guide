import { useEffect, useRef, useState } from 'react'
import { ArrowUp, Shield, Save, MapPin, CheckCircle } from 'lucide-react'
import ChatMessage from './ChatMessage'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const WELCOME_MESSAGE = {
  role: 'assistant',
  id: 'welcome',
  content:
    'Hola. Este es un espacio seguro y confidencial.\n\nEstoy aquí para escucharte, orientarte y ayudarte a encontrar los recursos que necesitas. Cuéntame con tus palabras, ¿qué está pasando?',
}

const SUGGESTED_PROMPTS = [
  'Necesito orientación sobre una situación de violencia',
  '¿Cómo puedo levantar una denuncia?',
  'Busco un refugio o casa de acogida cercana',
  '¿Cuáles son mis derechos como víctima?',
  'Necesito apoyo psicológico urgente',
  'Me discriminaron en el trabajo',
]

function TypingDots() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex gap-2.5"
    >
      <div className="w-6 h-6 rounded-lg bg-purple-soft/10 border border-purple-soft/15 flex items-center justify-center flex-shrink-0 mt-1" aria-hidden="true">
        <Shield size={12} className="text-purple-soft" />
      </div>
      <div
        className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm"
        style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}
        role="status"
        aria-label="SafeGuide está escribiendo"
      >
        <div className="typing-dot text-gray-400 dark:text-white/40" />
        <div className="typing-dot text-gray-400 dark:text-white/40" />
        <div className="typing-dot text-gray-400 dark:text-white/40" />
      </div>
    </motion.div>
  )
}

export default function ChatWindow({ messages, loading, onSend, onSave, isSaved }) {
  const [input, setInput] = useState('')
  const [saveLabel, setSaveLabel] = useState(null)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)
  const { user } = useAuth()
  const navigate = useNavigate()
  const isEmpty = messages.length === 0

  const handleSave = async () => {
    await onSave()
    setSaveLabel('saved')
    setTimeout(() => setSaveLabel(null), 2000)
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = (text) => {
    if (!text.trim() || loading) return
    onSend(text.trim())
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleSubmit = (e) => { e.preventDefault(); send(input) }
  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) } }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-transparent">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-soft/10 dark:bg-purple-soft/15 border border-purple-soft/15 flex items-center justify-center" aria-hidden="true">
            <Shield size={15} className="text-purple-soft" />
          </div>
          <div>
            <h2 className="text-gray-900 dark:text-cream font-semibold text-sm leading-none mb-0.5">SafeGuide</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              <span className="text-gray-400 dark:text-white/35 text-xs">Disponible · Confidencial</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => navigate('/mapa')} className="btn-ghost text-xs px-3 py-2" aria-label="Ver mapa de recursos">
            <MapPin size={13} aria-hidden="true" />
            <span className="hidden sm:inline">Mapa</span>
          </button>
          {user && messages.length > 0 && (
            <button
              onClick={handleSave}
              aria-label={isSaved ? 'Actualizar conversación' : 'Guardar conversación'}
              className={`btn-ghost text-xs px-3 py-2 ${saveLabel === 'saved' ? 'text-emerald-600 dark:text-emerald-400' : ''}`}
            >
              {saveLabel === 'saved' ? <CheckCircle size={13} aria-hidden="true" /> : <Save size={13} aria-hidden="true" />}
              <span className="hidden sm:inline">{saveLabel === 'saved' ? 'Guardado' : isSaved ? 'Actualizar' : 'Guardar'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        className="flex-1 overflow-y-auto px-5 py-6 space-y-4"
        aria-live="polite"
        aria-label="Conversación"
      >
        <ChatMessage message={WELCOME_MESSAGE} />
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </AnimatePresence>
        {loading && <TypingDots />}
        <div ref={bottomRef} aria-hidden="true" />
      </div>

      {/* ── Suggested prompts (empty state) ── */}
      <AnimatePresence>
        {isEmpty && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-5 pb-3"
          >
            <p className="text-gray-400 dark:text-white/30 text-xs text-center mb-3">
              Empieza con una de estas opciones
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }} role="group" aria-label="Sugerencias de inicio">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => send(prompt)}
                  className="flex-shrink-0 text-left text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/55 hover:border-purple-soft/40 hover:bg-purple-soft/[0.03] hover:text-gray-900 dark:hover:text-cream transition-all duration-150 focus-visible:ring-2 focus-visible:ring-purple-soft/50 max-w-[200px] leading-relaxed"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Input ── */}
      <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-gray-100 dark:border-white/8">
        <form onSubmit={handleSubmit} className="flex gap-2.5 items-end">
          <label htmlFor="chat-input" className="sr-only">Escribe tu mensaje para SafeGuide</label>
          <textarea
            id="chat-input"
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
            }}
            onKeyDown={handleKeyDown}
            placeholder="Escribe lo que está pasando..."
            rows={1}
            disabled={loading}
            autoComplete="off"
            className="input-field resize-none min-h-[44px] max-h-[120px] py-3 text-sm leading-relaxed"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Enviar mensaje"
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
              input.trim() && !loading
                ? 'bg-purple-soft hover:bg-purple-dark text-white shadow-lg shadow-purple-soft/30'
                : 'bg-gray-100 dark:bg-white/8 text-gray-300 dark:text-white/25 cursor-not-allowed'
            }`}
          >
            <ArrowUp size={16} aria-hidden="true" />
          </button>
        </form>
        <p className="text-gray-300 dark:text-white/20 text-xs mt-2 text-center" aria-hidden="true">
          Enter para enviar · Shift+Enter nueva línea
        </p>
      </div>
    </div>
  )
}
