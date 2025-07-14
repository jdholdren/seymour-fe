<template>
  <div class='item'>
    <hr />
    <h3>{{ subscription.feed_name }}</h3>
    <h4>{{ subscription.feed_description }}</h4>
  </div>
</template>

<script setup>
defineProps(['subscription'])
</script>

<style scoped>
.item {
  margin-bottom: 1rem;
}

hr {
  margin-bottom: 1rem;
}

h3 {
  line-height: 2rem;
}
</style>
