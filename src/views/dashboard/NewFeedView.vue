<template>
  <div id="container">
    <TextInput name="url" label="URL" v-model="url" class="max-w-xl" />
    <div v-if="fetching">
      <VueSpinner />
    </div>
    <StyledButton v-else id="submit" label="Subscribe" :disabled="url.length == 0" @click="onSubmit" class="mt-2" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import useApiFetch from '@/api/useApiFetch';
import { useRouter } from 'vue-router'

import StyledButton from '@/components/StyledButton.vue';
import TextInput from '@/components/TextInput.vue';
import { VueSpinner } from 'vue3-spinners';

const url = ref("")

const { fetching, call: submit } = useApiFetch("POST", `/api/subscriptions`)
async function onSubmit() {
  if (!url.value) return

  await submit({ feed_url: url.value })

  const router = useRouter()
  router.push({ name: 'subscriptions' })
}
</script>
