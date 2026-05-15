import { useEffect, useRef, useState } from 'react'
import { ArrowUp, Shield, Save, MapPin, CheckCircle } from 'lucide-react'
import ChatMessage from './ChatMessage'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const WELCOME_MESSAGE = {
  role: 'assistant',
  id: 'welcome',
  content: 'Hola. Este es un espacio seguro y confidencial.\n\nEstoy aquí para escucharte, orientarte y ayudarte a encontrar los recursos que necesitas. Cuéntame con tus palabras, ¿qué está pasando?',
}

const SUGGESTED_PROMPTS = [
  'Necesito orientación sobre una situación de violencia',
  '¿Cómo puedo levantar una denuncia?',
  'Busco un refugio o casa de acogida',
  '¿Cuáles son mis derechos como víctima?',
  'Necesito apoyo psicológico urgente',
  'Me discriminaron en el trabajo',
]

/* ── Typing indicator ──────────────────────────────────────── */
function TypingDots() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.2 }}
      className="flex gap-3"
    >
      <div
        className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: 'rgba(124,92,191,0.15)', border: '1px solid rgba(124,92,191,0.2)' }}
        aria-hidden="true"
      >
        <Shield size={13} className="text-purple-light" />
      </div>
      <div
        className="flex items-center gap-1.5 px-4 py-3.5 rounded-2xl rounded-tl-sm"
        style={{ background: 'rgba(255,255,255,0.055)', border: '1px solid rgba(255,255,255,0.09)' }}
        role="status"
        aria-label="SafeGuide está escribiendo"
      >
        <div className="typing-dot" style={{ color: 'rgba(255,255,255,0.35)' }} />
        <div className="typing-dot" style={{ color: 'rgba(255,255,255,0.35)' }} />
        <div className="typing-dot" style={{ color: 'rgba(255,255,255,0.35)' }} />
      </div>
    </motion.div>
  )
}

/* ── ChatWindow ────────────────────────────────────────────── */
export default function ChatWindow({ messages, loading, onSend, onSave, isSaved }) {
  const [input, setInput] = useState('')
  const [saveLabel, setSaveLabel] = useState(null)
  const [focused, setFocused] = useState(false)
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
    <div
      className="flex flex-col h-full min-w-0"
      style={{ background: '#08080F' }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-5 py-3.5 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(124,92,191,0.15)', border: '1px solid rgba(124,92,191,0.2)' }}
            aria-hidden="true"
          >
            <Shield size={15} className="text-purple-light" />
          </div>
          <div>
            <h2 className="text-white/90 font-semibold text-sm leading-none mb-0.5">SafeGuide</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              <span className="text-white/30 text-xs">Disponible · Confidencial</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate('/mapa')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-all duration-150 focus-visible:ring-2 focus-visible:ring-purple-soft/50"
            style={{ color: 'rgba(255,255,255,0.35)', background: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
            aria-label="Ver mapa de recursos"
          >
            <MapPin size={13} aria-hidden="true" />
            <span className="hidden sm:inline">Mapa</span>
          </button>

          {user && messages.length > 0 && (
            <button
              onClick={handleSave}
              aria-label={isSaved ? 'Actualizar' : 'Guardar conversación'}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-all duration-150 focus-visible:ring-2 focus-visible:ring-purple-soft/50"
              style={{
                color: saveLabel === 'saved' ? 'rgba(52,211,153,0.9)' : 'rgba(255,255,255,0.35)',
                background: 'transparent',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = saveLabel === 'saved' ? 'rgba(52,211,153,0.9)' : 'rgba(255,255,255,0.35)' }}
            >
              {saveLabel === 'saved'
                ? <CheckCircle size={13} aria-hidden="true" />
                : <Save size={13} aria-hidden="true" />}
              <span className="hidden sm:inline">{saveLabel === 'saved' ? 'Guardado' : isSaved ? 'Actualizar' : 'Guardar'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        className="flex-1 overflow-y-auto py-8 px-4 sm:px-6 space-y-5"
        aria-live="polite"
        aria-label="Conversación con SafeGuide"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}
      >
        {/* Max width container for readability */}
        <div className="max-w-2xl mx-auto w-full space-y-5">
          <ChatMessage message={WELCOME_MESSAGE} />

          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
          </AnimatePresence>

          {loading && <TypingDots />}
          <div ref={bottomRef} aria-hidden="true" />
        </div>
      </div>

      {/* ── Suggested prompts ── */}
      <AnimatePresence>
        {isEmpty && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.3 }}
            className="px-4 sm:px-6 pb-3 flex-shrink-0"
          >
            <div className="max-w-2xl mx-auto">
              <p className="text-white/20 text-xs text-center mb-3">Sugerencias para empezar</p>
              <div
                className="flex gap-2 overflow-x-auto pb-1"
                style={{ scrollbarWidth: 'none' }}
                role="group"
                aria-label="Sugerencias de inicio"
              >
                {SUGGESTED_PROMPTS.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => send(prompt)}
                    className="flex-shrink-0 text-xs px-3.5 py-2.5 rounded-xl transition-all duration-150 focus-visible:ring-2 focus-visible:ring-purple-soft/50 text-left max-w-[200px] leading-snug"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.45)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(124,92,191,0.1)'
                      e.currentTarget.style.borderColor = 'rgba(124,92,191,0.3)'
                      e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                      e.currentTarget.style.color = 'rgba(255,255,255,0.45)'
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Input area ── */}
      <div className="px-4 sm:px-6 pb-5 pt-3 flex-shrink-0">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} aria-label="Enviar mensaje">
            <div
              className="flex gap-3 items-end p-3 rounded-2xl transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: focused
                  ? '1px solid rgba(124,92,191,0.5)'
                  : '1px solid rgba(255,255,255,0.09)',
                boxShadow: focused
                  ? '0 0 0 3px rgba(124,92,191,0.08), 0 8px 32px rgba(0,0,0,0.3)'
                  : '0 4px 20px rgba(0,0,0,0.2)',
              }}
            >
              <label htmlFor="chat-input" className="sr-only">Escribe tu mensaje para SafeGuide</label>
              <textarea
                id="chat-input"
                ref={textareaRef}
                value={input}
                onChange={e => {
                  setInput(e.target.value)
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px'
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Escribe lo que está pasando..."
                rows={1}
                disabled={loading}
                autoComplete="off"
                className="flex-1 resize-none bg-transparent text-sm leading-relaxed focus:outline-none min-h-[24px] max-h-[140px]"
                style={{
                  color: 'rgba(255,255,255,0.85)',
                  caretColor: '#9B7FD4',
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Enviar mensaje"
                className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150"
                style={{
                  background: input.trim() && !loading
                    ? 'linear-gradient(135deg, #7C5CBF, #6B4FAE)'
                    : 'rgba(255,255,255,0.06)',
                  boxShadow: input.trim() && !loading ? '0 4px 16px rgba(124,92,191,0.4)' : 'none',
                  cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                }}
              >
                <ArrowUp
                  size={16}
                  style={{ color: input.trim() && !loading ? 'white' : 'rgba(255,255,255,0.2)' }}
                  aria-hidden="true"
                />
              </button>
            </div>
          </form>
          <p className="text-center text-xs mt-2" style={{ color: 'rgba(255,255,255,0.15)' }} aria-hidden="true">
            Enter para enviar · Shift+Enter para nueva línea
          </p>
        </div>
      </div>
    </div>
  )
}
