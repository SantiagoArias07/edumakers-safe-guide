import { Plus, MessageSquare, Trash2, LogIn, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { chatApi } from '../../api/chat'
import { queryKeys } from '../../api/keys'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

/* ── Group sessions by recency ─────────────────────────────── */
function groupSessions(sessions) {
  const now = Date.now()
  const DAY = 86400000
  const today     = new Date(); today.setHours(0,0,0,0)
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)
  const weekAgo   = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7)

  const g = { today: [], yesterday: [], week: [], older: [] }
  sessions.forEach(s => {
    const d = new Date(s.updated_at || s.created_at)
    if (d >= today)         g.today.push(s)
    else if (d >= yesterday) g.yesterday.push(s)
    else if (d >= weekAgo)  g.week.push(s)
    else                    g.older.push(s)
  })
  return g
}

const GROUP_LABELS = {
  today:     'Hoy',
  yesterday: 'Ayer',
  week:      'Esta semana',
  older:     'Anteriores',
}

/* ── Skeleton while loading ────────────────────────────────── */
function SidebarSkeleton() {
  return (
    <div className="px-2 py-3 space-y-1.5" aria-hidden="true">
      {[80, 65, 90, 50].map((w, i) => (
        <div key={i} className="px-3 py-2.5 flex gap-2 items-center">
          <div className="w-3 h-3 rounded flex-shrink-0 animate-pulse" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="h-2.5 rounded animate-pulse" style={{ width: `${w}%`, background: 'rgba(255,255,255,0.06)' }} />
        </div>
      ))}
    </div>
  )
}

/* ── Session item ──────────────────────────────────────────── */
function SessionItem({ session, isActive, onLoad, onDelete, isPending }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.2 }}
      role="listitem"
    >
      <div
        onClick={() => onLoad(session)}
        onKeyDown={(e) => e.key === 'Enter' && onLoad(session)}
        tabIndex={0}
        className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-soft/50 relative"
        style={{
          background: isActive
            ? 'rgba(124,92,191,0.12)'
            : 'transparent',
          borderLeft: isActive ? '2px solid rgba(124,92,191,0.6)' : '2px solid transparent',
        }}
        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
        role="button"
        aria-label={`Cargar conversación: ${session.title || 'Sin título'}`}
        aria-pressed={isActive}
      >
        <MessageSquare
          size={13}
          className={isActive ? 'text-purple-light flex-shrink-0' : 'text-white/25 flex-shrink-0'}
          aria-hidden="true"
        />
        <span
          className={`text-xs truncate flex-1 leading-snug ${isActive ? 'text-white/90 font-medium' : 'text-white/45 group-hover:text-white/70'} transition-colors`}
        >
          {session.title || 'Conversación'}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(session.id) }}
          disabled={isPending}
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded-lg text-white/20 hover:text-red-400 transition-all duration-150"
          aria-label={`Eliminar: ${session.title || 'esta conversación'}`}
        >
          <Trash2 size={11} aria-hidden="true" />
        </button>
      </div>
    </motion.div>
  )
}

/* ── Main sidebar ──────────────────────────────────────────── */
export default function ChatSidebar({ onNewChat, onLoadSession, currentSessionId }) {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const queryClient = useQueryClient()

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: queryKeys.chat.sessions(),
    queryFn: chatApi.getSessions,
    enabled: !!user,
  })

  const deleteMutation = useMutation({
    mutationFn: chatApi.deleteSession,
    onSuccess: (_, id) => {
      queryClient.setQueryData(queryKeys.chat.sessions(), (prev = []) =>
        prev.filter(s => s.id !== id)
      )
    },
  })

  const grouped = groupSessions(sessions)

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: '#0C0C17', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* New conversation */}
      <div className="p-3 flex-shrink-0">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 focus-visible:ring-2 focus-visible:ring-purple-soft/50"
          style={{
            background: 'rgba(124,92,191,0.12)',
            border: '1px solid rgba(124,92,191,0.2)',
            color: 'rgba(255,255,255,0.75)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,92,191,0.18)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(124,92,191,0.12)' }}
          aria-label="Nueva conversación"
        >
          <Plus size={15} aria-hidden="true" />
          Nueva conversación
        </button>
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1" role="list" aria-label="Conversaciones guardadas" style={{ scrollbarWidth: 'thin' }}>
        {!user && (
          <div className="px-3 py-8 text-center">
            <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <User size={18} className="text-white/30" aria-hidden="true" />
            </div>
            <p className="text-white/30 text-xs mb-3 leading-relaxed">
              Inicia sesión para guardar tu historial de conversaciones
            </p>
            <button
              onClick={() => navigate('/perfil')}
              className="text-xs text-purple-light hover:text-purple-soft transition-colors flex items-center gap-1.5 mx-auto focus:outline-none focus-visible:underline"
            >
              <LogIn size={12} aria-hidden="true" />
              Iniciar sesión
            </button>
          </div>
        )}

        {user && isLoading && <SidebarSkeleton />}

        {user && !isLoading && sessions.length === 0 && (
          <div className="px-3 py-8 text-center">
            <p className="text-white/25 text-xs leading-relaxed">
              Aún no tienes conversaciones guardadas
            </p>
          </div>
        )}

        {user && !isLoading && (
          <AnimatePresence>
            {(['today', 'yesterday', 'week', 'older']).map(key => {
              const group = grouped[key]
              if (!group.length) return null
              return (
                <div key={key} className="mb-1">
                  <p className="px-3 pt-3 pb-1.5 text-2xs text-white/20 font-semibold uppercase tracking-widest">
                    {GROUP_LABELS[key]}
                  </p>
                  {group.map(session => (
                    <SessionItem
                      key={session.id}
                      session={session}
                      isActive={session.id === currentSessionId}
                      onLoad={onLoadSession}
                      onDelete={(id) => deleteMutation.mutate(id)}
                      isPending={deleteMutation.isPending}
                    />
                  ))}
                </div>
              )
            })}
          </AnimatePresence>
        )}
      </div>

      {/* User footer */}
      <div
        className="flex-shrink-0 p-3 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        {user ? (
          <div
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-purple-light flex-shrink-0"
              style={{ background: 'rgba(124,92,191,0.2)' }}
              aria-hidden="true"
            >
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/75 text-xs font-medium truncate">{user.name}</p>
              <p className="text-white/30 text-2xs truncate">{user.city || 'Sin ciudad'}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 text-white/20">
            <User size={13} aria-hidden="true" />
            <span className="text-xs">Modo anónimo</span>
          </div>
        )}
      </div>
    </div>
  )
}
