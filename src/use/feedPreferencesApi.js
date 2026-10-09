// Proposed backend contract: GET/PUT /api/users/:id/feed-preferences.
// Reads return { prompt: string }; writes accept { prompt: string }.
export function createFeedPreferencesApi(useApiFetch, path) {
  async function request(method, body) {
    const { call, data, error, statusCode } = useApiFetch(method, path)
    await call(body)
    const status = statusCode.value
    if (!(status >= 200 && status < 300)) {
      return {
        ok: false,
        message:
          status === 404 || status === 405 || status === 501
            ? 'Feed preferences are not available on this server yet.'
            : error.value?.message ||
              (method === 'GET'
                ? 'Could not load your feed preferences. Please try again.'
                : 'Could not save your feed preferences. Your draft has been kept.'),
      }
    }
    if (method === 'GET') {
      if (typeof data.value?.prompt !== 'string') {
        return {
          ok: false,
          message: 'The server returned invalid feed preferences. Please try again.',
        }
      }
      return { ok: true, prompt: data.value.prompt }
    }
    return { ok: true }
  }

  return {
    readPrompt: () => request('GET'),
    writePrompt: (prompt) => request('PUT', { prompt }),
  }
}
