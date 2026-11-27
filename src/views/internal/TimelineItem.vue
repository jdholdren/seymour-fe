<template>
  <article
    class="group grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-4 border-b border-rule py-5 sm:grid-cols-[2.5rem_minmax(0,1fr)] sm:gap-5"
  >
    <span
      class="mt-1 flex size-7 items-center justify-center rounded-full border border-mint text-xs text-primary"
      role="img"
      :aria-label="entry.read ? 'Read' : 'Unread'"
    >
      <span v-if="entry.read" aria-hidden="true">✓</span>
    </span>
    <div class="min-w-0">
      <h2
        class="font-serif text-xl leading-snug text-foreground group-hover:text-primary-faded sm:text-2xl"
      >
        {{ entry.title }}
      </h2>
      <p class="mt-1 text-sm text-muted">
        {{ entry.feed_name }}
        <span class="mx-1" aria-hidden="true">·</span>
        {{
          entry.reading_minutes
            ? `${entry.reading_minutes} min`
            : formatDate(entry.published_at || entry.publish_date)
        }}
      </p>
      <p
        v-if="showDescription && entry.description"
        class="mt-2 line-clamp-2 text-sm leading-relaxed text-muted"
      >
        {{ entry.description }}
      </p>
    </div>
  </article>
</template>

<script setup>
defineProps({ entry: { type: Object, required: true }, showDescription: Boolean })

function formatDate(publishDate) {
  if (!publishDate || publishDate === 0) return 'No date'
  const date = new Date(publishDate)
  return isNaN(date.getTime())
    ? 'No date'
    : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>
