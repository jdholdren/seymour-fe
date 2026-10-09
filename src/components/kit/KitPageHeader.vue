<template>
  <header class="flex flex-wrap items-end justify-between gap-4 py-8">
    <div class="min-w-0">
      <KitHeading as="h1" size="page">{{ title }}</KitHeading>
      <p v-if="description" class="mt-4 text-xl text-muted">
        {{ description }}
      </p>
    </div>
    <div v-if="$slots.actions"><slot name="actions" /></div>
  </header>
</template>

<script setup>
import KitHeading from './KitHeading.vue'
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
})
</script>
