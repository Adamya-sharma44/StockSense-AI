import api from '../api/axios'

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('stocksense_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me')
}

export const inventoryApi = {
  list: () => api.get('/inventory'),
  create: (data) => api.post('/inventory', data),
  update: (id, data) => api.put(`/inventory/${id}`, data),
  remove: (id) => api.delete(`/inventory/${id}`),
  lowStock: () => api.get('/inventory/low-stock/list')
}

export const analyticsApi = {
  overview: () => api.get('/analytics/overview')
}

export const aiApi = {
  recommendations: (payload) => api.post('/ai/recommendations', payload || {})
}

export default api

