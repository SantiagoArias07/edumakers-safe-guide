import { useRef, useEffect, useState } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { useChat } from '../hooks/useChat'
import { chatApi } from '../api/chat'
import { queryKeys } from '../api/keys'
import ChatSidebar from '../components/chat/ChatSidebar'
import ChatWindow from '../components/chat/ChatWindow'
import EmergencyBanner from '../components/chat/EmergencyBanner'
import { Menu, X } from 'lucide-react'

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
      if (localStorage.getItem('safeguide_autosave') === 'true') {
        doSave(messagesRef.current)
      }
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

  return (
    <div className="flex h-screen pt-16 pb-16 md:pb-0 overflow-hidden bg-white dark:bg-bg-dark">
      {emergency && <EmergencyBanner onDismiss={dismissEmergency} />}

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-4 left-4 z-30 w-11 h-11 bg-purple-soft rounded-full flex items-center justify-center shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-soft/50 focus:ring-offset-2"
        aria-label={sidebarOpen ? 'Cerrar historial' : 'Abrir historial de conversaciones'}
        aria-expanded={sidebarOpen}
        aria-controls="chat-sidebar"
      >
        {sidebarOpen ? <X size={18} className="text-white" aria-hidden="true" /> : <Menu size={18} className="text-white" aria-hidden="true" />}
      </button>

      <div
        id="chat-sidebar"
        className={`
          fixed lg:relative inset-y-0 left-0 z-20 pt-16 lg:pt-0
          transform transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        aria-hidden={!sidebarOpen && window.innerWidth < 1024}
      >
        <div className="h-full">
          <ChatSidebar
            onNewChat={handleNewChat}
            onLoadSession={handleLoadSession}
            currentMessages={messages}
          />
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <main id="main-content" className="flex-1 min-w-0 h-full">
        <ChatWindow
          messages={messages}
          loading={loading}
          onSend={sendMessage}
          onSave={handleSave}
          isSaved={!!currentSessionId}
        />
      </main>
    </div>
  )
}
