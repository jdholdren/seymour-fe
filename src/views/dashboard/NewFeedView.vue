<template>
  <div id="container">
    <TextInput name="url" label="URL" v-model="url" />
    <div v-if="fetching">
      <VueSpinner />
    </div>
    <StyledButton v-else id="submit" class="success" label="Subscribe" :disabled="url.length == 0" @click="onSubmit" />
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

<style scoped>
#container {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  grid-template-rows: 1fr 1fr;
  row-gap: 24px;
}

h1 {
  font-size: 5rem;
  font-weight: 800;
}

#submit {
  grid-row: 2;
  grid-column: 6 / span 3;
}
</style>
