<template>
  <div class="flex flex-col gap-2">
    <label :for="name" class="block text-sm font-medium text-gray-600">{{ label }}</label>
    <div
      class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-primary"
    >
      <input
        :id="name"
        type="text"
        v-model="url"
        :name="label"
        :placeholder="placeholder"
        class="block min-w-0 grow py-2 text-base text-black placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
      />
    </div>
  </div>
</template>

<script setup>
const url = defineModel()
defineProps(['label', 'name', 'placeholder'])
</script>
