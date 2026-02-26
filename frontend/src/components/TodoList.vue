<template>
  <div class="bg-white rounded-lg shadow p-6">
    <!-- Header with Title -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Todos</h2>
    </div>

    <!-- Filter by Status -->
    <div class="mb-6">
      <h3 class="text-sm font-semibold text-gray-700 mb-3">Filter by Status</h3>
      <div class="flex gap-2">
        <button
          @click="filterType = 'all'"
          :class="[
            'px-4 py-2 rounded font-medium transition',
            filterType === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          All ({{ dateFilteredTodos.length }})
        </button>
        <button
          @click="filterType = 'pending'"
          :class="[
            'px-4 py-2 rounded font-medium transition',
            filterType === 'pending'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          Pending ({{ dateFilteredPendingTodos.length }})
        </button>
        <button
          @click="filterType = 'completed'"
          :class="[
            'px-4 py-2 rounded font-medium transition',
            filterType === 'completed'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          Completed ({{ dateFilteredCompletedTodos.length }})
        </button>
      </div>
    </div>

    <!-- Filter by Date and Sort Controls -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Filter by Date -->
      <div>
        <label for="filter-date" class="block text-sm font-semibold text-gray-700 mb-2">
          Filter by Date
        </label>
        <div class="flex gap-2">
          <input
            id="filter-date"
            v-model="filterDate"
            type="date"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            @click="clearDateFilter"
            class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition"
          >
            Clear
          </button>
        </div>
      </div>

      <!-- Sort by Date -->
      <div>
        <label for="sort-date" class="block text-sm font-semibold text-gray-700 mb-2">
          Sort by Date
        </label>
        <select
          id="sort-date"
          v-model="sortOrder"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">None</option>
          <option value="asc">Ascending (Oldest First)</option>
          <option value="desc">Descending (Newest First)</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin">⏳</div>
      <p class="text-gray-500 mt-2">Loading todos...</p>
    </div>

    <div v-else-if="filteredTodos.length === 0" class="text-center py-8">
      <p class="text-gray-500 text-lg">
        {{ filterType === 'all' ? 'No todos yet. Create one to get started!' : `No ${filterType} todos.` }}
      </p>
    </div>

    <div v-else class="space-y-2">
      <TodoItem
        v-for="todo in filteredTodos"
        :key="todo.id"
        :todo="todo"
        @edit="editTodo"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTodoStore } from '../stores/todoStore'
import TodoItem from './TodoItem.vue'

const todoStore = useTodoStore()

const filterType = ref('all')
const filterDate = ref('')
const sortOrder = ref('')

const todos = computed(() => todoStore.todos)
const loading = computed(() => todoStore.loading)
const completedTodos = computed(() => todoStore.completedTodos)
const pendingTodos = computed(() => todoStore.pendingTodos)

// Apply date filter first (for count calculations)
// Use effective_date which falls back to created_at date if date is NULL
const dateFilteredTodos = computed(() => {
  if (!filterDate.value) {
    return todos.value
  }
  return todos.value.filter(todo => todo.effective_date === filterDate.value)
})

// Calculate counts based on date-filtered todos
const dateFilteredCompletedTodos = computed(() =>
  dateFilteredTodos.value.filter(t => t.completed)
)

const dateFilteredPendingTodos = computed(() =>
  dateFilteredTodos.value.filter(t => !t.completed)
)

// Apply status filter
const statusFilteredTodos = computed(() => {
  if (filterType.value === 'completed') {
    return dateFilteredCompletedTodos.value
  } else if (filterType.value === 'pending') {
    return dateFilteredPendingTodos.value
  }
  return dateFilteredTodos.value
})

// Apply sort by date
// Use effective_date which falls back to created_at date if date is NULL
const filteredTodos = computed(() => {
  const items = [...statusFilteredTodos.value]

  if (sortOrder.value === 'asc') {
    // Sort ascending (oldest first) using effective_date
    return items.sort((a, b) => {
      const dateA = new Date(a.effective_date)
      const dateB = new Date(b.effective_date)
      return dateA - dateB
    })
  } else if (sortOrder.value === 'desc') {
    // Sort descending (newest first) using effective_date
    return items.sort((a, b) => {
      const dateA = new Date(a.effective_date)
      const dateB = new Date(b.effective_date)
      return dateB - dateA
    })
  }

  return items
})

const clearDateFilter = () => {
  filterDate.value = ''
}

const emit = defineEmits(['edit'])

const editTodo = (todo) => {
  emit('edit', todo)
}
</script>
