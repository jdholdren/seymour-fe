# AGENTS.md

Guidance for working in this repo.

- Run `npm run format` (prettier) before committing any changes.

## Design guidelines

- Keep the interface calm, readable, and content-focused. Use muted teal for
  everyday actions, links, active states, and focus indicators.
- Light mode uses white page backgrounds, cards, and inputs, with very light
  neutral gray for secondary sections and hover/disabled surfaces. Keep teal
  out of surface fills. Use desaturated teal borders for separation and dark
  charcoal text with subtle teal undertones.
- Dark mode uses neutral slate surfaces with lighter muted teal accents.
- Use the shared semantic color tokens in `src/assets/main.css` and their
  Tailwind utilities rather than hard-coded colors in components. Preserve
  consistent hover, focus, disabled, and error states in both themes.
- Maintain accessible text and control contrast, visible keyboard focus, and
  clear visual hierarchy. Do not rely on color alone to convey meaning.

### AI features

- Reserve indigo-to-violet gradients for AI-specific features so they remain
  distinct from ordinary teal actions. Do not use teal in the AI gradient.
- Keep gradients localized to AI icons, badges, or subtle borders rather than
  large backgrounds. Use clear labels or icons to identify AI functionality;
  the gradient should reinforce that meaning, not be its only indicator.
- Check AI styling in both light and dark modes. This is the direction for
  future AI features, not a requirement to add gradients to existing UI.

## State in child components

- A child component (a list item, a card, a form section — anything rendered
  by a parent/container) is a dumb, presentational view of state materialized
  by that parent. It doesn't own fetch state (`useApiFetch` calls,
  loading/error refs) and doesn't call the API directly.
- Mutations are triggered through a function the parent owns — curried with
  whatever identifies the target when there are multiple instances (e.g.
  `:on-unsubscribe="() => unsubscribe(subscription.id)"` for a list item) —
  and passes down as a prop, not through emitted events the parent has to
  interpret.
- After a mutative call succeeds, don't hand-edit local state (splicing an
  array, patching a field) to reflect the change. Re-fetch the affected state
  from the server instead, so the UI reflects server truth rather than an
  assumed edit. Re-fetch anything else derived from the same server state too
  (e.g. `getViewer()` after subscription changes, since `TimelineView`'s feed
  filter reads from it).
