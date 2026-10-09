<template>
  <div class="w-fit absolute m-3 right-0">
    <KitAlert tone="danger">An error occurred with our servers.</KitAlert>
  </div>
</template>

<script setup>
import KitAlert from './kit/KitAlert.vue'
// TODO: Interact with the global error state with a dismissal button
</script>
