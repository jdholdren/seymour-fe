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
  font-weight: 700;
}

input {
  display: block;
  padding: 16px;
  margin-top: 0.75rem;

  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.5);

  font-size: 1rem;
}

input:focus {
  border: 1px solid rgba(0, 0, 0, 0.8);
  outline: none;
}
</style>
