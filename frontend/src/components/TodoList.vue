<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Todos</h2>
      <div class="flex gap-2 flex-wrap">
        <!-- Filter Buttons -->
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
            All ({{ todos.length }})
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
            Pending ({{ pendingTodos.length }})
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
            Completed ({{ completedTodos.length }})
          </button>
        </div>

        <!-- Sort Controls -->
        <div class="flex gap-2 items-center">
          <span class="text-sm text-gray-600 font-medium">Sort:</span>
          <button
            @click="sortType = 'a-z'"
            :class="[
              'px-3 py-2 rounded text-sm font-medium transition',
              sortType === 'a-z'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]"
            title="Sort A-Z"
          >
            A-Z
          </button>
          <button
            @click="sortType = 'date-desc'"
            :class="[
              'px-3 py-2 rounded text-sm font-medium transition',
              sortType === 'date-desc'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]"
            title="Sort by date (newest first)"
          >
            Newest
          </button>
          <button
            @click="sortType = 'date-asc'"
            :class="[
              'px-3 py-2 rounded text-sm font-medium transition',
              sortType === 'date-asc'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]"
            title="Sort by date (oldest first)"
          >
            Oldest
          </button>
          <!-- Sort Dropdown for additional options -->
          <div class="relative">
            <button
              @click="showSortMenu = !showSortMenu"
              :class="[
                'px-3 py-2 rounded text-sm font-medium transition',
                'bg-gray-200 text-gray-700 hover:bg-gray-300',
              ]"
              title="More sort options"
            >
              ⋮
            </button>
            <div
              v-if="showSortMenu"
              class="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg z-10"
            >
              <button
                @click="selectSort('a-z')"
                :class="[
                  'block w-full text-left px-4 py-2 text-sm hover:bg-gray-100',
                  sortType === 'a-z' ? 'bg-green-100 font-semibold' : '',
                ]"
              >
                A-Z (Ascending)
              </button>
              <button
                @click="selectSort('z-a')"
                :class="[
                  'block w-full text-left px-4 py-2 text-sm hover:bg-gray-100',
                  sortType === 'z-a' ? 'bg-green-100 font-semibold' : '',
                ]"
              >
                Z-A (Descending)
              </button>
              <button
                @click="selectSort('date-asc')"
                :class="[
                  'block w-full text-left px-4 py-2 text-sm hover:bg-gray-100',
                  sortType === 'date-asc' ? 'bg-green-100 font-semibold' : '',
                ]"
              >
                Date (Oldest First)
              </button>
              <button
                @click="selectSort('date-desc')"
                :class="[
                  'block w-full text-left px-4 py-2 text-sm hover:bg-gray-100',
                  sortType === 'date-desc' ? 'bg-green-100 font-semibold' : '',
                ]"
              >
                Date (Newest First)
              </button>
              <button
                @click="selectSort('newest')"
                :class="[
                  'block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 border-t',
                  sortType === 'newest' ? 'bg-green-100 font-semibold' : '',
                ]"
              >
                Insertion Order (Newest)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin">⏳</div>
      <p class="text-gray-500 mt-2">Loading todos...</p>
    </div>

    <div v-else-if="sortedAndFilteredTodos.length === 0" class="text-center py-8">
      <p class="text-gray-500 text-lg">
        {{ filterType === 'all' ? 'No todos yet. Create one to get started!' : `No ${filterType} todos.` }}
      </p>
    </div>

    <div v-else class="space-y-2">
      <TodoItem
        v-for="todo in sortedAndFilteredTodos"
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
const sortType = ref('date-desc')
const showSortMenu = ref(false)

const todos = computed(() => todoStore.todos)
const loading = computed(() => todoStore.loading)
const completedTodos = computed(() => todoStore.completedTodos)
const pendingTodos = computed(() => todoStore.pendingTodos)

// Helper function to sort todos
const sortTodos = (todosToSort, sortTypeValue) => {
  const sorted = [...todosToSort] // Create copy to avoid mutation

  switch (sortTypeValue) {
    case 'a-z':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case 'z-a':
      return sorted.sort((a, b) => b.title.localeCompare(a.title))
    case 'date-asc':
      return sorted.sort((a, b) => {
        if (!a.date && !b.date) return 0
        if (!a.date) return 1
        if (!b.date) return -1
        return new Date(a.date) - new Date(b.date)
      })
    case 'date-desc':
      return sorted.sort((a, b) => {
        if (!a.date && !b.date) return 0
        if (!a.date) return -1
        if (!b.date) return 1
        return new Date(b.date) - new Date(a.date)
      })
    case 'newest':
    default:
      return sorted.reverse() // Reverse insertion order (newest first)
  }
}

// Apply filter first, then sort
const sortedAndFilteredTodos = computed(() => {
  let filtered = todos.value

  // Apply filter
  if (filterType.value === 'completed') {
    filtered = completedTodos.value
  } else if (filterType.value === 'pending') {
    filtered = pendingTodos.value
  }

  // Apply sort
  return sortTodos(filtered, sortType.value)
})

const emit = defineEmits(['edit'])

const editTodo = (todo) => {
  emit('edit', todo)
}

const selectSort = (newSortType) => {
  sortType.value = newSortType
  showSortMenu.value = false
}
</script>
