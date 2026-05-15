import { Plus, MessageSquare, Trash2, LogIn, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { chatApi } from '../../api/chat'
import { queryKeys } from '../../api/keys'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

function groupSessions(sessions) {
  const today     = new Date(); today.setHours(0,0,0,0)
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)
  const weekAgo   = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7)
  const g = { today: [], yesterday: [], week: [], older: [] }
  sessions.forEach(s => {
    const d = new Date(s.updated_at || s.created_at)
    if (d >= today)          g.today.push(s)
    else if (d >= yesterday) g.yesterday.push(s)
    else if (d >= weekAgo)   g.week.push(s)
    else                     g.older.push(s)
  })
  return g
}

const GROUP_LABELS = { today: 'Hoy', yesterday: 'Ayer', week: 'Esta semana', older: 'Anteriores' }

function SidebarSkeleton({ isDark }) {
  const bg1 = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'
  const bg2 = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
  return (
    <div className="px-2 py-3 space-y-1.5" aria-hidden="true">
      {[80, 65, 90, 50].map((w, i) => (
        <div key={i} className="px-3 py-2.5 flex gap-2 items-center">
          <div className="w-3 h-3 rounded flex-shrink-0 animate-pulse" style={{ background: bg1 }} />
          <div className="h-2.5 rounded animate-pulse" style={{ width: `${w}%`, background: bg2 }} />
        </div>
      ))}
    </div>
  )
}

function SessionItem({ session, isActive, onLoad, onDelete, isPending, isDark }) {
  const activeBg = 'rgba(124,92,191,0.12)'
  const hoverBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'
  const activeText = isDark ? 'rgba(255,255,255,0.9)' : '#1f2937'
  const normalText = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)'
  const hoverText = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'

  return (
    <motion.div layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.2 }} role="listitem">
      <div
        onClick={() => onLoad(session)}
        onKeyDown={e => e.key === 'Enter' && onLoad(session)}
        tabIndex={0}
        className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-soft/50"
        style={{
          background: isActive ? activeBg : 'transparent',
          borderLeft: isActive ? '2px solid rgba(124,92,191,0.6)' : '2px solid transparent',
        }}
        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = hoverBg }}
        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
        role="button"
        aria-label={`Conversación: ${session.title || 'Sin título'}`}
        aria-pressed={isActive}
      >
        <MessageSquare size={13} style={{ color: isActive ? '#9B7FD4' : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }} className="flex-shrink-0" aria-hidden="true" />
        <span className="text-xs truncate flex-1 leading-snug transition-colors" style={{ color: isActive ? activeText : normalText }}
          onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = hoverText }}
          onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = normalText }}
        >
          {session.title || 'Conversación'}
        </span>
        <button
          onClick={e => { e.stopPropagation(); onDelete(session.id) }}
          disabled={isPending}
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded-lg text-red-400/60 hover:text-red-500 transition-all duration-150"
          aria-label={`Eliminar: ${session.title || 'esta conversación'}`}
        >
          <Trash2 size={11} aria-hidden="true" />
        </button>
      </div>
    </motion.div>
  )
}

export default function ChatSidebar({ onNewChat, onLoadSession, currentSessionId }) {
  const { user } = useAuth()
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const sideBg = isDark ? '#0C0C17' : '#FAFAFA'
  const sideBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
  const newBtnBg = isDark ? 'rgba(124,92,191,0.12)' : 'rgba(124,92,191,0.08)'
  const newBtnBorder = isDark ? 'rgba(124,92,191,0.2)' : 'rgba(124,92,191,0.2)'
  const newBtnColor = isDark ? 'rgba(255,255,255,0.75)' : '#1f2937'
  const labelColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)'
  const emptyColor = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.35)'
  const footerBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
  const footerCardBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'
  const avatarBg = isDark ? 'rgba(124,92,191,0.2)' : 'rgba(124,92,191,0.12)'
  const nameColor = isDark ? 'rgba(255,255,255,0.75)' : '#374151'
  const subColor = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)'
  const anonColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)'

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: queryKeys.chat.sessions(),
    queryFn: chatApi.getSessions,
    enabled: !!user,
  })

  const deleteMutation = useMutation({
    mutationFn: chatApi.deleteSession,
    onSuccess: (_, id) => {
      queryClient.setQueryData(queryKeys.chat.sessions(), (prev = []) => prev.filter(s => s.id !== id))
    },
  })

  const grouped = groupSessions(sessions)

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: sideBg, borderRight: `1px solid ${sideBorder}` }}>
      {/* New conversation */}
      <div className="p-3 flex-shrink-0">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 focus-visible:ring-2 focus-visible:ring-purple-soft/50"
          style={{ background: newBtnBg, border: `1px solid ${newBtnBorder}`, color: newBtnColor }}
          onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(124,92,191,0.18)' : 'rgba(124,92,191,0.14)'}
          onMouseLeave={e => e.currentTarget.style.background = newBtnBg}
          aria-label="Nueva conversación"
        >
          <Plus size={15} aria-hidden="true" />
          Nueva conversación
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1" role="list" aria-label="Conversaciones" style={{ scrollbarWidth: 'thin' }}>
        {!user && (
          <div className="px-3 py-8 text-center">
            <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: footerCardBg }}>
              <User size={18} style={{ color: emptyColor }} aria-hidden="true" />
            </div>
            <p className="text-xs mb-3 leading-relaxed" style={{ color: emptyColor }}>
              Inicia sesión para guardar tu historial
            </p>
            <button onClick={() => navigate('/perfil')} className="text-xs text-purple-soft hover:text-purple-dark transition-colors flex items-center gap-1.5 mx-auto focus:outline-none focus-visible:underline">
              <LogIn size={12} aria-hidden="true" />
              Iniciar sesión
            </button>
          </div>
        )}
        {user && isLoading && <SidebarSkeleton isDark={isDark} />}
        {user && !isLoading && sessions.length === 0 && (
          <div className="px-3 py-8 text-center">
            <p className="text-xs leading-relaxed" style={{ color: emptyColor }}>
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
                  <p className="px-3 pt-3 pb-1.5 text-2xs font-semibold uppercase tracking-widest" style={{ color: labelColor }}>
                    {GROUP_LABELS[key]}
                  </p>
                  {group.map(session => (
                    <SessionItem
                      key={session.id}
                      session={session}
                      isActive={session.id === currentSessionId}
                      onLoad={onLoadSession}
                      onDelete={id => deleteMutation.mutate(id)}
                      isPending={deleteMutation.isPending}
                      isDark={isDark}
                    />
                  ))}
                </div>
              )
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-3" style={{ borderTop: `1px solid ${footerBorder}` }}>
        {user ? (
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{ background: footerCardBg }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-purple-soft flex-shrink-0" style={{ background: avatarBg }} aria-hidden="true">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: nameColor }}>{user.name}</p>
              <p className="text-2xs truncate" style={{ color: subColor }}>{user.city || 'Sin ciudad'}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2" style={{ color: anonColor }}>
            <User size={13} aria-hidden="true" />
            <span className="text-xs">Modo anónimo</span>
          </div>
        )}
      </div>
    </div>
  )
}
