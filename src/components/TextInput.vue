<template>
  <input type="text" v-model="model" :placeholder="label" />
</template>

<script setup>
const model = defineModel()
defineProps(["label"])
</script>

<style scoped>
input {
  padding: 16px;

  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.2);

  font-size: 1rem;
}

input:active {
  border: 1px solid rgba(0, 0, 0, 0.5);
}
</style>
