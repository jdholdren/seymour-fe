<template>
  <div :class="inline ? 'grid grid-cols-[auto_1fr] items-center gap-2' : 'flex flex-col gap-2'">
    <label :for="id" class="text-sm font-medium text-muted">{{ label }}</label>
    <slot :control="control" />
    <KitText
      v-if="help"
      :id="`${id}-help`"
      size="small"
      tone="muted"
      :class="{ 'col-span-2': inline }"
      >{{ help }}</KitText
    >
    <KitText
      v-if="error"
      :id="`${id}-error`"
      size="small"
      tone="danger"
      role="alert"
      :class="{ 'col-span-2': inline }"
    >
      {{ error }}
    </KitText>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import KitText from './KitText.vue'
const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  help: { type: String, default: '' },
  error: { type: String, default: '' },
  inline: Boolean,
})
const control = computed(() => ({
  id: props.id,
  'aria-describedby':
    [props.help && `${props.id}-help`, props.error && `${props.id}-error`]
      .filter(Boolean)
      .join(' ') || undefined,
  'aria-invalid': props.error ? 'true' : undefined,
}))
</script>
