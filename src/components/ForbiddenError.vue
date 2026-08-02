<template>
  <div class="w-fit absolute p-8 bg-red-600 text-white rounded m-3 right-0">
    <span>{{ forbiddenErr || "You don't have permission to do that." }}</span>
  </div>
</template>

<script setup>
import { useForbiddenError } from '@/use/forbiddenErr'

const forbiddenErr = useForbiddenError()
</script>
