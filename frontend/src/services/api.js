import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const todoAPI = {
  // Get all todos
  getTodos(params = {}) {
    return api.get('/todos/', { params })
  },

  // Get todos by date
  getTodosByDate(date) {
    return api.get('/todos/by_date/', { params: { date } })
  },

  // Get single todo
  getTodo(id) {
    return api.get(`/todos/${id}/`)
  },

  // Create todo
  createTodo(data) {
    return api.post('/todos/', data)
  },

  // Update todo
  updateTodo(id, data) {
    return api.patch(`/todos/${id}/`, data)
  },

  // Delete todo
  deleteTodo(id) {
    return api.delete(`/todos/${id}/`)
  },

  // Toggle completed status
  toggleCompleted(id) {
    return api.post(`/todos/${id}/toggle_completed/`)
  },
}

export default api
