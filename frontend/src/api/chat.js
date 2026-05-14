import client from './client'

export const chatApi = {
  sendMessage: async ({ message, history }) => {
    const { data } = await client.post('/chat/message', { message, history })
    return data
  },

  getSessions: async () => {
    const { data } = await client.get('/chat/sessions')
    return data
  },

  saveSession: async (payload) => {
    const { data } = await client.post('/chat/sessions', payload)
    return data
  },

  updateSession: async ({ id, ...payload }) => {
    const { data } = await client.put(`/chat/sessions/${id}`, payload)
    return data
  },

  deleteSession: async (id) => {
    const { data } = await client.delete(`/chat/sessions/${id}`)
    return data
  },

  deleteAllSessions: async () => {
    const { data } = await client.delete('/chat/sessions')
    return data
  },
}
