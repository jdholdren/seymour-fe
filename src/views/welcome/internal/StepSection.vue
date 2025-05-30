<template>
  <h3>{{ model.heading }}</h3>
  <p>
    {{ model.description }}
  </p>
</template>

<script setup>
const model = defineProps({
  heading: String,
  description: String,
})
</script>

<style scoped></style>
