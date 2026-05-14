import client from './client'

export const resourcesApi = {
  getAll: async (params = {}) => {
    const { data } = await client.get('/resources', { params })
    return data
  },
}
