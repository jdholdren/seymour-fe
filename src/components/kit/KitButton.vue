<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
    :class="[
      buttonClasses,
      buttonSizes[size],
      disabled || loading ? disabledButtonClasses : [buttonVariants[variant], 'cursor-pointer'],
    ]"
  >
    <span v-if="loading" aria-hidden="true" class="kit-spinner size-4 shrink-0" />
    <slot />
  </button>
</template>

<script setup>
import { buttonClasses, buttonVariants, buttonSizes, disabledButtonClasses } from './styles.js'
defineProps({
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary', validator: (value) => value in buttonVariants },
  size: { type: String, default: 'md', validator: (value) => value in buttonSizes },
  disabled: Boolean,
  loading: Boolean,
})
</script>

<style scoped>
.kit-spinner {
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: kit-spin 0.8s linear infinite;
}
@keyframes kit-spin {
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .kit-spinner {
    animation: none;
  }
}
</style>
