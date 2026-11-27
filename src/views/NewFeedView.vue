<template>
  <div class="flex w-full max-w-2xl flex-col">
    <RouterLink
      :to="{ name: 'subscriptions' }"
      class="mb-6 w-fit rounded-sm text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      ← Back to feeds
    </RouterLink>

    <KitPageHeader
      title="Add a feed"
      description="Follow a publication and keep its latest stories in one place."
      class="py-0"
    />

    <form class="mt-8 flex flex-col gap-6" @submit.prevent="onSubmit">
      <div>
        <h2 class="text-lg font-semibold text-foreground">Where should we look?</h2>
        <p class="mt-2 text-sm leading-6 text-muted">
          Paste a feed URL, or the publication’s website and we’ll find its feed for you.
        </p>
      </div>

      <KitFormField
        id="url"
        label="Publication or feed URL"
        help="For example, https://example.com or https://example.com/feed.xml"
        :error="error?.message"
      >
        <template #default="{ control }">
          <KitInput v-bind="control" v-model="url" type="url" name="url" placeholder="https://" />
        </template>
      </KitFormField>

      <div class="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-xs leading-5 text-muted">You can unsubscribe any time.</p>
        <KitButton type="submit" :disabled="url.trim().length === 0" :loading="fetching">
          {{ fetching ? 'Adding feed…' : 'Add feed' }}
        </KitButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
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
  if (!url.value || fetching.value) return
  error.value = undefined

  await submit({ feed_url: url.value })

  if (statusCode.value >= 200 && statusCode.value < 300) {
    await getViewer()

    router.push({ name: 'subscriptions' })
  }
}
</script>
