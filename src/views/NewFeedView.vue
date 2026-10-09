<template>
  <div class="flex flex-col gap-6 max-w-xl">
    <KitPageHeader title="Add a new subscription" />
    <KitFormField id="url" label="URL" :error="error?.message || urlError">
      <template #default="{ control }">
        <KitInput
          v-bind="control"
          v-model="url"
          type="url"
          name="url"
          placeholder="https://example.com/feeds.xml"
        />
      </template>
    </KitFormField>
    <KitButton :disabled="url.length == 0" :loading="fetching" class="w-fit" @click="onSubmit">
      {{ fetching ? 'Subscribing…' : 'Subscribe' }}
    </KitButton>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import useApiFetch from '@/use/useApiFetch'
import { useRouter } from 'vue-router'

import KitButton from '@/components/kit/KitButton.vue'
import KitFormField from '@/components/kit/KitFormField.vue'
import KitInput from '@/components/kit/KitInput.vue'
import KitPageHeader from '@/components/kit/KitPageHeader.vue'

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
