import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'
import { Buffer } from 'node:buffer'
import { parse, compileScript } from '@vue/compiler-sfc'
import { createSSRApp, createRenderer, defineComponent, h, nextTick, ref } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { createMemoryHistory, createRouter } from 'vue-router'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/components/kit')
const compiled = new Map()
const moduleUrls = new Map()

async function loadComponent(file) {
  const absolute = path.resolve(root, file)
  if (compiled.has(absolute)) return compiled.get(absolute)
  const promise = generateUrl(absolute).then((url) => import(url))
  compiled.set(absolute, promise)
  return promise
}

async function generateUrl(absolute) {
  if (moduleUrls.has(absolute)) return moduleUrls.get(absolute)
  const source = await readFile(absolute, 'utf8')
  const { descriptor, errors } = parse(source, { filename: absolute })
  assert.deepEqual(errors, [])
  let code = compileScript(descriptor, {
    id: path.basename(absolute),
    inlineTemplate: true,
  }).content
  for (const [, , specifier] of [...code.matchAll(/from\s+(['"])([^'"]+)\1/g)]) {
    let resolved
    if (specifier.startsWith('.')) {
      const target = path.resolve(path.dirname(absolute), specifier)
      resolved = target.endsWith('.vue') ? await generateUrl(target) : pathToFileURL(target).href
    } else {
      resolved = import.meta.resolve(specifier)
    }
    code = code
      .replace(`from "${specifier}"`, `from ${JSON.stringify(resolved)}`)
      .replace(`from '${specifier}'`, `from ${JSON.stringify(resolved)}`)
  }
  const url = `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
  moduleUrls.set(absolute, url)
  return url
}
async function component(file) {
  return (await loadComponent(file)).default
}

async function render(file, props = {}, slots = {}) {
  const Component = await component(file)
  const app = createSSRApp({ render: () => h(Component, props, slots) })
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { render: () => h('div') } },
      { path: '/target', component: { render: () => h('div') } },
    ],
  })
  app.use(router)
  await router.push('/')
  await router.isReady()
  return renderToString(app)
}

test('surface, heading, text and page header render semantic content and slots', async () => {
  const surface = await render(
    'KitSurface.vue',
    { as: 'section', tone: 'secondary', padding: 'lg' },
    { default: () => 'Surface content' },
  )
  assert.match(
    surface,
    /^<section[^>]*bg-surface-container[^>]*>[\s\S]*Surface content[\s\S]*<\/section>$/,
  )
  assert.match(
    await render('KitHeading.vue', { as: 'h3' }, { default: () => 'Heading' }),
    /<h3[^>]*>[\s\S]*Heading[\s\S]*<\/h3>/,
  )
  assert.match(
    await render('KitText.vue', { as: 'span', tone: 'muted' }, { default: () => 'Text' }),
    /<span[^>]*text-muted[^>]*>[\s\S]*Text[\s\S]*<\/span>/,
  )
  const header = await render(
    'KitPageHeader.vue',
    { title: 'Welcome', description: 'Intro' },
    { actions: () => 'Action' },
  )
  assert.match(
    header,
    /<header[\s\S]*<h1[^>]*>[\s\S]*Welcome[\s\S]*<\/h1>[\s\S]*Intro[\s\S]*Action[\s\S]*<\/header>/,
  )
})

test('button exposes native type, disabled/loading state, busy status and variants', async () => {
  let html = await render(
    'KitButton.vue',
    { type: 'submit', variant: 'outline' },
    { default: () => 'Save' },
  )
  assert.match(html, /<button[^>]*type="submit"[^>]*border[^>]*>[\s\S]*Save[\s\S]*<\/button>/)
  html = await render('KitButton.vue', { loading: true }, { default: () => 'Saving' })
  assert.match(html, /<button[^>]*disabled[^>]*aria-busy="true"/)
  assert.match(html, /aria-hidden="true"[^>]*kit-spinner/)
  assert.match(html, /cursor-not-allowed/)
  html = await render('KitButton.vue', { disabled: true }, { default: () => 'Disabled' })
  assert.match(html, /<button[^>]*disabled[^>]*>[\s\S]*Disabled[\s\S]*<\/button>/)
  assert.match(html, /focus-visible:outline-2/)
})

test('button links use anchors for external destinations and RouterLink internally', async () => {
  let html = await render(
    'KitButtonLink.vue',
    { href: 'https://example.test', target: '_blank', rel: 'noreferrer' },
    { default: () => 'External' },
  )
  assert.match(
    html,
    /<a[^>]*href="https:\/\/example.test"[^>]*target="_blank"[^>]*rel="noreferrer"[^>]*>[\s\S]*External[\s\S]*<\/a>/,
  )
  html = await render('KitButtonLink.vue', { to: '/target' }, { default: () => 'Internal' })
  assert.match(html, /<a[^>]*href="\/target"[^>]*>[\s\S]*Internal[\s\S]*<\/a>/)
  assert.doesNotMatch(html, /<button/)
  html = await render(
    'KitTextLink.vue',
    { href: 'https://example.test' },
    { default: () => 'Read more' },
  )
  assert.match(html, /<a[^>]*href="https:\/\/example.test"[^>]*>[\s\S]*Read more[\s\S]*<\/a>/)
})

test('form field labels, help and errors associate slot controls accessibly', async () => {
  const KitInput = await component('KitInput.vue')
  const KitSelect = await component('KitSelect.vue')
  for (const Control of [KitInput, KitSelect]) {
    const html = await render(
      'KitFormField.vue',
      { id: 'email', label: 'Email', help: 'Use your address', error: 'Invalid address' },
      {
        default: ({ control }) => h(Control, { ...control, 'model-value': 'initial' }),
      },
    )
    assert.match(html, /<label[^>]*for="email"[^>]*>Email<\/label>/)
    assert.match(
      html,
      /<(?:input|select)[^>]*id="email"[^>]*aria-describedby="email-help email-error"[^>]*aria-invalid="true"/,
    )
    assert.match(html, /id="email-help"[^>]*>[\s\S]*Use your address/)
    assert.match(html, /id="email-error"[^>]*role="alert"[^>]*>[\s\S]*Invalid address/)
  }
})

test('empty state renders title, description, icon and action slots; alerts have live roles', async () => {
  const html = await render(
    'KitEmptyState.vue',
    { title: 'Nothing here', description: 'Try again later' },
    {
      icon: () => h('svg', { 'data-testid': 'icon' }),
      action: () => h('button', 'Retry'),
    },
  )
  assert.match(html, /aria-hidden="true"[^>]*>[\s\S]*<svg[^>]*data-testid="icon"/)
  assert.match(html, /Nothing here[\s\S]*Try again later[\s\S]*<button>Retry<\/button>/)
  assert.match(
    await render('KitAlert.vue', { tone: 'danger' }, { default: () => 'Problem' }),
    /<div role="alert"[^>]*>[\s\S]*Problem[\s\S]*<\/div>/,
  )
  assert.match(
    await render('KitAlert.vue', {}, { default: () => 'Notice' }),
    /<div role="status"[^>]*>[\s\S]*Notice[\s\S]*<\/div>/,
  )
})

test('input and select bind model-value and emit update:modelValue on changes', async (t) => {
  // Native v-model checks focus when an externally controlled input changes.
  const originalDocument = globalThis.document
  globalThis.document = { activeElement: null }
  t.after(() => {
    if (originalDocument === undefined) delete globalThis.document
    else globalThis.document = originalDocument
  })
  const renderer = createRenderer({
    createElement: (type) => {
      const node = {
        type,
        tagName: type.toUpperCase(),
        props: {},
        children: [],
        parent: null,
        value: '',
        listeners: {},
        addEventListener(name, fn) {
          this.listeners[name] = fn
        },
        getAttribute(name) {
          return this.props[name] ?? null
        },
      }
      if (type === 'select')
        Object.defineProperties(node, {
          options: {
            get() {
              return this.children.filter((child) => child.type === 'option')
            },
          },
          selectedIndex: {
            set(index) {
              this.options.forEach((option, i) => {
                option.selected = i === index
              })
            },
          },
        })
      return node
    },
    createText: (text) => ({ type: '#text', text, parent: null }),
    createComment: (text) => ({ type: '#comment', text, parent: null }),
    setText: (node, text) => {
      node.text = text
    },
    setElementText: (node, text) => {
      node.children = [{ type: '#text', text, parent: node }]
    },
    patchProp: (node, key, _old, value) => {
      node.props[key] = value
      if (key === 'value') node.value = value
      if (key === 'selected') node.selected = value
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
  const KitInput = await component('KitInput.vue')
  const KitSelect = await component('KitSelect.vue')
  const Parent = defineComponent({
    setup() {
      const input = ref('before')
      const select = ref('first')
      return { input, select }
    },
    render() {
      return h('main', [
        h(KitInput, {
          modelValue: this.input,
          'onUpdate:modelValue': (value) => {
            this.input = value
          },
        }),
        h(
          KitSelect,
          {
            modelValue: this.select,
            'onUpdate:modelValue': (value) => {
              this.select = value
            },
          },
          {
            default: () => [
              h('option', { value: 'first' }, 'First'),
              h('option', { value: 'second' }, 'Second'),
            ],
          },
        ),
      ])
    },
  })
  const host = { type: 'root', children: [] }
  const app = renderer.createApp(Parent)
  const parent = app.mount(host)
  const input = host.children[0].children[0]
  const select = host.children[0].children[1]
  assert.equal(input.value, 'before')
  input.value = 'after'
  input.listeners.input({ target: input })
  await nextTick()
  assert.equal(input.value, 'after')
  assert.equal(parent.input, 'after')
  const [first, second] = select.options
  first.selected = false
  second.selected = true
  select.listeners.change({ target: select })
  await nextTick()
  assert.equal(second.selected, true)
  assert.equal(select.options.find((option) => option.selected).value, 'second')
  assert.equal(parent.select, 'second')
  parent.input = 'reset'
  parent.select = 'first'
  await nextTick()
  assert.equal(input.value, 'reset')
  assert.equal(select.options.find((option) => option.selected).value, 'first')
  app.unmount()
})
