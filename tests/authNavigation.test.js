import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { normalizeReturnPath, landingDestination } from '../src/use/authNavigation.js'

test('authentication preserves supported internal routes, queries, and hashes', () => {
  for (const path of [
    '/timeline?status=all#articles',
    '/subscriptions',
    '/subscriptions/new',
    '/settings',
    '/article/123',
  ]) {
    assert.equal(normalizeReturnPath(path), path)
    assert.equal(landingDestination(path), `/?redirect=${encodeURIComponent(path)}`)
  }
})

test('invalid and public return paths fall back to timeline without loops', () => {
  for (const path of [
    undefined,
    null,
    [],
    ['/timeline'],
    'https://example.com',
    '//example.com',
    '/\\example.com',
    '/',
    '/landing?redirect=/landing',
    '/login',
    '/unknown',
    '/timeline\n',
    '/article/123/extra',
  ]) {
    assert.equal(normalizeReturnPath(path), '/timeline')
  }
})

test('legacy login redirects and protected routes use landing', async () => {
  let routes
  let guard
  const loaded = { value: true }
  const isLoggedIn = { value: false }
  let reachable = true
  const source = readFileSync(new URL('../src/router/index.js', import.meta.url), 'utf8')
    .replace(/^import .*\n/gm, '')
    .replace('import.meta.env.BASE_URL', "'/'")
    .replace('export default router', '')
  runInNewContext(source, {
    loaded,
    isLoggedIn,
    normalizeReturnPath,
    getViewer: async ({ redirectOnUnauthorized }) => {
      assert.equal(redirectOnUnauthorized, false)
      return reachable
    },
    createWebHistory: () => ({}),
    createRouter: (options) => {
      routes = options.routes
      return {
        beforeEach: (callback) => {
          guard = callback
        },
      }
    },
  })
  // Old sign-in links resolve to the canonical root and keep their destination.
  assert.equal(routes.find((route) => route.name === 'landing').path, '/')
  const query = { redirect: '/article/123?view=reader#text' }
  for (const path of ['/login', '/landing']) {
    const legacy = routes.find((route) => route.path === path).redirect({ query, hash: '#main' })
    assert.equal(legacy.name, 'landing')
    assert.equal(legacy.query, query)
    assert.equal(legacy.hash, '#main')
  }

  // Signed-out visits to a protected page keep its destination on the sign-in page.
  const destination = await guard({ name: 'article', fullPath: '/article/123#text' })
  assert.equal(destination.name, 'landing')
  assert.equal(destination.query.redirect, '/article/123#text')
  assert.equal(await guard({ name: 'landing' }), undefined)

  // An authenticated visitor continues directly to the requested workspace page.
  isLoggedIn.value = true
  assert.equal(await guard({ name: 'timeline' }), undefined)
  assert.equal(await guard({ name: 'landing' }), '/timeline')
  assert.equal(await guard({ name: 'landing', query }), query.redirect)
  assert.equal(await guard({ name: 'landing', query: { redirect: '/' } }), '/timeline')

  // Root remains usable during a backend outage, and protected links still point there.
  loaded.value = false
  reachable = false
  assert.equal(await guard({ name: 'landing' }), true)
  assert.equal((await guard({ name: 'timeline' })).name, 'landing')
})

test('expired sessions preserve destinations without reloading public landing', async () => {
  const source = readFileSync(new URL('../src/use/useApiFetch.js', import.meta.url), 'utf8')
    .replace(/^import .*\n/gm, '')
    .replace('export const UNREACHABLE', 'const UNREACHABLE')
    .replace('export default function', 'function useApiFetch')
    .replace('import.meta.env.VITE_API_HOST', "''")
  // A background request may redirect, but public pages and guard-owned checks should stay put.
  for (const [pathname, redirectOnUnauthorized, shouldRedirect] of [
    ['/article/123', undefined, true],
    ['/article/123', false, false],
    ['/', undefined, false],
    ['/landing', undefined, false],
    ['/login', undefined, false],
  ]) {
    const window = {
      location: { pathname, search: '?status=all', hash: '#text', href: 'unchanged' },
    }
    const context = {
      window,
      landingDestination,
      redirectOnUnauthorized,
      ref: (value) => ({ value }),
      fetch: async () => ({ status: 401 }),
    }
    runInNewContext(
      `${source}\nthis.request = useApiFetch('GET', '/api/viewer', { redirectOnUnauthorized })`,
      context,
    )
    await context.request.call()
    assert.equal(context.request.statusCode.value, 401)
    assert.equal(context.request.fetching.value, false)
    assert.equal(
      window.location.href,
      shouldRedirect ? landingDestination('/article/123?status=all#text') : 'unchanged',
    )
  }
})
