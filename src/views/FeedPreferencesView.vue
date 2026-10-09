<template>
  <div class="flex max-w-2xl flex-col gap-6">
    <KitPageHeader
      title="Feed preferences"
      description="Tell Seymour which articles are worth your attention."
    />
    <FeedPreferencesForm
      :draft="draft"
      :dirty="dirty"
      :loaded="loaded"
      :loading="loading"
      :saving="saving"
      :error="error"
      :success="success"
      :on-change="changeDraft"
      :on-save="save"
      :on-discard="discard"
      :on-insert-example="confirmInsertExample"
      :on-retry="load"
    />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import FeedPreferencesForm from '@/components/FeedPreferencesForm.vue'
import KitPageHeader from '@/components/kit/KitPageHeader.vue'
import useFeedPreferences from '@/use/useFeedPreferences'
import useApiFetch from '@/use/useApiFetch'
import { createFeedPreferencesApi } from '@/use/feedPreferencesApi'
import { getViewer, userPath } from '@/me'

const { readPrompt, writePrompt } = createFeedPreferencesApi(
  useApiFetch,
  userPath('/feed-preferences'),
)

const {
  draft,
  dirty,
  loaded,
  loading,
  saving,
  error,
  success,
  load,
  changeDraft,
  discard,
  insertExample,
  save,
} = useFeedPreferences({ readPrompt, writePrompt, refreshViewer: getViewer })

function confirmInsertExample() {
  insertExample(() => window.confirm('Replace your current draft with the example prompt?'))
}

onBeforeRouteLeave(() => {
  if (saving.value) return false
  if (dirty.value) return window.confirm('Discard your unsaved feed preferences?')
})

function beforeUnload(event) {
  if (!dirty.value && !saving.value) return
  event.preventDefault()
  event.returnValue = ''
}

onMounted(() => {
  window.addEventListener('beforeunload', beforeUnload)
  load()
})
onBeforeUnmount(() => window.removeEventListener('beforeunload', beforeUnload))
</script>
