import { useRef, useEffect, useState } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { useChat } from '../hooks/useChat'
import { chatApi } from '../api/chat'
import { queryKeys } from '../api/keys'
import ChatSidebar from '../components/chat/ChatSidebar'
import ChatWindow from '../components/chat/ChatWindow'
import ChatContextPanel from '../components/chat/ChatContextPanel'
import EmergencyBanner from '../components/chat/EmergencyBanner'
import { motion, AnimatePresence } from 'framer-motion'
import { PanelLeft, X } from 'lucide-react'

export default function Chat() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { messages, loading, emergency, sendMessage, clearChat, dismissEmergency, setMessages } = useChat()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState(null)

  const messagesRef = useRef(messages)
  messagesRef.current = messages
  const sessionIdRef = useRef(null)
  const prevLoadingRef = useRef(false)

  const updateSessionId = (id) => {
    sessionIdRef.current = id
    setCurrentSessionId(id)
  }

  const saveMutation = useMutation({
    mutationFn: chatApi.saveSession,
    onSuccess: (data) => {
      updateSessionId(data.id)
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.sessions() })
    },
  })

  const updateMutation = useMutation({
    mutationFn: chatApi.updateSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.sessions() })
    },
  })

  useEffect(() => {
    if (prevLoadingRef.current && !loading && user && messagesRef.current.length > 0) {
      if (localStorage.getItem('safeguide_autosave') === 'true') doSave(messagesRef.current)
    }
    prevLoadingRef.current = loading
  }, [loading, user])

  const doSave = (msgs) => {
    if (sessionIdRef.current) {
      updateMutation.mutate({ id: sessionIdRef.current, messages: msgs })
    } else {
      saveMutation.mutate({ messages: msgs })
    }
  }

  const handleNewChat = () => {
    clearChat()
    updateSessionId(null)
    setSidebarOpen(false)
  }

  const handleLoadSession = (session) => {
    setMessages(session.messages.map((m, i) => ({ ...m, id: i })))
    updateSessionId(session.id)
    setSidebarOpen(false)
  }

  const handleSave = () => {
    if (!user || messagesRef.current.length === 0) return
    doSave(messagesRef.current)
  }

  const handleContextPrompt = (text) => {
    sendMessage(text)
  }

  return (
    <div
      className="flex h-screen pt-16 pb-16 md:pb-0 overflow-hidden relative"
      style={{ background: '#08080F' }}
    >
      {/* Emergency banner */}
      <AnimatePresence>
        {emergency && <EmergencyBanner onDismiss={dismissEmergency} />}
      </AnimatePresence>

      {/* ── Mobile sidebar drawer ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-30 lg:hidden"
              style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 420, damping: 42, mass: 0.8 }}
              className="fixed left-0 top-16 bottom-0 z-40 lg:hidden w-72"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              {/* Mobile close button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute -right-10 top-3 w-8 h-8 rounded-xl flex items-center justify-center text-white/50 hover:text-white transition-colors z-50"
                style={{ background: 'rgba(255,255,255,0.08)' }}
                aria-label="Cerrar historial"
              >
                <X size={15} aria-hidden="true" />
              </button>
              <ChatSidebar
                onNewChat={handleNewChat}
                onLoadSession={handleLoadSession}
                currentSessionId={currentSessionId}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Desktop sidebar (always visible lg+) ── */}
      <aside
        className="hidden lg:flex flex-col w-56 xl:w-60 flex-shrink-0"
        aria-label="Historial de conversaciones"
      >
        <ChatSidebar
          onNewChat={handleNewChat}
          onLoadSession={handleLoadSession}
          currentSessionId={currentSessionId}
        />
      </aside>

      {/* ── Mobile toggle button (only on mobile) ── */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed bottom-20 left-4 z-20 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150"
        style={{
          background: 'rgba(124,92,191,0.2)',
          border: '1px solid rgba(124,92,191,0.3)',
          backdropFilter: 'blur(8px)',
        }}
        aria-label="Abrir historial de conversaciones"
        aria-expanded={sidebarOpen}
        aria-controls="mobile-sidebar"
      >
        <PanelLeft size={16} className="text-purple-light" aria-hidden="true" />
      </button>

      {/* ── Main chat ── */}
      <main id="main-content" className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ChatWindow
          messages={messages}
          loading={loading}
          onSend={sendMessage}
          onSave={handleSave}
          isSaved={!!currentSessionId}
        />
      </main>

      {/* ── Right context panel (xl+) ── */}
      <ChatContextPanel onSendPrompt={handleContextPrompt} />
    </div>
  )
}
