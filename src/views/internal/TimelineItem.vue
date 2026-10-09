<template>
  <KitSurface class="w-full">
    <KitText size="small" tone="muted">
      {{ props.entry.feed_name }} &#183; {{ formatDate(props.entry.publish_date) }}
    </KitText>
    <KitHeading as="h2" size="compact">{{ props.entry.title }}</KitHeading>
    <KitText tone="muted" class="line-clamp-2">{{ props.entry.description }}</KitText>
  </KitSurface>
</template>

<script setup>
import { defineProps } from 'vue'
import KitSurface from '@/components/kit/KitSurface.vue'
import KitHeading from '@/components/kit/KitHeading.vue'
import KitText from '@/components/kit/KitText.vue'

const props = defineProps({
  entry: {
    type: Object,
    required: true,
  },
})

function formatDate(publishDate) {
  // Handle cases where server returns 0, null, undefined, or empty string
  if (!publishDate || publishDate === 0) {
    return 'No date'
  }

  const date = new Date(publishDate)

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date'
  }

  return date.toLocaleDateString()
}
</script>
