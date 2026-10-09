// Only return to known, internal app routes after authentication.
export function normalizeReturnPath(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || /[\\\s]/.test(value)) {
    return '/timeline'
  }
  const path = value.split(/[?#]/)[0]
  if (
    ['/', '/timeline', '/subscriptions', '/subscriptions/new', '/preferences', '/alpha'].includes(
      path,
    ) ||
    /^\/article\/[^/]+$/.test(path)
  ) {
    return value
  }
  return '/timeline'
}

export function landingDestination(returnPath) {
  return `/landing?redirect=${encodeURIComponent(normalizeReturnPath(returnPath))}`
}
