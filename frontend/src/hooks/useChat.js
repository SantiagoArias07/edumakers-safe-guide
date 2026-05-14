import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { chatApi } from '../api/chat'

export function useChat() {
  const [messages, setMessages] = useState([])
  const [emergency, setEmergency] = useState(false)

  const mutation = useMutation({
    mutationFn: ({ message, history }) => chatApi.sendMessage({ message, history }),
    onSuccess: ({ response, emergency: isEmergency }) => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response, id: Date.now(), emergency: isEmergency },
      ])
      if (isEmergency) setEmergency(true)
    },
    onError: (err) => {
      const detail = err.response?.data?.detail || 'Error al conectar con SafeGuide. Verifica tu conexión.'
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Lo siento, hubo un error: ${detail}`, id: Date.now(), isError: true },
      ])
    },
  })

  const sendMessage = useCallback(
    (text) => {
      if (!text.trim() || mutation.isPending) return
      const userMessage = { role: 'user', content: text, id: Date.now() }
      // Capture history before state update
      const history = messages.map(({ role, content }) => ({ role, content }))
      setMessages((prev) => [...prev, userMessage])
      mutation.mutate({ message: text, history })
    },
    [messages, mutation]
  )

  const clearChat = useCallback(() => {
    setMessages([])
    setEmergency(false)
    mutation.reset()
  }, [mutation])

  const dismissEmergency = useCallback(() => setEmergency(false), [])

  return {
    messages,
    loading: mutation.isPending,
    emergency,
    error: mutation.error?.response?.data?.detail ?? null,
    sendMessage,
    clearChat,
    dismissEmergency,
    setMessages,
  }
}
