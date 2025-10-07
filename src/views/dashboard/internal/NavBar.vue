<template>
  <div>
    <div class="p-4 text-4xl font-bold">Seymour</div>
    <ul>
      <RouterLink :to="{ name: 'account' }">
        <li :class="{ selected: $route.name === 'account' }" class="p-4 py-2">Account</li>
      </RouterLink>
      <RouterLink :to="{ name: 'subscriptions' }">
        <li :class="{ selected: $route.name === 'subscriptions' }" class="p-4 py-2">Subscriptions</li>
      </RouterLink>
    </ul>
    <h1 class="p-4 py-2 font-bold">Feeds</h1>
    <ul>
      <RouterLink :to="{ 'name': 'timeline' }">
        <li :class="{ selected: $route.name === 'timeline' }" class="p-4 py-2">All</li>
      </RouterLink>
    </ul>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>
