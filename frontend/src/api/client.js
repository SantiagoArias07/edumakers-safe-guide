import axios from 'axios'

// En dev usa el proxy de Vite (/api → localhost:8000)
// En producción usa VITE_API_URL (la URL de Railway)
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('safeguide_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('safeguide_token')
    }
    return Promise.reject(err)
  }
)

export default client
