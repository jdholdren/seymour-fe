<template>
  <KitSurface
    tone="secondary"
    padding="lg"
    :bordered="false"
    class="flex flex-col items-center justify-center py-16 text-center"
  >
    <div v-if="$slots.icon" aria-hidden="true" class="text-subtle mb-4"><slot name="icon" /></div>
    <KitHeading class="mb-2">{{ title }}</KitHeading>
    <KitText tone="muted">{{ description }}</KitText>
    <div v-if="$slots.action" class="mt-6"><slot name="action" /></div>
  </KitSurface>
</template>

<script setup>
import KitSurface from './KitSurface.vue'
import KitHeading from './KitHeading.vue'
import KitText from './KitText.vue'
defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
})
</script>
