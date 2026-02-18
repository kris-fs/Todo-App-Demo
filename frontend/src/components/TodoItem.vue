<template>
  <div
    class="bg-white rounded-lg shadow p-4 mb-3 flex items-start gap-4 hover:shadow-md transition"
    :class="{ 'opacity-60': todo.completed }"
  >
    <input
      type="checkbox"
      :checked="todo.completed"
      @change="toggleTodo"
      class="mt-1 w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
    />

    <div class="flex-1 min-w-0">
      <h3
        class="font-semibold text-lg"
        :class="{ 'line-through text-gray-400': todo.completed }"
      >
        {{ todo.title }}
      </h3>

      <p v-if="todo.description" class="text-gray-600 text-sm mt-1">
        {{ todo.description }}
      </p>

      <div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
        <span v-if="todo.date" class="flex items-center gap-1">
          📅 {{ formatDate(todo.date) }}
        </span>
        <span class="flex items-center gap-1">
          🕐 {{ formatTime(todo.created_at) }}
        </span>
      </div>
    </div>

    <div class="flex gap-2">
      <button
        @click="editTodo"
        class="text-blue-500 hover:text-blue-700 font-medium text-sm px-3 py-1 rounded hover:bg-blue-50 transition"
      >
        Edit
      </button>
      <button
        @click="deleteTodo"
        :disabled="deleting"
        class="text-red-500 hover:text-red-700 font-medium text-sm px-3 py-1 rounded hover:bg-red-50 disabled:opacity-50 transition"
      >
        {{ deleting ? 'Deleting...' : 'Delete' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTodoStore } from '../stores/todoStore'
import { format } from 'date-fns'

const props = defineProps({
  todo: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['edit'])

const todoStore = useTodoStore()
const deleting = ref(false)

const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMM dd, yyyy')
}

const formatTime = (dateString) => {
  return format(new Date(dateString), 'MMM dd, yyyy HH:mm')
}

const toggleTodo = async () => {
  try {
    await todoStore.toggleCompleted(props.todo.id)
  } catch (err) {
    console.error('Failed to toggle todo:', err)
  }
}

const editTodo = () => {
  emit('edit', props.todo)
}

const deleteTodo = async () => {
  if (!confirm('Are you sure you want to delete this todo?')) {
    return
  }

  deleting.value = true
  try {
    await todoStore.deleteTodo(props.todo.id)
  } catch (err) {
    console.error('Failed to delete todo:', err)
    alert('Failed to delete todo. Please try again.')
  } finally {
    deleting.value = false
  }
}
</script>
