import { computed, ref } from 'vue'

export const EXAMPLE_FEED_PROMPT =
  'Prioritize software engineering and distributed systems. Include technically detailed coverage of system design, databases, infrastructure, and reliability. Include substantive work on AI agents, including architectures, evaluation, tool use, and safety. Skip marketing announcements and shallow product promotion.'

const messageOf = (result, fallback) => result?.message || fallback

export default function useFeedPreferences({ readPrompt, writePrompt, refreshViewer }) {
  const draft = ref('')
  const savedPrompt = ref('')
  const loaded = ref(false)
  const loading = ref(false)
  const saving = ref(false)
  const error = ref('')
  const success = ref('')
  const dirty = computed(() => loaded.value && draft.value !== savedPrompt.value)

  async function load() {
    if (loading.value || saving.value) return false
    loading.value = true
    error.value = ''
    success.value = ''
    try {
      const result = await readPrompt()
      if (!result?.ok || typeof result.prompt !== 'string') {
        error.value = messageOf(result, 'Could not load your feed preferences.')
        return false
      }
      const prompt = result.prompt
      const wasDirty = dirty.value
      savedPrompt.value = prompt
      if (!wasDirty) draft.value = prompt
      loaded.value = true
      return true
    } catch (cause) {
      error.value = cause?.message || 'Could not load your feed preferences.'
      return false
    } finally {
      loading.value = false
    }
  }

  function changeDraft(value) {
    if (loading.value || saving.value) return
    draft.value = value
    error.value = ''
    success.value = ''
  }

  function discard() {
    if (!loaded.value || loading.value || saving.value) return
    draft.value = savedPrompt.value
    error.value = ''
    success.value = ''
  }

  function insertExample(confirmReplace) {
    if (loading.value || saving.value) return false
    if (draft.value.trim() && (typeof confirmReplace !== 'function' || !confirmReplace())) {
      return false
    }
    changeDraft(EXAMPLE_FEED_PROMPT)
    return true
  }

  async function save() {
    if (!loaded.value || !dirty.value || loading.value || saving.value) return false
    saving.value = true
    error.value = ''
    success.value = ''
    const submittedPrompt = draft.value.trim()
    try {
      const result = await writePrompt(submittedPrompt)
      if (!result?.ok) {
        error.value = messageOf(result, 'Could not save your feed preferences.')
        return false
      }

      // Refresh both server-owned views even if one request fails.
      const [readResult, viewerResult] = await Promise.allSettled([
        Promise.resolve().then(readPrompt),
        Promise.resolve().then(() => refreshViewer?.()),
      ])
      const readback = readResult.status === 'fulfilled' ? readResult.value : undefined
      if (!readback?.ok || typeof readback.prompt !== 'string') {
        const message =
          readResult.status === 'rejected' ? readResult.reason?.message : readback?.message
        error.value = `Your preferences were saved, but could not be confirmed: ${message || 'Could not read them back.'}`
        return false
      }

      const confirmedPrompt = readback.prompt
      savedPrompt.value = confirmedPrompt
      draft.value = confirmedPrompt
      if (viewerResult.status === 'rejected' || viewerResult.value === false) {
        error.value =
          'Your preferences were saved and confirmed, but your viewer could not be refreshed. Reload to update your timeline.'
        return false
      }
      success.value = 'Feed preferences saved.'
      return true
    } catch (cause) {
      error.value = cause?.message || 'Could not save your feed preferences.'
      return false
    } finally {
      saving.value = false
    }
  }

  return {
    draft,
    savedPrompt,
    loaded,
    loading,
    saving,
    error,
    success,
    dirty,
    load,
    changeDraft,
    discard,
    insertExample,
    save,
  }
}
