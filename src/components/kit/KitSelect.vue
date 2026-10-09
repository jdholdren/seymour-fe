<template>
  <select v-model="model" :class="fieldClasses">
    <slot />
  </select>
</template>

<script setup>
import { fieldClasses } from './styles.js'
const model = defineModel({ type: [String, Number], default: '' })
</script>
