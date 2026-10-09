import assert from 'node:assert/strict'
import test from 'node:test'
import {
  defaultTimelineStatus,
  hasFeedPrompt,
  isFeedPromptKnown,
  timelineStatus,
} from '../src/use/feedPreferenceState.js'

test('missing and malformed preferences remain unknown and retain approved default', () => {
  for (const preferences of [undefined, null, {}, { prompt: null }, { prompt: 1 }]) {
    assert.equal(isFeedPromptKnown(preferences), false)
    assert.equal(hasFeedPrompt(preferences), false)
    assert.equal(defaultTimelineStatus(preferences), 'approved')
  }
})

test('blank and whitespace prompts are confirmed empty and default to all', () => {
  for (const prompt of ['', '  \n\t ']) {
    const preferences = { prompt }
    assert.equal(isFeedPromptKnown(preferences), true)
    assert.equal(hasFeedPrompt(preferences), false)
    assert.equal(defaultTimelineStatus(preferences), 'all')
  }
})

test('configured prompt retains approved default and explicit statuses always win', () => {
  const preferences = { prompt: '  science  ' }
  assert.equal(hasFeedPrompt(preferences), true)
  assert.equal(defaultTimelineStatus(preferences), 'approved')
  assert.equal(timelineStatus(undefined, { prompt: '' }), 'all')
  for (const status of ['approved', 'requires_judgement', 'rejected', 'all']) {
    assert.equal(timelineStatus(status, { prompt: '' }), status)
  }
})
