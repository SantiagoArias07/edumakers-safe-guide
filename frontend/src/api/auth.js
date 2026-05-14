import client from './client'

export const authApi = {
  me: async () => {
    const { data } = await client.get('/auth/me')
    return data
  },

  login: async ({ email, password }) => {
    const { data } = await client.post('/auth/login', { email, password })
    return data
  },

  register: async ({ email, password, name, city }) => {
    const { data } = await client.post('/auth/register', { email, password, name, city })
    return data
  },

  updateMe: async (payload) => {
    const { data } = await client.put('/auth/me', payload)
    return data
  },
}
