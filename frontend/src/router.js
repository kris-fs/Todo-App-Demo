import { createRouter, createWebHistory } from 'vue-router'
import ListView from './views/ListView.vue'
import CalendarView from './views/CalendarView.vue'

const routes = [
  {
    path: '/',
    name: 'List',
    component: ListView,
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: CalendarView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
