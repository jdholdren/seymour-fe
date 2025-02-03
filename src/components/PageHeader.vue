<template>
  <h1>{{title}}</h1>
</template>

<script setup>
defineProps(["title"])
</script>

<style scoped>
h1 {
  font-size: 5rem;
  font-weight: 800;

  color: var(--color-heading);
}
</style>
