<template>
  <div class="bg-surface-container flex  rounded-sm p-2">
    <StyledButton v-if="page != 0" label="Previous" class="justify-self-start" @click="page--"/>
    <StyledButton v-if="page < max - 1" label="Next" :disabled="!canProceed" class="ml-auto" @click="page++"/>
    <StyledButton v-if="page == max - 1" label="Submit" :disabled="!canProceed" class="ml-auto" @click="emit('submit')"/>
  </div>
</template>

<script setup>
import StyledButton from '@/components/StyledButton.vue';

defineProps({
  max: {
    type: Number,
    required: true
  },
  canProceed: {
    type: Boolean,
    required: true
  }
})

const page = defineModel()
const emit = defineEmits(['submit']);
</script>
