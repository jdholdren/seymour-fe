<template>
  <section>
    <p>
      <label for="email">Email</label>
      <span id="email" class="account-value tooltip">{{ viewer.email }}
        <span class="tooltiptext">Cannot be changed</span>
      </span>
    </p>
    <p>
      <label for="name">Name</label>
      <span id="name" class="account-value tooltip">{{ viewer.name }}
        <span class="tooltiptext">Editable in a future release</span>
      </span>
    </p>
    <p>
      <label for="since">Active Since</label>
      <span id="since" class="account-value">{{ since }}</span>
    </p>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { getViewer, loaded, viewer } from '@/me'

async function getDetails() {
  if (!loaded) return

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

.account-value {
  display: block;
  width: fit-content;
}
</style>
