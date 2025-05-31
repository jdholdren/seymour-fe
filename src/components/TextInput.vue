<template>
  <label :for="name">{{ label }}</label>
  <input :id="name" type="text" v-model="url" />
</template>

<script setup>
const url = defineModel()
defineProps(["label", "name"])
</script>

<style scoped>
label {
  display: block;
  font-weight: 700;
}

input {
  display: block;
  margin-top: 0.75rem;

  outline: none;
  border: 0px;
  border-bottom: 1px solid var(--color-text);
  font-size: 1rem;

  background-color: rgb(0, 0, 0, 0.0);
  min-width: 320px;
}

input:focus {
  outline: none;
  border-bottom: 2px solid var(--color-text);
}
</style>
