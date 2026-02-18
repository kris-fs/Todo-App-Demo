import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { todoAPI } from '../services/api'

export const useTodoStore = defineStore('todo', () => {
  const todos = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const completedTodos = computed(() => todos.value.filter(t => t.completed))
  const pendingTodos = computed(() => todos.value.filter(t => !t.completed))
  const todosByDate = computed(() => {
    const grouped = {}
    todos.value.forEach(todo => {
      if (todo.date) {
        if (!grouped[todo.date]) {
          grouped[todo.date] = []
        }
        grouped[todo.date].push(todo)
      }
    })
    return grouped
  })

  // Actions
  async function fetchTodos(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await todoAPI.getTodos(params)
      todos.value = response.data.results || response.data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching todos:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchTodosByDate(date) {
    loading.value = true
    error.value = null
    try {
      const response = await todoAPI.getTodosByDate(date)
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching todos by date:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  async function createTodo(data) {
    loading.value = true
    error.value = null
    try {
      const response = await todoAPI.createTodo(data)
      todos.value.unshift(response.data)
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error creating todo:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateTodo(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await todoAPI.updateTodo(id, data)
      const index = todos.value.findIndex(t => t.id === id)
      if (index !== -1) {
        todos.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error updating todo:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteTodo(id) {
    loading.value = true
    error.value = null
    try {
      await todoAPI.deleteTodo(id)
      todos.value = todos.value.filter(t => t.id !== id)
    } catch (err) {
      error.value = err.message
      console.error('Error deleting todo:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function toggleCompleted(id) {
    loading.value = true
    error.value = null
    try {
      const response = await todoAPI.toggleCompleted(id)
      const index = todos.value.findIndex(t => t.id === id)
      if (index !== -1) {
        todos.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Error toggling todo:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    todos,
    loading,
    error,
    completedTodos,
    pendingTodos,
    todosByDate,
    fetchTodos,
    fetchTodosByDate,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleCompleted,
  }
})
