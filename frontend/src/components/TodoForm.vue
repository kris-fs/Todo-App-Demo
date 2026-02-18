<template>
  <div class="bg-white rounded-lg shadow p-6 mb-6">
    <h2 class="text-2xl font-bold mb-4">Add New Todo</h2>
    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          placeholder="Enter todo title"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <span v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</span>
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          v-model="form.description"
          placeholder="Enter todo description (optional)"
          rows="3"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        ></textarea>
      </div>

      <div>
        <label for="date" class="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          id="date"
          v-model="form.date"
          type="date"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
      >
        {{ loading ? 'Adding...' : 'Add Todo' }}
      </button>

      <span v-if="errors.submit" class="text-red-500 text-sm block">{{ errors.submit }}</span>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTodoStore } from '../stores/todoStore'

const todoStore = useTodoStore()

const form = ref({
  title: '',
  description: '',
  date: '',
})

const errors = ref({
  title: '',
  submit: '',
})

const loading = ref(false)

const submitForm = async () => {
  errors.value = { title: '', submit: '' }

  if (!form.value.title.trim()) {
    errors.value.title = 'Title is required'
    return
  }

  loading.value = true
  try {
    await todoStore.createTodo({
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      date: form.value.date || null,
    })

    form.value = {
      title: '',
      description: '',
      date: '',
    }
  } catch (err) {
    errors.value.submit = 'Failed to create todo. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
