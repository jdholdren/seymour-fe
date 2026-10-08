import { readonly, ref } from 'vue'

export const THEME_STORAGE_KEY = 'seymour-theme'
const preference = ref('system')
const resolvedTheme = ref('light')
let mediaQuery
let initialized = false

export function normalizeTheme(value) {
  return ['light', 'dark', 'system'].includes(value) ? value : 'system'
}

function applyTheme() {
  resolvedTheme.value =
    preference.value === 'system' ? (mediaQuery.matches ? 'dark' : 'light') : preference.value
  document.documentElement.dataset.theme = resolvedTheme.value
}

export function initTheme() {
  if (initialized) return
  initialized = true
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  try {
    preference.value = normalizeTheme(window.localStorage.getItem(THEME_STORAGE_KEY))
  } catch {
    preference.value = 'system'
  }
  applyTheme()
  mediaQuery.addEventListener('change', applyTheme)
  window.addEventListener('storage', (event) => {
    if (event.key === THEME_STORAGE_KEY || event.key === null) {
      preference.value = normalizeTheme(event.newValue)
      applyTheme()
    }
  })
}

function setTheme(value) {
  preference.value = normalizeTheme(value)
  applyTheme()
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference.value)
  } catch {
    // Theme changes still work when browser storage is unavailable.
  }
}

export default function useTheme() {
  initTheme()
  return { preference: readonly(preference), resolvedTheme: readonly(resolvedTheme), setTheme }
}
