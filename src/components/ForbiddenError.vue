<template>
  <div class="w-fit absolute m-3 right-0">
    <KitAlert tone="danger">{{ message || "You don't have permission to do that." }}</KitAlert>
  </div>
</template>

<script setup>
import KitAlert from './kit/KitAlert.vue'

defineProps({ message: { type: String, default: '' } })
</script>
