# Kit components

`Kit` identifies generic, presentational design-system components. Import them
directly from `@/components/kit/KitName.vue`. Domain components (feed cards,
subscription actions, theme preferences) compose them and retain their own copy
and behavior. Kit components never fetch data or own mutation state.

## Foundations

- **KitSurface**: `as` (default `div`), `tone` (`default`, `secondary`, `raised`),
  `padding` (`none`, `sm`, `md`, `lg`), and `bordered` (default `true`). Consumers
  own layout and external spacing. Interactive surfaces belong inside links or
  buttons; focus and hover styles belong to that interactive element.
- **KitHeading**: `as` (`h1`–`h6`, default `h2`) selects semantic level independently
  of `size` (`page`, `section`, `card`, `compact`, `marketing`). Keep heading levels
  in document order. The landing hero retains its bespoke display styling.
- **KitText**: `as` (default `p`), `size` (`body`, `small`, `caption`), and `tone`
  (`default`, `muted`, `danger`). Use native markup for one-off typography rather
  than overriding a size with conflicting utility classes.
- **KitPageHeader**: `title`, optional `description`, and an `actions` slot.

## Actions

**KitButton** renders a native button with `type="button"` by default. It accepts
`variant` (`primary`, `outline`, `ghost`, `danger`), `size` (`sm`, `md`), `disabled`,
and `loading`. Loading disables the button without removing its label. Content
and icons use the default slot. A consumer should supply a meaningful busy label.

**KitButtonLink** shares variants and sizes but renders one link: pass `to` for
Vue Router or `href` for a native anchor. Never nest a button inside a link.
**KitTextLink** uses the same destination convention for inline links. Native
attributes such as `target`, `rel`, and accessible names pass through. For a new
tab, set `target="_blank" rel="noopener noreferrer"`.

## Fields

**KitFormField** owns a label plus optional `help` and `error`; `inline` places the
label beside the control (for compact toolbars such as the theme selector). Its scoped slot
provides `control` attributes to associate the field with its label and messages.
Every mounted field must have a unique `id` (Vue's `useId()` is useful for reusable
wrappers). **KitInput** supports native input types; **KitSelect** accepts option
elements in its default slot. Both pass native attributes and events through.

```vue
<KitFormField id="feed-url" label="URL" :error="urlError" v-slot="{ control }">
  <KitInput v-bind="control" v-model="url" type="url" name="url" />
</KitFormField>
```

For externally controlled filters, use `:model-value="value"` and a native
`@change` handler to preserve change-time commits. Do not pass native `:value`
to these wrappers; their internal `v-model` owns that binding.

## Feedback

- **KitEmptyState**: `title`, `description`, optional `icon` and `action` slots.
  The icon is decorative; the text communicates the meaning.
- **KitAlert**: `tone="info"` (status) or `tone="danger"` (alert). Overlay
  placement and the state deciding whether to show it belong to the consumer.

All shared classes in `styles.js` use the semantic tokens from
`src/assets/main.css`. Check changes in both themes and with keyboard navigation.
Keep hero accent overrides local and reserve AI gradients for explicitly
AI-specific treatments; ordinary surfaces stay neutral.
