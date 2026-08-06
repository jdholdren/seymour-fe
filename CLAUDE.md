# CLAUDE.md

Guidance for working in this repo.

- Run `npm run format` (prettier) before committing any changes.

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
