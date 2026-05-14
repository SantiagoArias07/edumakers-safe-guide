import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { chatApi } from '../../api/chat'
import { queryKeys } from '../../api/keys'
import { SessionSkeleton } from '../ui/Skeleton'
import { EmptyState } from '../ui/EmptyState'
import { MessageSquare, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ConversationHistory() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [expanded, setExpanded] = useState(null)

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: queryKeys.chat.sessions(),
    queryFn: chatApi.getSessions,
  })

  const deleteMutation = useMutation({
    mutationFn: chatApi.deleteSession,
    onSuccess: (_, id) => {
      queryClient.setQueryData(queryKeys.chat.sessions(), (prev = []) =>
        prev.filter((s) => s.id !== id)
      )
    },
  })

  if (isLoading) return <SessionSkeleton />

  if (sessions.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        description="Aún no tienes conversaciones guardadas"
        action={
          <button
            onClick={() => navigate('/chat')}
            className="mt-2 text-sm text-coral hover:text-coral-light transition-colors focus:outline-none focus:underline"
          >
            Iniciar una conversación →
          </button>
        }
      />
    )
  }

  return (
    <div className="space-y-2" role="list" aria-label="Conversaciones guardadas">
      {sessions.map((session) => {
        const isExpanded = expanded === session.id
        return (
          <div key={session.id} className="card p-4" role="listitem">
            <div
              className="flex items-center justify-between cursor-pointer focus:outline-none"
              onClick={() => setExpanded(isExpanded ? null : session.id)}
              onKeyDown={(e) => e.key === 'Enter' && setExpanded(isExpanded ? null : session.id)}
              tabIndex={0}
              role="button"
              aria-expanded={isExpanded}
              aria-controls={`session-${session.id}-content`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <MessageSquare size={14} className="text-purple-soft shrink-0" aria-hidden="true" />
                <span className="text-gray-900 dark:text-cream text-sm truncate">
                  {session.title || 'Conversación'}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <time
                  dateTime={session.created_at}
                  className="text-gray-400 dark:text-white/30 text-xs"
                >
                  {new Date(session.created_at).toLocaleDateString('es-MX')}
                </time>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(session.id) }}
                  disabled={deleteMutation.isPending}
                  className="p-1 text-gray-300 dark:text-white/20 hover:text-red-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded"
                  aria-label={`Eliminar conversación: ${session.title || 'Sin título'}`}
                >
                  <Trash2 size={13} aria-hidden="true" />
                </button>
                {isExpanded
                  ? <ChevronUp size={14} className="text-gray-400 dark:text-white/30" aria-hidden="true" />
                  : <ChevronDown size={14} className="text-gray-400 dark:text-white/30" aria-hidden="true" />}
              </div>
            </div>

            {isExpanded && (
              <div
                id={`session-${session.id}-content`}
                className="mt-3 border-t border-gray-100 dark:border-white/8 pt-3 space-y-2 max-h-48 overflow-y-auto"
              >
                {session.messages?.slice(0, 4).map((msg, i) => (
                  <div key={i} className={`text-xs ${msg.role === 'user' ? 'text-gray-600 dark:text-white/60' : 'text-gray-400 dark:text-white/40'}`}>
                    <span className="font-medium">{msg.role === 'user' ? 'Tú' : 'SafeGuide'}:</span>{' '}
                    {msg.content?.slice(0, 100)}{msg.content?.length > 100 && '...'}
                  </div>
                ))}
                <button
                  onClick={() => navigate('/chat')}
                  className="text-xs text-purple-soft hover:text-purple-dark transition-colors mt-1 focus:outline-none focus:underline"
                >
                  Continuar esta conversación →
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
