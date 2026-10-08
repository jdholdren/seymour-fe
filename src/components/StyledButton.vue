<template>
  <button
    :disabled="disabled"
    @click="onClick"
    :class="{
      'bg-primary hover:bg-primary-dark cursor-pointer text-on-primary': !disabled,
      'bg-surface-container text-muted cursor-not-allowed': disabled,
      [textColor || '']: true,
    }"
    class="py-3 px-6 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-faded"
  >
    <span class="label">{{ label || 'unlabled' }}</span>
  </button>
</template>

<script setup>
const props = defineProps(['label', 'disabled', 'textColor'])
const emit = defineEmits(['click'])

function onClick(event) {
  if (props.disabled) return
  emit('click', event)
}
</script>
