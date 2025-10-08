<template>
  <button :class="{ disabled }" class="cursor-pointer py-3 px-6 rounded-4xl bg-primary text-white"><span
      class="label">{{
        label ||
        "unlabled"
      }}</span></button>
</template>

<script setup>
defineProps(["label", "disabled"])
</script>
