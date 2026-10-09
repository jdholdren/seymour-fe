<template>
  <component
    :is="as"
    class="rounded-lg text-foreground"
    :class="[tones[tone], paddings[padding], { 'border border-border': bordered }]"
  >
    <slot />
  </component>
</template>

<script setup>
import { surfaceTones as tones, surfacePaddings as paddings } from './styles.js'
defineProps({
  as: { type: String, default: 'div' },
  tone: { type: String, default: 'raised', validator: (value) => value in tones },
  padding: { type: String, default: 'md', validator: (value) => value in paddings },
  bordered: { type: Boolean, default: true },
})
</script>
