<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Todos</h2>
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

const todos = computed(() => todoStore.todos)
const loading = computed(() => todoStore.loading)
const completedTodos = computed(() => todoStore.completedTodos)
const pendingTodos = computed(() => todoStore.pendingTodos)

const filteredTodos = computed(() => {
  if (filterType.value === 'completed') {
    return completedTodos.value
  } else if (filterType.value === 'pending') {
    return pendingTodos.value
  }
  return todos.value
})

const emit = defineEmits(['edit'])

const editTodo = (todo) => {
  emit('edit', todo)
}
</script>
