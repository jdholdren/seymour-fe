<template>
  <div :role="tone === 'danger' ? 'alert' : 'status'" class="rounded-md p-4" :class="tones[tone]">
    <slot />
  </div>
</template>

<script setup>
import { alertTones as tones } from './styles.js'
defineProps({ tone: { type: String, default: 'info', validator: (value) => value in tones } })
</script>
