import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { normalizeReturnPath, landingDestination } from '../src/use/authNavigation.js'

test('authentication preserves supported internal routes, queries, and hashes', () => {
  for (const path of [
    '/',
    '/timeline?status=all#articles',
    '/subscriptions',
    '/subscriptions/new',
    '/preferences',
    '/article/123',
    '/alpha',
  ]) {
    assert.equal(normalizeReturnPath(path), path)
    assert.equal(landingDestination(path), `/landing?redirect=${encodeURIComponent(path)}`)
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
    getViewer: async () => reachable,
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
  const query = { redirect: '/article/123' }
  const legacy = routes.find((route) => route.path === '/login').redirect({ query, hash: '' })
  assert.equal(legacy.name, 'landing')
  assert.equal(legacy.query, query)
  const destination = await guard({ name: 'article', fullPath: '/article/123#text' })
  assert.equal(destination.name, 'landing')
  assert.equal(destination.query.redirect, '/article/123#text')
  assert.equal(await guard({ name: 'landing' }), undefined)
  isLoggedIn.value = true
  assert.equal(await guard({ name: 'timeline' }), undefined)
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
  for (const pathname of ['/article/123', '/landing', '/login']) {
    const window = {
      location: { pathname, search: '?status=all', hash: '#text', href: 'unchanged' },
    }
    const context = {
      window,
      landingDestination,
      ref: (value) => ({ value }),
      fetch: async () => ({ status: 401 }),
    }
    runInNewContext(`${source}\nthis.request = useApiFetch('GET', '/api/viewer')`, context)
    await context.request.call()
    assert.equal(context.request.statusCode.value, 401)
    assert.equal(context.request.fetching.value, false)
    assert.equal(
      window.location.href,
      pathname === '/article/123'
        ? landingDestination('/article/123?status=all#text')
        : 'unchanged',
    )
  }
})
