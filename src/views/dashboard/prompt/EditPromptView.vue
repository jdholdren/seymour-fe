<template>
  <div class="mb-4">
    <label for="prompt" class="block text-sm font-medium text-gray-700 mb-2">
      Filtering Prompt
    </label>
    <textarea id="prompt" v-model="prompt.text" class="w-full h-64 px-3 py-2 border border-gray-300 rounded-md"
      placeholder="Enter your filtering prompt here... For example: 'Show me posts about technology, programming, and AI, but hide posts about celebrity gossip or sports.'"></textarea>

    <div class="text-sm" :class="{
      'text-red-600': prompt.text.length > maxCharacters,
    }">
      {{ prompt.text.length }} / {{ maxCharacters }} characters
    </div>
    <div v-if="prompt.error" class="text-sm text-red-600">
      {{ prompt.error.message }}
    </div>
  </div>
</template>

<script setup>
const maxCharacters = 5000
const prompt = defineModel('prompt')
</script>
