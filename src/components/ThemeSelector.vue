<template>
  <label class="flex items-center gap-2 text-sm text-muted">
    <span>Theme</span>
    <select
      :value="preference"
      class="rounded-md bg-surface-raised px-3 py-2 text-foreground outline-1 -outline-offset-1 outline-border focus:outline-2 focus:outline-primary-faded"
      @change="setTheme($event.target.value)"
    >
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
</template>

<script setup>
import useTheme from '@/use/useTheme'

const { preference, setTheme } = useTheme()
</script>
