import axios from 'axios'

// Helper to sanitize and normalize the base API URL
const getBaseURL = () => {
  let url = import.meta.env.VITE_API_URL || 'https://expense-tracker-iyz2.onrender.com/api'
  if (typeof url === 'string') {
    url = url.trim()
    // Strip accidental leading '=' or quotes often pasted into deployment dashboards
    url = url.replace(/^[="'\s]+/, '').replace(/["'\s]+$/, '')
    // Strip trailing slash
    url = url.replace(/\/+$/, '')
  }
  return url || 'https://expense-tracker-iyz2.onrender.com/api'
}

const baseURL = getBaseURL()

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach Bearer token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // Only redirect to login if not already on auth pages
      const pathname = window.location.pathname
      if (!pathname.includes('/login') && !pathname.includes('/register')) {
        window.location.href = '/login'
      }
    }

    // Extract error message
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong'

    return Promise.reject(new Error(message))
  }
)

export default api
