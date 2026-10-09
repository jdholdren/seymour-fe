import assert from 'node:assert/strict'
import test from 'node:test'
import useFeedPreferences, { EXAMPLE_FEED_PROMPT } from '../src/use/useFeedPreferences.js'

test('loads preferences, retries failures, and preserves draft across failed loads', async () => {
  let response = { ok: true, prompt: 'stored' }
  const state = useFeedPreferences({
    readPrompt: async () => response,
    writePrompt: async () => ({ ok: true }),
  })
  assert.equal(await state.load(), true)
  assert.equal(state.loaded.value, true)
  assert.equal(state.draft.value, 'stored')
  state.changeDraft('unsaved')
  response = { ok: false, message: 'offline' }
  assert.equal(await state.load(), false)
  assert.equal(state.error.value, 'offline')
  assert.equal(state.draft.value, 'unsaved')
  response = { ok: true, prompt: 'remote' }
  assert.equal(await state.load(), true)
  assert.equal(state.draft.value, 'unsaved')
  assert.equal(state.savedPrompt.value, 'remote')
})

test('dirty, discard, guarded changes, and explicit example replacement', async () => {
  const state = useFeedPreferences({
    readPrompt: async () => ({ ok: true, prompt: 'initial' }),
    writePrompt: async () => ({ ok: true }),
  })
  await state.load()
  assert.equal(state.dirty.value, false)
  state.changeDraft('changed')
  assert.equal(state.dirty.value, true)
  assert.equal(state.insertExample(), false)
  assert.equal(
    state.insertExample(() => false),
    false,
  )
  assert.equal(
    state.insertExample(() => true),
    true,
  )
  assert.match(EXAMPLE_FEED_PROMPT, /software engineering.*distributed systems.*AI agents/)
  state.discard()
  assert.equal(state.draft.value, 'initial')
  assert.equal(state.dirty.value, false)
})

test('save trims input, confirms from readback, and refreshes viewer afterward', async () => {
  const calls = []
  let read = 'old'
  const state = useFeedPreferences({
    readPrompt: async () => {
      calls.push('read')
      return { ok: true, prompt: read }
    },
    writePrompt: async (prompt) => {
      calls.push(['write', prompt])
      read = 'server canonical'
      return { ok: true }
    },
    refreshViewer: async () => {
      calls.push('refresh')
      return true
    },
  })
  await state.load()
  state.changeDraft('  submitted  ')
  assert.equal(await state.save(), true)
  assert.deepEqual(calls, ['read', ['write', 'submitted'], 'read', 'refresh'])
  assert.equal(state.savedPrompt.value, 'server canonical')
  assert.equal(state.draft.value, 'server canonical')
  assert.equal(state.dirty.value, false)
  assert.ok(state.success.value)
})

test('readback failure preserves dirty draft and explains the write may have succeeded', async () => {
  let count = 0
  let refreshes = 0
  const state = useFeedPreferences({
    readPrompt: async () =>
      ++count === 1 ? { ok: true, prompt: 'old' } : { ok: false, message: 'read failed' },
    writePrompt: async () => ({ ok: true }),
    refreshViewer: async () => {
      refreshes += 1
    },
  })
  await state.load()
  state.changeDraft('new draft')
  assert.equal(await state.save(), false)
  assert.equal(state.draft.value, 'new draft')
  assert.equal(state.savedPrompt.value, 'old')
  assert.equal(state.dirty.value, true)
  assert.match(state.error.value, /saved, but could not be confirmed/)
  assert.equal(state.success.value, '')
  assert.equal(refreshes, 1)
})

test('empty prompt clears successfully and leaves a confirmed clean draft', async () => {
  let prompt = 'existing'
  const state = useFeedPreferences({
    readPrompt: async () => ({ ok: true, prompt }),
    writePrompt: async (value) => {
      prompt = value
      return { ok: true }
    },
  })
  await state.load()
  state.changeDraft('   ')
  assert.equal(await state.save(), true)
  assert.equal(prompt, '')
  assert.equal(state.draft.value, '')
  assert.equal(state.dirty.value, false)
})

test('missing prompt state is invalid, not implicitly empty', async () => {
  const state = useFeedPreferences({
    readPrompt: async () => ({ ok: true }),
    writePrompt: async () => ({ ok: true }),
  })
  assert.equal(await state.load(), false)
  assert.equal(state.loaded.value, false)
  assert.ok(state.error.value)
})

test('viewer refresh failure reports confirmed save without a false success notice', async () => {
  let prompt = 'old'
  const state = useFeedPreferences({
    readPrompt: async () => ({ ok: true, prompt }),
    writePrompt: async (value) => {
      prompt = value
      return { ok: true }
    },
    refreshViewer: async () => false,
  })
  await state.load()
  state.changeDraft('new')
  assert.equal(await state.save(), false)
  assert.equal(state.draft.value, 'new')
  assert.equal(state.dirty.value, false)
  assert.match(state.error.value, /saved and confirmed.*viewer/)
  assert.equal(state.success.value, '')
})

test('write failure and empty prompt clearing', async () => {
  let submitted
  const state = useFeedPreferences({
    readPrompt: async () => ({ ok: true, prompt: submitted ?? 'existing' }),
    writePrompt: async (prompt) => {
      submitted = prompt
      return { ok: false, message: 'rejected' }
    },
  })
  await state.load()
  state.changeDraft('')
  assert.equal(await state.save(), false)
  assert.equal(submitted, '')
  assert.equal(state.draft.value, '')
  assert.equal(state.error.value, 'rejected')
  assert.equal(state.saving.value, false)
})

test('busy guards prevent duplicate saves and freeze draft edits during saving', async () => {
  let release
  let writes = 0
  const state = useFeedPreferences({
    readPrompt: async () => ({ ok: true, prompt: 'old' }),
    writePrompt: async () => {
      writes += 1
      await new Promise((resolve) => {
        release = resolve
      })
      return { ok: true }
    },
  })
  await state.load()
  state.changeDraft('new')
  const pending = state.save()
  await Promise.resolve()
  assert.equal(state.saving.value, true)
  state.changeDraft('during save')
  assert.equal(state.draft.value, 'new')
  assert.equal(await state.save(), false)
  assert.equal(writes, 1)
  release()
  assert.equal(await pending, true)
  assert.equal(state.saving.value, false)
})
