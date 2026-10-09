// The viewer may be served by an older API or be partially populated while loading.
// Only a string prompt is authoritative; whitespace is a confirmed empty prompt.
export function hasFeedPrompt(preferences) {
  return typeof preferences?.prompt === 'string' && preferences.prompt.trim().length > 0
}

export function isFeedPromptKnown(preferences) {
  return typeof preferences?.prompt === 'string'
}

export function defaultTimelineStatus(preferences) {
  return isFeedPromptKnown(preferences) && !hasFeedPrompt(preferences) ? 'all' : 'approved'
}

export function timelineStatus(queryStatus, preferences) {
  return queryStatus || defaultTimelineStatus(preferences)
}
