<template>
  <component :is="as" class="text-foreground" :class="sizes[size]"><slot /></component>
</template>

<script setup>
import { headingSizes as sizes } from './styles.js'
defineProps({
  as: {
    type: String,
    default: 'h2',
    validator: (value) => /^h[1-6]$/.test(value),
  },
  size: { type: String, default: 'section', validator: (value) => value in sizes },
})
</script>
