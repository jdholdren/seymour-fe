# rss-fe

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Theme preferences

Choose System, Light, or Dark from the theme selector in the sidebar or on the
landing/login pages. System is the default and follows OS changes. Preferences
are saved locally in the browser and synchronized across tabs.

Theme colors live in `src/assets/main.css`; use its semantic color utilities for
new UI rather than fixed light-mode colors.

### Run theme tests

```sh
npm test
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```


### Feed preferences (frontend contract)

The authenticated `/preferences` page edits one account-wide prompt. It supports
explicit save/discard, example insertion, clearing the prompt, retrying failed
loads, and warnings before leaving with unsaved changes. Drafts are not persisted
in browser storage. Failed saves keep the draft.

The backend implementation is being developed separately. The frontend expects:

- `GET /api/users/{userID}/feed-preferences` → `200 { "prompt": "…" }`.
  No saved prompt is represented by `"prompt": ""`, not `null` or a missing field.
- `PUT /api/users/{userID}/feed-preferences` with `{ "prompt": "…" }` → `200`
  with a JSON body, or `204` without a body. An empty string clears the prompt.
  The frontend trims surrounding whitespace before submitting and re-fetches
  preferences and the viewer after a successful write.
- `GET /api/viewer` includes top-level `"feed_preferences": { "prompt": "…" }`
  for authenticated users. Missing/malformed preferences mean unknown, not empty.
- Routes must enforce session authentication and account ownership. Validation
  failures should return a JSON `{ "message": "…" }` with a non-success status.

A confirmed empty prompt makes the timeline default to all article statuses,
including pending articles, and shows the setup notice. A configured prompt
defaults to approved articles. Explicit status selections override either default.
Older APIs without viewer prompt state retain the approved default; unavailable
preferences endpoints show an error rather than pretending to save.

Saving a prompt alone does not implement AI evaluation. The editor's intended
contract is that changes apply only to articles added after saving; existing
decisions are preserved. The backend must snapshot/version the applicable prompt
at article intake so already queued articles do not acquire later instructions.

# TODO:
- [ ] Error handling
