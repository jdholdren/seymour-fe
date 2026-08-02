import { ref } from 'vue'

import { setGlobalError } from '@/use/globalErr'
import { setForbiddenError } from '@/use/forbiddenErr'

// Sentinel statusCode used when the server couldn't be reached at all
// (as opposed to a real HTTP response), so callers can tell the two apart.
export const UNREACHABLE = 'unreachable'

export default function (method, path) {
  const data = ref(null)
  const error = ref(null)
  const fetching = ref(false)
  const statusCode = ref(undefined)

  // Does the actual execution of the request:
  async function call(body = null) {
    fetching.value = true
    statusCode.value = undefined
    error.value = undefined
    data.value = undefined

    // Format the headers and options based on method and body presence
    const headers = {
      Accept: 'application/json',
    }
    const options = { method, headers, credentials: 'include' }
    if (body) {
      options.body = JSON.stringify(body)
      options.headers['Content-Type'] = 'application/json'
    }

    // Perform the request and wait for the response
    const host = window.__CONFIG__?.VITE_API_HOST || import.meta.env.VITE_API_HOST || ''
    const url = host + path
    let response
    try {
      response = await fetch(url, options)
    } catch {
      // The server couldn't be reached at all (network error, server down, etc).
      statusCode.value = UNREACHABLE
      error.value = { message: 'Could not reach the server' }
      fetching.value = false
      return
    }

    // No/expired session: send the user to a login page, preserving where
    // they were so they can be sent back after authenticating.
    if (response.status === 401) {
      const returnPath = window.location.pathname + window.location.search
      window.location.href = `/login?redirect=${encodeURIComponent(returnPath)}`

      fetching.value = false
      return
    }

    // Logged in, but acting on a resource that isn't theirs. Shouldn't
    // normally be reachable through the UI, but show a generic error
    // rather than crashing.
    if (response.status === 403) {
      const respBody = await response.json()
      setForbiddenError(respBody.message)

      fetching.value = false
      return
    }

    // Error handling: anything 5XX is a global error.
    //
    // Parse it and set it in the global state.
    if (response.status >= 500) {
      // Don't set anything in the local state of this composable so
      // that the error is only handled once:
      const respBody = await response.json()
      setGlobalError(respBody.message)

      fetching.value = false
      return
    }

    const code = response.status
    statusCode.value = code

    // If there's a body to parse...
    if (code !== 204) {
      const respBody = await response.json()
      // ...set it to the appropriate output ref
      if (response.ok) {
        data.value = respBody
      } else {
        error.value = respBody
      }
    }

    fetching.value = false
  }

  return { data, error, fetching, statusCode, call }
}
