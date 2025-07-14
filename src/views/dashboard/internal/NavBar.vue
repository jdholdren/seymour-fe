<template>
  <ul>
    <RouterLink :to="{ 'name': 'read' }">
      <li :class="{ selected: $route.name === 'read' }">Your Feed</li>
    </RouterLink>
    <RouterLink :to="{ name: 'subscriptions' }">
      <li :class="{ selected: $route.name === 'subscriptions' }">Subscriptions</li>
    </RouterLink>
    <RouterLink :to="{ name: 'account' }">
      <li :class="{ selected: $route.name === 'account' }">Account</li>
    </RouterLink>
    <a href="/sso/logout">
      <li>Log Out↗</li>
    </a>
  </ul>
</template>

<script setup>
import { RouterLink } from 'vue-router';

</script>

<style scoped>
ul {
  margin: 0px;
  padding: 0px;
  padding-right: 32px;
  text-decoration: none;
  list-style: none;
  border-right: 2px solid var(--color-text);
}

a {
  text-decoration: none;
}

li {
  color: var(--color-text);
}

li.selected {
  text-decoration: underline;
}
</style>
