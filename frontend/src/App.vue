<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTodoStore } from './stores/todoStore'

const router = useRouter()
const todoStore = useTodoStore()

onMounted(async () => {
  await todoStore.fetchTodos()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <h1 class="text-3xl font-bold text-gray-900">📝 Todo App</h1>
      </div>
    </header>

    <!-- Navigation -->
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex gap-4">
          <router-link
            to="/"
            class="px-4 py-3 font-medium text-gray-700 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition"
            :class="{ 'border-blue-600 text-blue-600': $route.path === '/' }"
          >
            📋 List View
          </router-link>
          <router-link
            to="/calendar"
            class="px-4 py-3 font-medium text-gray-700 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition"
            :class="{ 'border-blue-600 text-blue-600': $route.path === '/calendar' }"
          >
            📅 Calendar View
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
</style>
