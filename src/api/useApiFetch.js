import { ref } from 'vue'

export default function (method, path) {
  const data = ref(null)
  const error = ref(null)
  const fetching = ref(false)
  const statusCode = ref(undefined)

  // Does the actual execution of the request:
  async function call(body = null) {
    fetching.value = true

    // Format the headers and options based on method and body presence
    const headers = {
      "Accept": "application/json"
    }
    const options = { method, headers, credentials: 'include' }
    if (body) {
      options.body = JSON.stringify(body)
      options.headers["Content-Type"] = "application/json"
    }

    // Perform the request and wait for the response
    const url = import.meta.env.VITE_API_HOST + path
    const response = await fetch(url, options)

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
