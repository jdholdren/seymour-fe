<template>
  <div class="flex flex-col gap-2">
    <label :for="name" class="block text-sm font-medium text-muted">{{ label }}</label>
    <div
      class="flex items-center rounded-md bg-surface-raised pl-3 outline-1 -outline-offset-1 outline-border has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-primary-faded"
    >
      <input
        :id="name"
        type="text"
        v-model="url"
        :name="label"
        :placeholder="placeholder"
        class="block min-w-0 grow py-2 text-base text-foreground placeholder:text-muted focus:outline-none sm:text-sm/6"
      />
    </div>
  </div>
</template>

<script setup>
const url = defineModel()
defineProps(['label', 'name', 'placeholder'])
</script>
