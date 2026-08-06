<template>
  <div class="flex flex-col gap-2 bg-white rounded-lg p-5 border border-surface-container">
    <div class="text-lg font-semibold text-gray-900 line-clamp-1">
      {{ subscription.feed_name }}
    </div>
    <div class="text-sm text-gray-600 line-clamp-3">{{ subscription.feed_description }}</div>
    <div class="text-xs text-gray-400 pt-2 mt-1 border-t border-surface-container">
      Last synced: {{ formatLastSynced(subscription.last_synced) }}
    </div>
  </div>
</template>

<script setup>
defineProps(['subscription'])

function formatLastSynced(lastSynced) {
  // Handle cases where server returns 0, null, undefined, or empty string
  if (!lastSynced || lastSynced === 0) {
    return 'Never'
  }

  const date = new Date(lastSynced)

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date'
  }

  const seconds = Math.round((Date.now() - date.getTime()) / 1000)

  if (seconds < 0) {
    return 'Just now'
  }
  if (seconds < 60) {
    return 'Just now'
  }

  const minutes = Math.round(seconds / 60)
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  }

  const hours = Math.round(minutes / 60)
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  }

  const days = Math.round(hours / 24)
  if (days < 30) {
    return `${days} day${days === 1 ? '' : 's'} ago`
  }

  const months = Math.round(days / 30)
  if (months < 12) {
    return `${months} month${months === 1 ? '' : 's'} ago`
  }

  const years = Math.round(months / 12)
  return `${years} year${years === 1 ? '' : 's'} ago`
}
</script>
