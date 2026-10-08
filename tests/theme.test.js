import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { runInNewContext } from 'node:vm'
import { normalizeTheme } from '../src/use/useTheme.js'

const bootstrap = readFileSync(new URL('../index.html', import.meta.url), 'utf8').match(
  /<script>([\s\S]*?)<\/script>/,
)[1]

test('theme palettes meet text and control contrast targets', () => {
  const css = readFileSync(new URL('../src/assets/main.css', import.meta.url), 'utf8')
  const parseColors = (block) =>
    Object.fromEntries(
      [...block.matchAll(/--color-([\w-]+): oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)/g)].map(
        ([, name, lightness, chroma, hue]) => {
          const angle = (Number(hue) * Math.PI) / 180
          const a = Number(chroma) * Math.cos(angle)
          const b = Number(chroma) * Math.sin(angle)
          const l = (Number(lightness) + 0.3963377774 * a + 0.2158037573 * b) ** 3
          const m = (Number(lightness) - 0.1055613458 * a - 0.0638541728 * b) ** 3
          const s = (Number(lightness) - 0.0894841775 * a - 1.291485548 * b) ** 3
          const clamp = (value) => Math.max(0, Math.min(1, value))
          const luminance =
            0.2126 * clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s) +
            0.7152 * clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s) +
            0.0722 * clamp(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)
          return [name, luminance]
        },
      ),
    )
  const light = parseColors(css.match(/@theme\s*\{([\s\S]*?)\}/)[1])
  const dark = {
    ...light,
    ...parseColors(css.match(/:root\[data-theme='dark'\]\s*\{([\s\S]*?)\}/)[1]),
  }
  for (const [theme, colors] of Object.entries({ light, dark })) {
    const check = (foreground, background, minimum) => {
      const ratio =
        (Math.max(colors[foreground], colors[background]) + 0.05) /
        (Math.min(colors[foreground], colors[background]) + 0.05)
      assert.ok(ratio >= minimum, `${theme}: ${foreground} on ${background}: ${ratio.toFixed(2)}`)
    }
    for (const background of ['surface', 'surface-container', 'surface-raised']) {
      for (const foreground of ['foreground', 'muted', 'primary-faded', 'danger']) {
        check(foreground, background, 4.5)
      }
    }
    check('on-primary', 'primary', 4.5)
    check('on-primary', 'primary-dark', 4.5)
    check('on-danger', 'danger', 4.5)
    check('border', 'surface-raised', 3)
  }
})

test('first-paint theme honors preferences and tolerates unavailable storage', () => {
  for (const [stored, systemDark, expected] of [
    ['light', true, 'light'],
    ['dark', false, 'dark'],
    ['system', true, 'dark'],
    [null, false, 'light'],
    ['invalid', true, 'dark'],
    ['blocked', true, 'dark'],
  ]) {
    const document = { documentElement: { dataset: {} } }
    runInNewContext(bootstrap, {
      document,
      localStorage: {
        getItem() {
          if (stored === 'blocked') throw new Error('Storage blocked')
          return stored
        },
      },
      window: { matchMedia: () => ({ matches: systemDark }) },
    })
    assert.equal(document.documentElement.dataset.theme, expected)
  }
})

test('theme preference persists, follows system changes, and syncs across tabs', async () => {
  const listeners = {}
  const mediaQuery = {
    matches: true,
    addEventListener: (type, callback) => (listeners[`media:${type}`] = callback),
  }
  let stored = null
  let storageBlocked = false
  globalThis.document = { documentElement: { dataset: {} } }
  globalThis.window = {
    matchMedia: () => mediaQuery,
    addEventListener: (type, callback) => (listeners[type] = callback),
    localStorage: {
      getItem: () => stored,
      setItem(key, value) {
        assert.equal(key, 'seymour-theme')
        if (storageBlocked) throw new Error('Storage blocked')
        stored = value
      },
    },
  }
  try {
    const { default: useTheme } = await import('../src/use/useTheme.js?theme-test')
    assert.equal(normalizeTheme('invalid'), 'system')
    const theme = useTheme()
    assert.equal(theme.preference.value, 'system')
    assert.equal(theme.resolvedTheme.value, 'dark')
    theme.setTheme('light')
    assert.equal(stored, 'light')
    assert.equal(document.documentElement.dataset.theme, 'light')
    listeners['media:change']()
    assert.equal(theme.resolvedTheme.value, 'light')
    theme.setTheme('system')
    assert.equal(theme.resolvedTheme.value, 'dark')
    mediaQuery.matches = false
    listeners['media:change']()
    assert.equal(theme.resolvedTheme.value, 'light')
    listeners.storage({ key: 'seymour-theme', newValue: 'dark' })
    assert.equal(theme.preference.value, 'dark')
    assert.equal(theme.resolvedTheme.value, 'dark')
    listeners.storage({ key: 'unrelated', newValue: 'light' })
    assert.equal(theme.resolvedTheme.value, 'dark')
    listeners.storage({ key: null, newValue: null })
    assert.equal(theme.preference.value, 'system')
    assert.equal(theme.resolvedTheme.value, 'light')
    storageBlocked = true
    theme.setTheme('dark')
    assert.equal(theme.resolvedTheme.value, 'dark')
  } finally {
    delete globalThis.window
    delete globalThis.document
  }
})
