<template>
  <header>
    <h1>Your Subscriptions</h1>
  </header>
  <section>
    <div v-for="item in items" class="child">{{ item }}</div>
  </section>
</template>

<script setup>
const items = [1, 2, 3, 4, 5]
</script>

<style scoped>
h1 {
  font-size: 5rem;
  font-weight: 800;
}

/** The grid view of items **/
section {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}

.child {
  background-color: rgba(255, 255, 255, 0.3);
  height: 10rem;
}
</style>
