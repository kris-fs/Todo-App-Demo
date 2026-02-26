/**
 * useDatePresets - Pure date utility functions for filter presets
 * Provides helper functions to calculate date ranges for common presets
 */

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getToday() {
  return new Date().toISOString().split('T')[0]
}

/**
 * Get the start of the current week (Monday)
 */
export function getWeekStart() {
  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is Sunday
  const monday = new Date(today.setDate(diff))
  return monday.toISOString().split('T')[0]
}

/**
 * Get the end of the current week (Sunday)
 */
export function getWeekEnd() {
  const weekStart = new Date(getWeekStart())
  const sunday = new Date(weekStart.setDate(weekStart.getDate() + 6))
  return sunday.toISOString().split('T')[0]
}

/**
 * Get the start of the current month (1st day)
 */
export function getMonthStart() {
  const today = new Date()
  return new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split('T')[0]
}

/**
 * Get the end of the current month (last day)
 */
export function getMonthEnd() {
  const today = new Date()
  return new Date(today.getFullYear(), today.getMonth() + 1, 0)
    .toISOString()
    .split('T')[0]
}

/**
 * Get the date range for a given preset
 * @param {string} preset - 'today', 'this_week', 'this_month', or 'custom'
 * @param {string} customStart - custom start date (only used if preset is 'custom')
 * @param {string} customEnd - custom end date (only used if preset is 'custom')
 * @returns {object} { startDate, endDate } or null if preset is 'all'
 */
export function getDateRangeForPreset(preset, customStart = '', customEnd = '') {
  switch (preset) {
    case 'today':
      return { startDate: getToday(), endDate: getToday() }
    case 'this_week':
      return { startDate: getWeekStart(), endDate: getWeekEnd() }
    case 'this_month':
      return { startDate: getMonthStart(), endDate: getMonthEnd() }
    case 'custom':
      return { startDate: customStart, endDate: customEnd }
    case 'all':
    default:
      return { startDate: '', endDate: '' }
  }
}
