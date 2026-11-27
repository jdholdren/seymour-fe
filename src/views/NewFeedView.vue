<template>
  <form class="flex max-w-xl flex-col gap-6" @submit.prevent="onSubmit">
    <KitPageHeader
      title="Add a new feed"
      description="Bring a publication into your reading list."
    />
    <KitFormField id="url" label="Feed URL" :error="demoError || error?.message">
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
    <KitButton type="submit" :disabled="url.length == 0" :loading="fetching" class="w-fit">
      {{ fetching ? 'Subscribing…' : 'Subscribe' }}
    </KitButton>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import useApiFetch from '@/use/useApiFetch'
import { useRoute, useRouter } from 'vue-router'
import { useDemo } from '@/use/useDemo'

import KitButton from '@/components/kit/KitButton.vue'
import KitFormField from '@/components/kit/KitFormField.vue'
import KitInput from '@/components/kit/KitInput.vue'
import KitPageHeader from '@/components/kit/KitPageHeader.vue'

import { getViewer, userPath } from '@/me'

const url = ref('')
const route = useRoute()

const {
  fetching,
  call: submit,
  error,
  statusCode,
} = useApiFetch('POST', route.meta.demo ? '' : userPath('/subscriptions'))
const router = useRouter()
const demo = useDemo()
const demoError = ref('')

async function onSubmit() {
  if (!url.value || fetching.value) return
  error.value = undefined

  if (route.meta.demo) {
    demoError.value = demo.addFeed({ url: url.value })
      ? ''
      : 'Enter a valid feed URL that is not already in your list.'
    if (!demoError.value) router.push({ name: 'demo-feeds' })
    return
  }

  await submit({ feed_url: url.value })

  if (statusCode.value >= 200 && statusCode.value < 300) {
    await getViewer()

    router.push({ name: 'subscriptions' })
  }
}
</script>
