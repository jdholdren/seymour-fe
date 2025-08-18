<template>
  <button :class="{ disabled }"><span class="label">{{ label || "unlabled" }}</span></button>
</template>

<script setup>
defineProps(["label", "disabled"])
</script>

<style scoped>
button {
  width: 100%;
  max-height: 48px;
  padding: 12px;
  padding-left: 24px;
  padding-right: 24px;

  border-radius: 32px;
  border: 1px solid var(--color-background-mute);

  font-size: 1.1rem;

  background-color: var(--color-background-mute);
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
