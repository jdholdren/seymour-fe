<template>
  <div class="flex flex-col gap-6">
    <KitPageHeader title="Settings" />
    <section class="max-w-xs">
      <ThemeSelector />
    </section>
  </div>
</template>

<script setup>
import KitPageHeader from '@/components/kit/KitPageHeader.vue'
import ThemeSelector from '@/components/ThemeSelector.vue'
</script>
