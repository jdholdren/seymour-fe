<template>
  <TextInput name="url" label="URL" v-model="url" />
  <div v-if="fetching">
    <VueSpinner />
  </div>
  <StyledButton v-else :style="{ marginTop: '2rem' }" class="success" label="Subscribe" :disabled="url.length == 0"
    @click="onSubmit" />
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

<style scoped>
h1 {
  font-size: 5rem;
  font-weight: 800;
}

:deep(input) {
  min-width: 40rem;
}
</style>
