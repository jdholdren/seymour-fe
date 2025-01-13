import { ref } from 'vue'

export default function (method, url, body = null) {
  const data = ref(null)
  const error = ref(null)
  const fetching = ref(false)
  const statusCode = ref(undefined)

  // Does the actual execution of the request:
  async function apiFetch() {
    fetching.value = true

    // Format the headers and options based on method and body presence
    const headers = {
      "Accept": "application/json"
    }
    const options = { method, headers }
    if (body) {
      options.body = JSON.stringify(body)
      options.headers["Content-Type"] = "application/json"
    }

    // Perform the request and wait for the response
    const response = await fetch(url, options)

    const code = response.status
    statusCode.value = code

    // If there's a body to parse...
    const respBody = await response.json()
    // ...set it to the appropriate output ref
    if (response.ok) {
      data.value = respBody
    } else {
      error.value = respBody
    }

    fetching.value = false
  }

  return { data, error, fetching, statusCode, apiFetch }
}
