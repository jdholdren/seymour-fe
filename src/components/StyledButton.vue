<template>
  <button :class="{ disabled }"><span class="label">{{ label || "unlabled" }}</span></button>
</template>

<script setup>
defineProps(["label", "disabled"])
</script>

<style scoped>
button {
  font-size: 1.0rem;
  padding: 8px 24px 8px 24px;

  border-radius: 32px;
  border: 1px solid rgba(0, 0, 0, 0.2);

  background-color: rgba(0, 0, 0, 0.3);
  color: rgba(255, 255, 255, 1);
  /** TODO: Transitions **/
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
  background-color: rgba(0, 0, 0, 0.2);
  cursor: initial;
}
</style>
