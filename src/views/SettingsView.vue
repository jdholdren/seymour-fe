<template>
  <div class="flex flex-col gap-6">
    <KitPageHeader title="Settings" description="Choose how Seymour looks for you." />
    <section aria-labelledby="appearance-heading" class="max-w-md">
      <h2 id="appearance-heading" class="font-serif text-xl">Appearance</h2>
      <p class="mt-1 text-sm text-muted">Choose a theme or follow your system setting.</p>
      <ThemeSelector class="mt-4 max-w-xs" />
    </section>
  </div>
</template>

<script setup>
import KitPageHeader from '@/components/kit/KitPageHeader.vue'
import ThemeSelector from '@/components/ThemeSelector.vue'
</script>
