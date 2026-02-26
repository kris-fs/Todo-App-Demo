<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-2xl font-bold mb-4">Todos</h2>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin">⏳</div>
      <p class="text-gray-500 mt-2">Loading todos...</p>
    </div>

    <div v-else-if="displayedTodos.length === 0" class="text-center py-8">
      <p class="text-gray-500 text-lg">
        {{ getEmptyMessage() }}
      </p>
    </div>

    <div v-else class="space-y-2">
      <!-- Scheduled Todos Section -->
      <div v-if="scheduledTodos.length > 0">
        <TodoItem
          v-for="todo in scheduledTodos"
          :key="todo.id"
          :todo="todo"
          @edit="editTodo"
        />
      </div>

      <!-- Separator (only show if both sections have items) -->
      <div v-if="scheduledTodos.length > 0 && unscheduledTodos.length > 0" class="py-3">
        <div class="flex items-center gap-3">
          <div class="flex-1 border-t border-gray-300"></div>
          <span class="text-sm font-medium text-gray-500">📌 Unscheduled Todos</span>
          <div class="flex-1 border-t border-gray-300"></div>
        </div>
      </div>

      <!-- Unscheduled Todos Section -->
      <div v-if="unscheduledTodos.length > 0">
        <div v-if="scheduledTodos.length === 0" class="mb-3">
          <h3 class="text-sm font-medium text-gray-600 mb-2">📌 Unscheduled Todos</h3>
        </div>
        <TodoItem
          v-for="todo in unscheduledTodos"
          :key="todo.id"
          :todo="todo"
          @edit="editTodo"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTodoStore } from '../stores/todoStore'
import TodoItem from './TodoItem.vue'

const todoStore = useTodoStore()

const loading = computed(() => todoStore.loading)
const scheduledTodos = computed(() => todoStore.scheduledTodos)
const unscheduledTodos = computed(() => todoStore.unscheduledTodos)
const completionFilter = computed(() => todoStore.dateFilter.completionFilter)
const preset = computed(() => todoStore.dateFilter.preset)

// Combine both sections for length check
const displayedTodos = computed(() => [
  ...scheduledTodos.value,
  ...unscheduledTodos.value,
])

const emit = defineEmits(['edit'])

const editTodo = (todo) => {
  emit('edit', todo)
}

const getEmptyMessage = () => {
  if (completionFilter.value === 'completed') {
    return 'No completed todos.'
  } else if (completionFilter.value === 'pending') {
    return 'No pending todos.'
  } else if (preset.value !== 'all') {
    return 'No todos match your date filter.'
  }
  return 'No todos yet. Create one to get started!'
}
</script>
