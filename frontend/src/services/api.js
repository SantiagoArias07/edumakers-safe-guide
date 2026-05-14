import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('safeguide_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  updateMe: (data) => api.put('/auth/me', data),
}

// Chat
export const chatApi = {
  sendMessage: (message, history) => api.post('/chat/message', { message, history }),
  getSessions: () => api.get('/chat/sessions'),
  saveSession: (data) => api.post('/chat/sessions', data),
  updateSession: (id, data) => api.put(`/chat/sessions/${id}`, data),
  deleteSession: (id) => api.delete(`/chat/sessions/${id}`),
  deleteAllSessions: () => api.delete('/chat/sessions'),
}

// Resources
export const resourcesApi = {
  getAll: (params) => api.get('/resources', { params }),
}

export default api
