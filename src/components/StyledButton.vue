<template>
  <button :class="{ disabled }"><span class="label">{{ label || "unlabled" }}</span></button>
</template>

<script setup>
defineProps(["label", "disabled"])
</script>

<style scoped>
button {
  font-size: 1.3rem;

  border: 0;
  text-decoration: underline;

  background-color: rgba(0, 0, 0, 0.0);
  color: var(--color-text);
}

button .label {
  line-height: 24px !important;
  height: 24px !important;
}

button:hover {
  cursor: pointer;
}

button:active {
  background-color: rgba(0, 0, 0, 0.5);
}

button.disabled {
  color: rgba(0, 0, 0, 0.3);
  cursor: initial;
}
</style>
