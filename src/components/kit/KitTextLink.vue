<template>
  <component :is="to != null ? RouterLink : 'a'" v-bind="destination" :class="textLinkClasses"
    ><slot
  /></component>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { textLinkClasses } from './styles.js'
const props = defineProps({
  to: { type: [String, Object], default: undefined },
  href: { type: String, default: undefined },
})
const destination = computed(() => (props.to != null ? { to: props.to } : { href: props.href }))
</script>
