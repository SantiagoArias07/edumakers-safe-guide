import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { chatApi } from '../api/chat'
import { queryKeys } from '../api/keys'
import AuthModal from '../components/profile/AuthModal'
import ConversationHistory from '../components/profile/ConversationHistory'
import {
  Sun, Moon, LogOut, Trash2, User, MapPin, Shield, CheckCircle,
  Edit2, Save, X, Phone, UserPlus,
} from 'lucide-react'

export default function Profile() {
  const { user, logout, updateUser } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const queryClient = useQueryClient()

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const [editName, setEditName] = useState('')
  const [editCity, setEditCity] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [autoSave, setAutoSave] = useState(() => localStorage.getItem('safeguide_autosave') === 'true')
  const [fontLarge, setFontLarge] = useState(() => localStorage.getItem('safeguide_fontsize') === 'grande')
  const [contacts, setContacts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('safeguide_contacts') || '[]') }
    catch { return [] }
  })
  const [newContactName, setNewContactName] = useState('')
  const [newContactPhone, setNewContactPhone] = useState('')
  const [addingContact, setAddingContact] = useState(false)

  const deleteAllMutation = useMutation({
    mutationFn: chatApi.deleteAllSessions,
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.chat.sessions(), [])
      setShowDeleteConfirm(false)
      setDeleteSuccess(true)
      setTimeout(() => setDeleteSuccess(false), 3000)
    },
  })

  const handleStartEdit = () => {
    setEditName(user.name)
    setEditCity(user.city || '')
    setEditingProfile(true)
  }

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    try {
      await updateUser({ name: editName, city: editCity })
      setEditingProfile(false)
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 2500)
    } catch (err) {
      console.error(err)
    } finally {
      setSavingProfile(false)
    }
  }

  const toggleAutoSave = () => {
    const next = !autoSave
    setAutoSave(next)
    localStorage.setItem('safeguide_autosave', String(next))
  }

  const toggleFontSize = () => {
    const next = !fontLarge
    setFontLarge(next)
    localStorage.setItem('safeguide_fontsize', next ? 'grande' : 'normal')
    document.documentElement.classList.toggle('text-large', next)
  }

  const handleAddContact = () => {
    if (!newContactName.trim()) return
    const next = [...contacts, { name: newContactName.trim(), phone: newContactPhone.trim() }]
    setContacts(next)
    localStorage.setItem('safeguide_contacts', JSON.stringify(next))
    setNewContactName('')
    setNewContactPhone('')
    setAddingContact(false)
  }

  const handleRemoveContact = (i) => {
    const next = contacts.filter((_, idx) => idx !== i)
    setContacts(next)
    localStorage.setItem('safeguide_contacts', JSON.stringify(next))
  }

  return (
    <div className="min-h-screen pt-16 pb-24 md:pb-12 bg-white dark:bg-bg-dark">
      <main id="main-content" className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!user ? (
          <div>
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-purple-soft/10 dark:bg-purple-soft/20 rounded-2xl flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <Shield size={28} className="text-purple-soft" />
              </div>
              <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-cream mb-2">Tu cuenta</h1>
              <p className="text-gray-500 dark:text-white/50 text-sm">
                Inicia sesión para guardar tu historial y personalizar tu experiencia.
              </p>
              <p className="text-gray-400 dark:text-white/30 text-xs mt-2">
                También puedes usar SafeGuide de forma completamente anónima, sin necesidad de cuenta.
              </p>
            </div>
            <AuthModal />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Profile header */}
            <section className="card" aria-labelledby="profile-heading">
              {!editingProfile ? (
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-soft/10 dark:bg-purple-soft/30 flex items-center justify-center text-2xl font-bold text-purple-soft dark:text-purple-light" aria-hidden="true">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h2 id="profile-heading" className="font-display font-bold text-xl text-gray-900 dark:text-cream">{user.name}</h2>
                    <p className="text-gray-500 dark:text-white/50 text-sm">{user.email}</p>
                    {user.city && (
                      <div className="flex items-center gap-1 mt-1 text-gray-400 dark:text-white/30 text-xs">
                        <MapPin size={11} aria-hidden="true" />
                        <span>{user.city}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {profileSaved && (
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs" role="status" aria-live="polite">
                        <CheckCircle size={12} aria-hidden="true" />
                        Guardado
                      </div>
                    )}
                    <button onClick={handleStartEdit} className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-white/30 hover:text-purple-soft transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-soft/50 rounded" aria-label="Editar perfil">
                      <Edit2 size={14} aria-hidden="true" />
                      <span className="hidden sm:inline">Editar</span>
                    </button>
                    <button onClick={logout} className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-white/30 hover:text-red-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded" aria-label="Cerrar sesión">
                      <LogOut size={14} aria-hidden="true" />
                      <span className="hidden sm:inline">Salir</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-cream text-sm">Editar perfil</h3>
                    <button onClick={() => setEditingProfile(false)} aria-label="Cancelar edición" className="text-gray-400 dark:text-white/30 hover:text-gray-700 dark:hover:text-cream transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded">
                      <X size={16} aria-hidden="true" />
                    </button>
                  </div>
                  <div>
                    <label htmlFor="edit-name" className="text-xs text-gray-500 dark:text-white/40 mb-1 block">Nombre</label>
                    <input id="edit-name" type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="input-field text-sm" autoComplete="name" />
                  </div>
                  <div>
                    <label htmlFor="edit-city" className="text-xs text-gray-500 dark:text-white/40 mb-1 block">Ciudad</label>
                    <input id="edit-city" type="text" value={editCity} onChange={(e) => setEditCity(e.target.value)} placeholder="Ej. Ciudad de México" className="input-field text-sm" autoComplete="address-level2" />
                  </div>
                  <button onClick={handleSaveProfile} disabled={savingProfile || !editName.trim()} className="flex items-center gap-2 btn-primary text-sm px-4 py-2 disabled:opacity-60">
                    <Save size={13} aria-hidden="true" />
                    {savingProfile ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              )}
            </section>

            {/* Preferences */}
            <section className="card" aria-labelledby="prefs-heading">
              <h3 id="prefs-heading" className="font-semibold text-gray-900 dark:text-cream mb-5 flex items-center gap-2">
                <User size={16} className="text-purple-soft" aria-hidden="true" />
                Preferencias
              </h3>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 dark:text-cream text-sm">Modo de visualización</p>
                    <p className="text-gray-400 dark:text-white/40 text-xs mt-0.5">{isDark ? 'Tema oscuro activo' : 'Tema claro activo'}</p>
                  </div>
                  <button onClick={toggleTheme} aria-pressed={isDark} className="flex items-center gap-2 btn-secondary text-sm px-4 py-2">
                    {isDark ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />}
                    {isDark ? 'Claro' : 'Oscuro'}
                  </button>
                </div>

                <div className="h-px bg-gray-100 dark:bg-white/8" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 dark:text-cream text-sm">Tamaño de texto</p>
                    <p className="text-gray-400 dark:text-white/40 text-xs mt-0.5">{fontLarge ? 'Texto grande activo' : 'Tamaño normal activo'}</p>
                  </div>
                  <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-white/10" role="group" aria-label="Tamaño de fuente">
                    <button onClick={() => { if (fontLarge) toggleFontSize() }} aria-pressed={!fontLarge} className={`px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-purple-soft/50 ${!fontLarge ? 'bg-purple-soft text-white' : 'text-gray-500 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/5'}`}>Normal</button>
                    <button onClick={() => { if (!fontLarge) toggleFontSize() }} aria-pressed={fontLarge} className={`px-3 py-1.5 text-sm font-medium transition-colors border-l border-gray-200 dark:border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-purple-soft/50 ${fontLarge ? 'bg-purple-soft text-white' : 'text-gray-500 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/5'}`}>Grande</button>
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-white/8" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 dark:text-cream text-sm">Auto-guardar conversaciones</p>
                    <p className="text-gray-400 dark:text-white/40 text-xs mt-0.5">{autoSave ? 'Se guarda al recibir cada respuesta' : 'Solo al presionar "Guardar"'}</p>
                  </div>
                  <button onClick={toggleAutoSave} role="switch" aria-checked={autoSave} aria-label="Auto-guardar conversaciones" className={`relative inline-flex w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-soft/60 focus-visible:ring-offset-2 ${autoSave ? 'bg-purple-soft' : 'bg-gray-200 dark:bg-white/15'}`}>
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${autoSave ? 'translate-x-5' : 'translate-x-0'}`} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </section>

            {/* Trusted contacts */}
            <section className="card" aria-labelledby="contacts-heading">
              <div className="flex items-center justify-between mb-2">
                <h3 id="contacts-heading" className="font-semibold text-gray-900 dark:text-cream flex items-center gap-2">
                  <Phone size={16} className="text-coral" aria-hidden="true" />
                  Contactos de confianza
                </h3>
                {contacts.length < 3 && !addingContact && (
                  <button onClick={() => setAddingContact(true)} className="flex items-center gap-1 text-xs text-purple-soft hover:text-purple-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-soft/50 rounded">
                    <UserPlus size={12} aria-hidden="true" />
                    Agregar
                  </button>
                )}
              </div>
              <p className="text-gray-400 dark:text-white/40 text-xs mb-4">
                Guarda personas de confianza para contactar en una emergencia. Solo tú puedes ver esta información.
              </p>

              {contacts.length === 0 && !addingContact && (
                <p className="text-gray-400 dark:text-white/30 text-xs text-center py-2">Aún no tienes contactos guardados</p>
              )}

              <ul className="space-y-2">
                {contacts.map((c, i) => (
                  <li key={i} className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 rounded-xl px-4 py-3">
                    <div className="w-7 h-7 rounded-full bg-coral/10 dark:bg-coral/20 flex items-center justify-center text-xs font-bold text-coral" aria-hidden="true">{c.name[0]?.toUpperCase()}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 dark:text-cream text-sm font-medium truncate">{c.name}</p>
                      {c.phone && <p className="text-gray-400 dark:text-white/40 text-xs">{c.phone}</p>}
                    </div>
                    <button onClick={() => handleRemoveContact(i)} className="text-gray-300 dark:text-white/20 hover:text-red-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded" aria-label={`Eliminar contacto ${c.name}`}>
                      <X size={14} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>

              {addingContact && (
                <div className="mt-3 space-y-2 border-t border-gray-100 dark:border-white/8 pt-3">
                  <label htmlFor="new-contact-name" className="sr-only">Nombre del contacto</label>
                  <input id="new-contact-name" type="text" value={newContactName} onChange={(e) => setNewContactName(e.target.value)} placeholder="Nombre del contacto" className="input-field text-sm" autoComplete="off" />
                  <label htmlFor="new-contact-phone" className="sr-only">Teléfono del contacto</label>
                  <input id="new-contact-phone" type="tel" value={newContactPhone} onChange={(e) => setNewContactPhone(e.target.value)} placeholder="Teléfono (opcional)" className="input-field text-sm" autoComplete="tel" />
                  <div className="flex gap-2">
                    <button onClick={handleAddContact} disabled={!newContactName.trim()} className="flex-1 btn-primary text-xs py-2 disabled:opacity-60">Guardar contacto</button>
                    <button onClick={() => { setAddingContact(false); setNewContactName(''); setNewContactPhone('') }} className="btn-secondary text-xs py-2 px-4">Cancelar</button>
                  </div>
                </div>
              )}
            </section>

            {/* History */}
            <section className="card" aria-labelledby="history-heading">
              <div className="flex items-center justify-between mb-4">
                <h3 id="history-heading" className="font-semibold text-gray-900 dark:text-cream">Historial de conversaciones</h3>
                {deleteSuccess ? (
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs" role="status" aria-live="polite">
                    <CheckCircle size={12} aria-hidden="true" />
                    Historial borrado
                  </div>
                ) : (
                  <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-white/30 hover:text-red-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded">
                    <Trash2 size={12} aria-hidden="true" />
                    Borrar todo
                  </button>
                )}
              </div>

              {showDeleteConfirm && (
                <div role="alertdialog" aria-labelledby="delete-confirm-msg" className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 mb-4">
                  <p id="delete-confirm-msg" className="text-red-600 dark:text-red-400 text-sm font-medium mb-3">
                    ¿Segura que quieres borrar todo tu historial? Esta acción no se puede deshacer.
                  </p>
                  <div className="flex gap-3">
                    <button onClick={() => deleteAllMutation.mutate()} disabled={deleteAllMutation.isPending} className="text-xs bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-60">
                      {deleteAllMutation.isPending ? 'Borrando...' : 'Sí, borrar todo'}
                    </button>
                    <button onClick={() => setShowDeleteConfirm(false)} className="text-xs text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-cream transition-colors">Cancelar</button>
                  </div>
                </div>
              )}

              <ConversationHistory />
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
