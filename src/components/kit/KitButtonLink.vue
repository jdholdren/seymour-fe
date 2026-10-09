<template>
  <component
    :is="to != null ? RouterLink : 'a'"
    v-bind="destination"
    :class="[buttonClasses, buttonVariants[variant], buttonSizes[size]]"
  >
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { buttonClasses, buttonVariants, buttonSizes } from './styles.js'
const props = defineProps({
  to: { type: [String, Object], default: undefined },
  href: { type: String, default: undefined },
  variant: { type: String, default: 'primary', validator: (value) => value in buttonVariants },
  size: { type: String, default: 'md', validator: (value) => value in buttonSizes },
})
const destination = computed(() => (props.to != null ? { to: props.to } : { href: props.href }))
</script>
