import { ref, computed, watch } from 'vue'
import useApiFetch, { UNREACHABLE } from '@/use/useApiFetch'

// @typedef {Object} Viewer
// @property {{id: string, preferred_name?: string}} [user] - present only if logged in
// @property {Object.<string, {name: string, feed_id: string, description: string}>} subscriptions
// @property {{prompt: string}} [feed_preferences] - prompt may be empty when no preferences are configured

const loaded = ref(false)
const viewer = ref(undefined)

// TODO: Set up a timer to fetch the viewer on an interval

watch(viewer, () => {
  loaded.value = !!viewer.value
})

// True once we know the viewer is logged in (viewer.user is only present
// when there's an active session — a logged-out /api/viewer call still
// returns 200 with no `user` key).
const isLoggedIn = computed(() => viewer.value?.user != null)

// Fetches the current viewer and sets it on the ref.
// Returns false if the server couldn't be reached at all.
async function getViewer() {
  const { data, statusCode, call } = useApiFetch('GET', '/api/viewer')
  await call()
  viewer.value = data.value

  return statusCode.value !== UNREACHABLE
}

// Builds a path under the logged-in viewer's own user-scoped API namespace,
// e.g. userPath('/subscriptions') -> '/api/users/<id>/subscriptions'.
// Only call this from places gated behind isLoggedIn.
function userPath(suffix) {
  return `/api/users/${viewer.value.user.id}${suffix}`
}

export { getViewer, loaded, viewer, isLoggedIn, userPath }
