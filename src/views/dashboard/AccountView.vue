<template>
  <section>
    <div class="account-grid">
      <div class="label"><label for="email">Email</label></div>
      <div class="value"><span id="email" class="account-value">{{ viewer.email }}</span></div>

      <div class="label"><label for="since">Active Since</label></div>
      <div class="value"><span id="since" class="account-value">{{ since }}</span></div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { getViewer, loaded, viewer } from '@/me'

async function getDetails() {
  if (loaded) return

  await getViewer()
}

const since = computed(() => {
  if (!viewer.value.created_at) return

  const parsed = new Date(viewer.value.created_at)
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  return parsed.toLocaleDateString(undefined, options)
})

getDetails()
</script>

<style scoped>
p {
  padding: 16px 16px 0 0;
}

label {
  color: var(--color-heading);
  font-weight: 800;
}

.account-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
}
</style>
