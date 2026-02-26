<template>
  <div class="bg-white rounded-lg shadow p-6 mb-6">
    <!-- Header with toggle and reset -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center gap-2">
        <button
          @click="togglePanel"
          class="flex items-center gap-2 text-lg font-semibold text-gray-700 hover:text-gray-900 transition"
        >
          <span>🗓 Filters</span>
          <span class="text-sm" :class="panelOpen ? 'rotate-180' : ''">▼</span>
        </button>
        <span
          v-if="hasActiveFilter"
          class="ml-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full"
        >
          {{ activeFilterCount }} active
        </span>
      </div>
      <button
        v-if="hasActiveFilter"
        @click="resetAllFilters"
        class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
      >
        Reset
      </button>
    </div>

    <!-- Filter Panel (collapsible) -->
    <div v-if="panelOpen" class="space-y-4 border-t pt-4">
      <!-- Completion Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Completion Status</label>
        <div class="flex gap-2">
          <button
            @click="setCompletionFilter('all')"
            :class="[
              'px-4 py-2 rounded font-medium transition',
              completionFilter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]"
          >
            All
          </button>
          <button
            @click="setCompletionFilter('pending')"
            :class="[
              'px-4 py-2 rounded font-medium transition',
              completionFilter === 'pending'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]"
          >
            Pending
          </button>
          <button
            @click="setCompletionFilter('completed')"
            :class="[
              'px-4 py-2 rounded font-medium transition',
              completionFilter === 'completed'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]"
          >
            Completed
          </button>
        </div>
      </div>

      <!-- Date Preset Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
        <div class="flex flex-wrap gap-2">
          <button
            @click="setPreset('all')"
            :class="[
              'px-4 py-2 rounded font-medium transition',
              preset === 'all'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]"
          >
            All Dates
          </button>
          <button
            @click="setPreset('today')"
            :class="[
              'px-4 py-2 rounded font-medium transition',
              preset === 'today'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]"
          >
            Today
          </button>
          <button
            @click="setPreset('this_week')"
            :class="[
              'px-4 py-2 rounded font-medium transition',
              preset === 'this_week'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]"
          >
            This Week
          </button>
          <button
            @click="setPreset('this_month')"
            :class="[
              'px-4 py-2 rounded font-medium transition',
              preset === 'this_month'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]"
          >
            This Month
          </button>
          <button
            @click="setPreset('custom')"
            :class="[
              'px-4 py-2 rounded font-medium transition',
              preset === 'custom'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]"
          >
            Custom
          </button>
        </div>
      </div>

      <!-- Custom Date Range Inputs -->
      <div v-if="preset === 'custom'" class="bg-gray-50 p-4 rounded-lg space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="start-date" class="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <input
              id="start-date"
              v-model="customStartDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label for="end-date" class="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <input
              id="end-date"
              v-model="customEndDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <button
          @click="applyCustomDates"
          class="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition"
        >
          Apply
        </button>
      </div>

      <!-- Sort Order -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
        <div class="flex gap-2">
          <button
            @click="setSortOrder('default')"
            :class="[
              'px-4 py-2 rounded font-medium transition',
              sortOrder === 'default'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]"
          >
            Default
          </button>
          <button
            @click="setSortOrder('date_asc')"
            :class="[
              'px-4 py-2 rounded font-medium transition',
              sortOrder === 'date_asc'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]"
          >
            Date ↑ (Earliest)
          </button>
          <button
            @click="setSortOrder('date_desc')"
            :class="[
              'px-4 py-2 rounded font-medium transition',
              sortOrder === 'date_desc'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]"
          >
            Date ↓ (Latest)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useTodoStore } from '../stores/todoStore'

const todoStore = useTodoStore()

// Local refs for custom date inputs
const customStartDate = ref('')
const customEndDate = ref('')

// Computed properties from store
const panelOpen = computed({
  get: () => todoStore.dateFilter.panelOpen,
  set: (value) => {
    todoStore.dateFilter.panelOpen = value
  },
})

const preset = computed({
  get: () => todoStore.dateFilter.preset,
  set: (value) => {
    todoStore.dateFilter.preset = value
  },
})

const completionFilter = computed({
  get: () => todoStore.dateFilter.completionFilter,
  set: (value) => {
    todoStore.dateFilter.completionFilter = value
  },
})

const sortOrder = computed({
  get: () => todoStore.dateFilter.sortOrder,
  set: (value) => {
    todoStore.dateFilter.sortOrder = value
  },
})

const hasActiveFilter = computed(() => todoStore.hasActiveFilter)

const activeFilterCount = computed(() => {
  let count = 0
  if (todoStore.dateFilter.preset !== 'all') count++
  if (todoStore.dateFilter.completionFilter !== 'all') count++
  if (todoStore.dateFilter.sortOrder !== 'default') count++
  return count
})

// Methods
const togglePanel = () => {
  todoStore.toggleFilterPanel()
}

const setPreset = (newPreset) => {
  todoStore.dateFilter.preset = newPreset
  if (newPreset !== 'custom') {
    customStartDate.value = ''
    customEndDate.value = ''
  }
}

const setCompletionFilter = (filter) => {
  todoStore.dateFilter.completionFilter = filter
}

const setSortOrder = (order) => {
  todoStore.dateFilter.sortOrder = order
}

const applyCustomDates = () => {
  todoStore.dateFilter.startDate = customStartDate.value
  todoStore.dateFilter.endDate = customEndDate.value
}

const resetAllFilters = () => {
  todoStore.resetFilters()
  customStartDate.value = ''
  customEndDate.value = ''
}
</script>
