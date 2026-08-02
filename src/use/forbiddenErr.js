import { ref } from 'vue'

const forbiddenError = ref(null)
const timeoutID = ref(null)

export function useForbiddenError() {
  return forbiddenError
}

export async function setForbiddenError(error) {
  if (forbiddenError.value) {
    forbiddenError.value = null

    // Sleep so the other error can go away
    await new Promise((r) => setTimeout(r, 500))
  }

  forbiddenError.value = error

  // If there's already an ongoing error, clear that
  if (timeoutID.value) {
    clearTimeout(timeoutID.value)
  }

  // Clear the error after 5s
  timeoutID.value = setTimeout(() => {
    forbiddenError.value = null
  }, 5000)
}

export function clearForbiddenError() {
  forbiddenError.value = null
}
