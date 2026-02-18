<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Calendar View</h2>
      <div class="flex gap-2">
        <button
          @click="previousMonth"
          class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded font-medium transition"
        >
          ← Previous
        </button>
        <span class="px-4 py-2 font-semibold text-lg">
          {{ monthYear }}
        </span>
        <button
          @click="nextMonth"
          class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded font-medium transition"
        >
          Next →
        </button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="mb-6">
      <!-- Day headers -->
      <div class="grid grid-cols-7 gap-2 mb-2">
        <div
          v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
          :key="day"
          class="text-center font-bold text-gray-600 py-2"
        >
          {{ day }}
        </div>
      </div>

      <!-- Calendar days -->
      <div class="grid grid-cols-7 gap-2">
        <button
          v-for="day in calendarDays"
          :key="day.date"
          @click="selectDate(day.date)"
          :class="[
            'p-3 rounded-lg border-2 transition min-h-20 flex flex-col items-start justify-start',
            day.isCurrentMonth
              ? 'bg-white border-gray-300 hover:border-blue-500 cursor-pointer'
              : 'bg-gray-100 border-gray-200 text-gray-400',
            selectedDate === day.date ? 'border-blue-500 bg-blue-50' : '',
            day.hasTodos ? 'border-green-500' : '',
          ]"
        >
          <span class="font-semibold text-sm">{{ day.dayOfMonth }}</span>
          <div v-if="day.hasTodos" class="mt-1 text-xs">
            <span class="inline-block bg-green-200 text-green-800 px-2 py-1 rounded">
              {{ day.todoCount }} todo{{ day.todoCount > 1 ? 's' : '' }}
            </span>
          </div>
        </button>
      </div>
    </div>

    <!-- Selected Date Todos -->
    <div v-if="selectedDate" class="border-t pt-6">
      <h3 class="text-xl font-bold mb-4">
        Todos for {{ formatDate(selectedDate) }}
      </h3>

      <div v-if="selectedDateTodos.length === 0" class="text-center py-4">
        <p class="text-gray-500">No todos for this date</p>
      </div>

      <div v-else class="space-y-2">
        <TodoItem
          v-for="todo in selectedDateTodos"
          :key="todo.id"
          :todo="todo"
          @edit="editTodo"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTodoStore } from '../stores/todoStore'
import TodoItem from './TodoItem.vue'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, getDaysInMonth } from 'date-fns'

const todoStore = useTodoStore()

const currentDate = ref(new Date())
const selectedDate = ref(null)

const emit = defineEmits(['edit'])

const monthYear = computed(() => {
  return format(currentDate.value, 'MMMM yyyy')
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const daysInMonth = getDaysInMonth(firstDay)
  const startingDayOfWeek = getDay(firstDay)

  const days = []

  // Add previous month's days
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i)
    days.push({
      date: format(date, 'yyyy-MM-dd'),
      dayOfMonth: date.getDate(),
      isCurrentMonth: false,
      hasTodos: false,
      todoCount: 0,
    })
  }

  // Add current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    const dateStr = format(date, 'yyyy-MM-dd')
    const todosForDate = todoStore.todosByDate[dateStr] || []

    days.push({
      date: dateStr,
      dayOfMonth: i,
      isCurrentMonth: true,
      hasTodos: todosForDate.length > 0,
      todoCount: todosForDate.length,
    })
  }

  // Add next month's days
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      date: format(date, 'yyyy-MM-dd'),
      dayOfMonth: date.getDate(),
      isCurrentMonth: false,
      hasTodos: false,
      todoCount: 0,
    })
  }

  return days
})

const selectedDateTodos = computed(() => {
  if (!selectedDate.value) return []
  return todoStore.todosByDate[selectedDate.value] || []
})

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1)
}

const selectDate = (date) => {
  selectedDate.value = selectedDate.value === date ? null : date
}

const formatDate = (dateString) => {
  return format(new Date(dateString), 'EEEE, MMMM dd, yyyy')
}

const editTodo = (todo) => {
  emit('edit', todo)
}
</script>
