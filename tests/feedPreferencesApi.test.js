import assert from 'node:assert/strict'
import test from 'node:test'
import { createFeedPreferencesApi } from '../src/use/feedPreferencesApi.js'

function setup(response) {
  const calls = []
  const api = createFeedPreferencesApi(
    (method, path) => ({
      data: { value: response.data },
      error: { value: response.error },
      statusCode: { value: response.status },
      call: async (body) => calls.push({ method, path, body }),
    }),
    '/api/users/123/feed-preferences',
  )
  return { api, calls }
}

test('prompt reads use account-scoped endpoint and preserve empty prompts', async () => {
  for (const prompt of ['', 'Technical articles']) {
    const { api, calls } = setup({ status: 200, data: { prompt } })
    assert.deepEqual(await api.readPrompt(), { ok: true, prompt })
    assert.deepEqual(calls, [
      { method: 'GET', path: '/api/users/123/feed-preferences', body: undefined },
    ])
  }
})

test('writes send prompt including empty clear and accept 200 or 204', async () => {
  for (const status of [200, 204]) {
    for (const prompt of ['', 'AI agents']) {
      const { api, calls } = setup({ status })
      assert.deepEqual(await api.writePrompt(prompt), { ok: true })
      assert.deepEqual(calls, [
        { method: 'PUT', path: '/api/users/123/feed-preferences', body: { prompt } },
      ])
    }
  }
})

test('malformed reads never silently become an empty prompt', async () => {
  for (const data of [undefined, null, {}, { prompt: null }, { prompt: 123 }]) {
    const { api } = setup({ status: 200, data })
    assert.equal((await api.readPrompt()).ok, false)
  }
})

test('unsupported backend and request failures show actionable errors', async () => {
  for (const status of [404, 405, 501]) {
    const { api } = setup({ status })
    assert.match((await api.readPrompt()).message, /not available on this server yet/)
  }
  const { api } = setup({ status: 422, error: { message: 'Prompt is too long.' } })
  assert.deepEqual(await api.writePrompt('long prompt'), {
    ok: false,
    message: 'Prompt is too long.',
  })
  const unreachable = setup({ status: 'unreachable' }).api
  assert.equal((await unreachable.readPrompt()).ok, false)
  assert.match((await unreachable.writePrompt('keep draft')).message, /draft has been kept/)
})
