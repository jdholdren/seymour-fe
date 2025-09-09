<template>
  <button :class="{ disabled }" class="bg-sky-500 text-white cursor-pointer py-3 px-3 rounded-md"><span class="label">{{
    label ||
    "unlabled"
      }}</span></button>
</template>

<script setup>
defineProps(["label", "disabled"])
</script>
