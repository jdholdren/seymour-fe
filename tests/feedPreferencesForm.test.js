import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'
import { Buffer } from 'node:buffer'
import { parse, compileScript } from '@vue/compiler-sfc'
import { createRenderer, createSSRApp, defineComponent, h, nextTick } from 'vue'
import { renderToString } from '@vue/server-renderer'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src')
const cache = new Map()

async function loadComponent(absolute) {
  if (cache.has(absolute)) return cache.get(absolute)
  const promise = generateUrl(absolute).then((url) => import(url))
  cache.set(absolute, promise)
  return promise
}

async function generateUrl(absolute) {
  const source = await readFile(absolute, 'utf8')
  const { descriptor, errors } = parse(source, { filename: absolute })
  assert.deepEqual(errors, [])
  let code = compileScript(descriptor, {
    id: path.basename(absolute),
    inlineTemplate: true,
  }).content
  for (const [, , specifier] of [...code.matchAll(/from\s+(['"])([^'"]+)\1/g)]) {
    let resolved
    if (specifier.startsWith('@/')) {
      resolved = await generateUrl(path.resolve(root, specifier.slice(2)))
    } else if (specifier.startsWith('.')) {
      const target = path.resolve(path.dirname(absolute), specifier)
      resolved = target.endsWith('.vue') ? await generateUrl(target) : pathToFileURL(target).href
    } else {
      resolved = import.meta.resolve(specifier)
    }
    code = code
      .replace(`from "${specifier}"`, `from ${JSON.stringify(resolved)}`)
      .replace(`from '${specifier}'`, `from ${JSON.stringify(resolved)}`)
  }
  return `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
}

async function component() {
  return (await loadComponent(path.resolve(root, 'components/FeedPreferencesForm.vue'))).default
}

const noop = () => {}
const defaultProps = (overrides = {}) => ({
  draft: '',
  dirty: false,
  loaded: true,
  loading: false,
  saving: false,
  error: '',
  success: '',
  onChange: noop,
  onSave: noop,
  onDiscard: noop,
  onInsertExample: noop,
  onRetry: noop,
  ...overrides,
})

async function render(props) {
  const Component = await component()
  return renderToString(createSSRApp({ render: () => h(Component, props) }))
}

function memoryRenderer() {
  return createRenderer({
    createElement: (type) => ({ type, props: {}, children: [], parent: null, value: '' }),
    createText: (text) => ({ type: '#text', text, parent: null }),
    createComment: (text) => ({ type: '#comment', text, parent: null }),
    setText: (node, text) => (node.text = text),
    setElementText: (node, text) => (node.children = [{ type: '#text', text, parent: node }]),
    patchProp: (node, key, _oldValue, value) => {
      node.props[key] = value
      if (key === 'value') node.value = value
    },
    insert: (node, parent, anchor) => {
      node.parent = parent
      const index = anchor ? parent.children.indexOf(anchor) : -1
      index < 0 ? parent.children.push(node) : parent.children.splice(index, 0, node)
    },
    remove: (node) => {
      if (node.parent) node.parent.children.splice(node.parent.children.indexOf(node), 1)
    },
    parentNode: (node) => node.parent,
    nextSibling: (node) => node.parent?.children[node.parent.children.indexOf(node) + 1] ?? null,
  })
}

function flatten(node) {
  return [node, ...(node.children ?? []).flatMap(flatten)]
}

test('textarea label and help are associated accessibly', async () => {
  const html = await render(defaultProps())
  assert.match(html, /<label[^>]*for="feed-preferences-prompt"[^>]*>Prompt<\/label>/)
  assert.match(
    html,
    /<textarea[^>]*id="feed-preferences-prompt"[^>]*aria-describedby="feed-preferences-prompt-help"/,
  )
  assert.match(
    html,
    /id="feed-preferences-prompt-help"[^>]*>[\s\S]*Leave this empty to show articles unfiltered\./,
  )
})

test('initial loading has no editor and load error offers retry', async () => {
  const loading = await render(defaultProps({ loaded: false, loading: true }))
  assert.match(loading, /role="status"[^>]*>Loading preferences/)
  assert.doesNotMatch(loading, /<textarea/)
  let retries = 0
  const error = await render(
    defaultProps({ loaded: false, error: 'Could not load', onRetry: () => retries++ }),
  )
  assert.match(error, /Could not load/)
  assert.match(error, /Try again/)
  assert.equal(retries, 0)
})

test('saving disables textarea and every action', async () => {
  const html = await render(defaultProps({ dirty: true, saving: true, draft: 'Draft' }))
  assert.match(html, /<textarea[^>]*disabled/)
  assert.equal((html.match(/<button[^>]*disabled/g) ?? []).length, 3)
  assert.match(html, /Discard changes/)
  assert.match(html, /Save prompt/)
})

test('component owns no API imports or draft/fetch state', async () => {
  const source = await readFile(path.resolve(root, 'components/FeedPreferencesForm.vue'), 'utf8')
  assert.doesNotMatch(source, /useApiFetch|fetch\s*\(|\bref\s*\(|\breactive\s*\(/)
  assert.doesNotMatch(source, /from\s+['"][^'"]*(?:api|services)[^'"]*['"]/i)
})

test('example action does not prefill an empty draft and invokes its callback', async () => {
  const Component = await component()
  let examples = 0
  const host = { type: 'root', children: [] }
  memoryRenderer()
    .createApp(
      defineComponent({
        render: () => h(Component, defaultProps({ onInsertExample: () => examples++ })),
      }),
    )
    .mount(host)
  const nodes = flatten(host)
  const exampleButton = nodes.filter((node) => node.type === 'button')[0]
  const textarea = nodes.find((node) => node.type === 'textarea')
  assert.equal(textarea.props.value, '')
  exampleButton.props.onClick()
  assert.equal(examples, 1)
  assert.equal(textarea.props.value, '')
})

test('input forwards edits and save/discard actions call parent callbacks', async () => {
  const Component = await component()
  const calls = []
  const props = defaultProps({
    draft: 'Existing draft',
    dirty: true,
    onChange: (value) => calls.push(['change', value]),
    onSave: () => calls.push(['save']),
    onDiscard: () => calls.push(['discard']),
  })
  const host = { type: 'root', children: [] }
  memoryRenderer()
    .createApp(defineComponent({ render: () => h(Component, props) }))
    .mount(host)
  const nodes = flatten(host)
  const textarea = nodes.find((node) => node.type === 'textarea')
  const buttons = nodes.filter((node) => node.type === 'button')
  textarea.props.onInput({ target: { value: 'Edited prompt' } })
  buttons[2].props.onClick()
  buttons[1].props.onClick()
  await nextTick()
  assert.deepEqual(calls, [['change', 'Edited prompt'], ['save'], ['discard']])
})
