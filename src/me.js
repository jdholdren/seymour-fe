import { ref, watch } from 'vue'
import useApiFetch, { UNREACHABLE } from '@/use/useApiFetch'

const loaded = ref(false)
const viewer = ref(undefined)

// TODO: Set up a timer to fetch the viewer on an interval

watch(viewer, () => {
  loaded.value = !!viewer.value
})

// Fetches the current viewer and sets it on the ref.
// Returns false if the server couldn't be reached at all.
async function getViewer() {
  const { data, statusCode, call } = useApiFetch('GET', '/api/viewer')
  await call()
  viewer.value = data.value

  return statusCode.value !== UNREACHABLE
}

export { getViewer, loaded, viewer }
