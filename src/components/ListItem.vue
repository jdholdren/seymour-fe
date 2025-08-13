<template>
  <div class="list-item">
    <slot></slot>
  </div>
</template>

<script setup>
// defineProps(["label", "disabled"])
</script>

<style scoped>
.list-item {
  padding: 1rem;
  border-radius: 12px;
  background-color: var(--color-background-mute);
}
</style>
