<template>
  <input v-model="model" :type="type" :class="fieldClasses" />
</template>

<script setup>
import { fieldClasses } from './styles.js'
const model = defineModel({ type: [String, Number], default: '' })
defineProps({ type: { type: String, default: 'text' } })
</script>
