<template>
  <button @click="onClick" :class="{
    'bg-primary': !disabled,
    'bg-primary-faded': disabled,
    'cursor-pointer': !disabled,
  }" class="py-3 px-6 rounded-sm text-white"><span class="label">{{
    label ||
    "unlabled"
      }}</span></button>
</template>

<script setup>
const props = defineProps(["label", "disabled"])
const emit = defineEmits(["click"])

function onClick(event) {
  if (props.disabled) return
  emit("click", event)
}
</script>
