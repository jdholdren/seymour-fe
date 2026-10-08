<template>
  <div class="flex flex-col gap-6 max-w-xl">
    <div class="py-8">
      <h1 class="text-5xl font-bold">Add a new subscription</h1>
    </div>
    <div class="flex flex-col gap-2">
      <TextInput name="url" label="URL" placeholder="https://example.com/feeds.xml" v-model="url" />
      <p v-if="error?.message" class="text-sm text-danger">{{ error.message }}</p>
      <p v-if="urlError" class="text-sm text-danger">{{ urlError }}</p>
    </div>
    <VueSpinner v-if="fetching" class="my-2" />
    <StyledButton
      v-else
      id="submit"
      label="Subscribe"
      :disabled="url.length == 0"
      @click="onSubmit"
      class="w-fit"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import useApiFetch from '@/use/useApiFetch'
import { useRouter } from 'vue-router'
import { VueSpinner } from 'vue3-spinners'

import StyledButton from '@/components/StyledButton.vue'
import TextInput from '@/components/TextInput.vue'

import { getViewer, userPath } from '@/me'

const url = ref('')

const {
  fetching,
  call: submit,
  error,
  statusCode,
} = useApiFetch('POST', userPath('/subscriptions'))
const router = useRouter()

async function onSubmit() {
  if (!url.value) return
  error.value = undefined

  await submit({ feed_url: url.value })

  if (statusCode.value >= 200 && statusCode.value < 300) {
    await getViewer()

    router.push({ name: 'subscriptions' })
  }
}

const regex = new RegExp(
  /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi,
)
const urlError = computed(() => {
  if (!url.value || url.value.match(regex)) return undefined
  return 'Invalid URL'
})
</script>
