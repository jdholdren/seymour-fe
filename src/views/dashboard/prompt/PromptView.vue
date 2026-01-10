<template>
  <div class="min-w-2xl">
    <h1 class="text-5xl font-bold">Curation Prompt</h1>
    <ConsentView v-if="page === 0" class="my-4" />
    <EditPromptView v-else-if="page === 1" v-model:prompt="promptData" class="my-4" />
    <SuccessView v-else-if="page === 2" class="my-4" />
    <FormBottom v-if="page < 2" v-model="page" :canProceed="canProceed" :max="2" @incr="page++" @decr="page--"
      @submit="submit" />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { viewer } from '@/me'
import useApiFetch from '@/api/useApiFetch'

import ConsentView from './ConsentView.vue'
import EditPromptView from './EditPromptView.vue'
import FormBottom from '@/components/FormBottom.vue'
import SuccessView from './SuccessView.vue'

const page = ref(0)

// Prompt state
const promptData = ref({
  text: viewer.value?.prompt || '',
  error: null
})
const promptChecked = ref(false)
const { call: precheck, statusCode, error: promptErr } = useApiFetch('POST', '/api/account/prompt:precheck')
const { call: postPrompt } = useApiFetch('POST', '/api/account/prompt')

let debounceTimer = null
const debouncePrecheck = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    await precheck({ prompt: promptData.value.text })
    promptData.value.error = promptErr.value
    promptChecked.value = true
  }, 500)
}

// Watch for prompt changes and debounce validation
watch(() => promptData.value.text, () => {
  statusCode.value = undefined
  promptChecked.value = false
  promptData.value.error = null
  debouncePrecheck()
})

// Simplified canProceed logic
const canProceed = computed(() => {
  if (page.value === 0) return true
  if (page.value === 1) {
    return promptData.value.text.length > 0 && promptChecked.value && statusCode.value === 200
  }
  return false
})

// Submit handler
async function submit() {
  await postPrompt({ prompt: promptData.value.text })
  page.value = 2
}
</script>
