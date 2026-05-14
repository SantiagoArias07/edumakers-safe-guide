import { Plus, MessageSquare, Trash2, LogIn, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { chatApi } from '../../api/chat'
import { queryKeys } from '../../api/keys'
import { SessionSkeleton } from '../ui/Skeleton'
import { EmptyState } from '../ui/EmptyState'
import { useNavigate } from 'react-router-dom'

export default function ChatSidebar({ onNewChat, onLoadSession }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: queryKeys.chat.sessions(),
    queryFn: chatApi.getSessions,
    enabled: !!user,
  })

  const deleteMutation = useMutation({
    mutationFn: chatApi.deleteSession,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(queryKeys.chat.sessions(), (prev = []) =>
        prev.filter((s) => s.id !== deletedId)
      )
    },
  })

  const handleDelete = (e, id) => {
    e.stopPropagation()
    deleteMutation.mutate(id)
  }

  return (
    <aside
      className="w-64 border-r border-gray-200 dark:border-white/8 flex flex-col bg-gray-50 dark:bg-bg-dark/50 h-full"
      aria-label="Conversaciones guardadas"
    >
      <div className="p-4 border-b border-gray-200 dark:border-white/8">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 btn-secondary text-sm justify-center"
          aria-label="Iniciar nueva conversación"
        >
          <Plus size={15} aria-hidden="true" />
          Nueva conversación
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1" role="list" aria-label="Historial de conversaciones">
        {!user && (
          <div className="p-4 text-center">
            <p className="text-gray-400 dark:text-white/40 text-xs mb-3">
              Inicia sesión para guardar tu historial
            </p>
            <button
              onClick={() => navigate('/perfil')}
              className="text-xs text-purple-soft hover:text-purple-dark transition-colors flex items-center gap-1 mx-auto focus:outline-none focus:underline"
            >
              <LogIn size={12} aria-hidden="true" />
              Iniciar sesión
            </button>
          </div>
        )}

        {user && isLoading && <SessionSkeleton />}

        {user && !isLoading && sessions.length === 0 && (
          <EmptyState
            icon={MessageSquare}
            description="Aún no tienes conversaciones guardadas"
          />
        )}

        {user &&
          sessions.map((session) => (
            <div
              key={session.id}
              role="listitem"
              onClick={() => onLoadSession(session)}
              onKeyDown={(e) => e.key === 'Enter' && onLoadSession(session)}
              tabIndex={0}
              className="group flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-purple-soft/50"
              aria-label={`Conversación: ${session.title || 'Sin título'}`}
            >
              <MessageSquare size={13} className="text-gray-400 dark:text-white/30 shrink-0" aria-hidden="true" />
              <span className="text-gray-500 dark:text-white/60 text-xs truncate flex-1 group-hover:text-gray-900 dark:group-hover:text-cream transition-colors">
                {session.title || 'Conversación'}
              </span>
              <button
                onClick={(e) => handleDelete(e, session.id)}
                disabled={deleteMutation.isPending}
                className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 dark:text-white/30 hover:text-red-500 transition-all focus:opacity-100 focus:outline-none focus:text-red-500"
                aria-label={`Eliminar conversación: ${session.title || 'Sin título'}`}
              >
                <Trash2 size={12} aria-hidden="true" />
              </button>
            </div>
          ))}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-white/8" aria-label="Información de usuario">
        {user ? (
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full bg-purple-soft/20 dark:bg-purple-soft/30 flex items-center justify-center text-xs font-bold text-purple-soft dark:text-purple-light"
              aria-hidden="true"
            >
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 dark:text-cream text-xs font-medium truncate">{user.name}</p>
              <p className="text-gray-400 dark:text-white/30 text-xs truncate">{user.city || 'Sin ciudad'}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-400 dark:text-white/30">
            <User size={14} aria-hidden="true" />
            <span className="text-xs">Modo anónimo</span>
          </div>
        )}
      </div>
    </aside>
  )
}
