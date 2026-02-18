<template>
  <div class="space-y-6">
    <TodoForm />
    <TodoList @edit="editTodo" />

    <!-- Edit Modal -->
    <div
      v-if="editingTodo"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeEditModal"
    >
      <div
        class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4"
        @click.stop
      >
        <h2 class="text-2xl font-bold mb-4">Edit Todo</h2>
        <form @submit.prevent="submitEdit" class="space-y-4">
          <div>
            <label for="edit-title" class="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              id="edit-title"
              v-model="editForm.title"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label for="edit-description" class="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="edit-description"
              v-model="editForm.description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <div>
            <label for="edit-date" class="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              id="edit-date"
              v-model="editForm.date"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div class="flex gap-2">
            <button
              type="submit"
              :disabled="editLoading"
              class="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              {{ editLoading ? 'Saving...' : 'Save' }}
            </button>
            <button
              type="button"
              @click="closeEditModal"
              class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTodoStore } from '../stores/todoStore'
import TodoForm from '../components/TodoForm.vue'
import TodoList from '../components/TodoList.vue'

const todoStore = useTodoStore()

const editingTodo = ref(null)
const editForm = ref({
  title: '',
  description: '',
  date: '',
})
const editLoading = ref(false)

const editTodo = (todo) => {
  editingTodo.value = todo
  editForm.value = {
    title: todo.title,
    description: todo.description || '',
    date: todo.date || '',
  }
}

const closeEditModal = () => {
  editingTodo.value = null
  editForm.value = {
    title: '',
    description: '',
    date: '',
  }
}

const submitEdit = async () => {
  editLoading.value = true
  try {
    await todoStore.updateTodo(editingTodo.value.id, {
      title: editForm.value.title.trim(),
      description: editForm.value.description.trim(),
      date: editForm.value.date || null,
    })
    closeEditModal()
  } catch (err) {
    alert('Failed to update todo. Please try again.')
  } finally {
    editLoading.value = false
  }
}
</script>
