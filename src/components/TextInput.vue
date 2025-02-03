<template>
  <label :for="name">{{ label }}</label>
  <input :id="name" type="text" v-model="model" />
</template>

<script setup>
const model = defineModel()
defineProps(["label", "name"])
</script>

<style scoped>
label {
  display: block;
  font-weight: 800;
}

input {
  display: block;
  padding: 16px;

  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.2);

  font-size: 1rem;
}

input:active {
  border: 1px solid rgba(0, 0, 0, 0.5);
}
</style>
