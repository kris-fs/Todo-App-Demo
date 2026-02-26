import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { todoAPI } from '../services/api'
import { getDateRangeForPreset } from '../composables/useDatePresets'

export const useTodoStore = defineStore('todo', () => {
  const todos = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Date filter state
  const dateFilter = ref({
    preset: 'all', // 'all' | 'today' | 'this_week' | 'this_month' | 'custom'
    startDate: '', // YYYY-MM-DD or empty
    endDate: '', // YYYY-MM-DD or empty
    sortOrder: 'default', // 'default' | 'date_asc' | 'date_desc'
    completionFilter: 'all', // 'all' | 'pending' | 'completed'
    panelOpen: false, // whether the filter panel is expanded
  })

  // Computed: Build API query params from filter state
  const apiParams = computed(() => {
    const params = {}

    // Completion filter
    if (dateFilter.value.completionFilter === 'completed') {
      params.completed = true
    } else if (dateFilter.value.completionFilter === 'pending') {
      params.completed = false
    }

    // Date range filter
    const dateRange = getDateRangeForPreset(
      dateFilter.value.preset,
      dateFilter.value.startDate,
      dateFilter.value.endDate
    )

    if (dateRange.startDate) {
      params.date_after = dateRange.startDate
    }
    if (dateRange.endDate) {
      params.date_before = dateRange.endDate
    }

    // Sort order
    if (dateFilter.value.sortOrder === 'date_asc') {
      params.ordering = 'date'
    } else if (dateFilter.value.sortOrder === 'date_desc') {
      params.ordering = '-date'
    }

    return params
  })

  // Getters
  const completedTodos = computed(() => todos.value.filter(t => t.completed))
  const pendingTodos = computed(() => todos.value.filter(t => !t.completed))

  // Split todos into scheduled and unscheduled
  const scheduledTodos = computed(() => todos.value.filter(t => t.date !== null))
  const unscheduledTodos = computed(() => todos.value.filter(t => t.date === null))

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

  // Check if any filters are active
  const hasActiveFilter = computed(() => {
    return (
      dateFilter.value.preset !== 'all' ||
      dateFilter.value.completionFilter !== 'all' ||
      dateFilter.value.sortOrder !== 'default'
    )
  })

  // Watch for filter changes and re-fetch
  watch(apiParams, () => {
    fetchTodos()
  }, { deep: true })

  // Actions
  async function fetchTodos(params = {}) {
    loading.value = true
    error.value = null
    try {
      // Merge provided params with computed apiParams
      const mergedParams = { ...apiParams.value, ...params }
      const response = await todoAPI.getTodos(mergedParams)
      todos.value = response.data.results || response.data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching todos:', err)
    } finally {
      loading.value = false
    }
  }

  // Reset all filters to defaults
  function resetFilters() {
    dateFilter.value = {
      preset: 'all',
      startDate: '',
      endDate: '',
      sortOrder: 'default',
      completionFilter: 'all',
      panelOpen: false,
    }
  }

  // Toggle filter panel visibility
  function toggleFilterPanel() {
    dateFilter.value.panelOpen = !dateFilter.value.panelOpen
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
    // State
    todos,
    loading,
    error,
    dateFilter,
    // Computed
    completedTodos,
    pendingTodos,
    scheduledTodos,
    unscheduledTodos,
    todosByDate,
    apiParams,
    hasActiveFilter,
    // Actions
    fetchTodos,
    fetchTodosByDate,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleCompleted,
    resetFilters,
    toggleFilterPanel,
  }
})
