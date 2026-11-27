<template>
  <div>
    <div
      class="h-2 overflow-hidden rounded-full bg-rule"
      role="progressbar"
      :aria-valuenow="normalizedValue"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="label"
    >
      <div
        class="h-full rounded-full bg-mint transition-all duration-300"
        :style="{ width: `${normalizedValue}%` }"
      ></div>
    </div>
    <p v-if="caption" class="mt-3 text-sm text-muted">{{ caption }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: Number, required: true },
  label: { type: String, default: 'Progress' },
  caption: { type: String, default: '' },
})

const normalizedValue = computed(() => Math.min(100, Math.max(0, props.value)))
</script>
