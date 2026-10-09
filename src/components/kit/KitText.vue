<template>
  <component :is="as" :class="[sizes[size], tones[tone]]"><slot /></component>
</template>

<script setup>
import { textSizes as sizes, textTones as tones } from './styles.js'
defineProps({
  as: { type: String, default: 'p' },
  size: { type: String, default: 'body', validator: (value) => value in sizes },
  tone: { type: String, default: 'default', validator: (value) => value in tones },
})
</script>
