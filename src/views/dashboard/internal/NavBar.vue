<template>
  <div class="navbar">
    <div class="logo">Seymour</div>
    <ul>
      <RouterLink :to="{ 'name': 'timeline' }">
        <li :class="{ selected: $route.name === 'timeline' }">Your Feed</li>
      </RouterLink>
      <RouterLink :to="{ name: 'subscriptions' }">
        <li :class="{ selected: $route.name === 'subscriptions' }">Subscriptions</li>
      </RouterLink>
      <RouterLink :to="{ name: 'account' }">
        <li :class="{ selected: $route.name === 'account' }">Account</li>
      </RouterLink>
      <a href="/api/logout">
        <li>Log Out↗</li>
      </a>
    </ul>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.navbar {
  width: 15rem;
  border-right: 2px solid var(--color-text);
}

.logo {
  padding-left: 2rem;
  margin-bottom: 1.5rem;

  font-size: 1.5rem;
  font-weight: bold;

  color: #333;
}

ul {
  margin: 0px;
  padding: 0px;
  text-decoration: none;
  list-style: none;
}

a {
  text-decoration: none;
}

li {
  width: 100%;
  height: 3rem;
  line-height: 3rem;
  color: var(--color-text);

  padding-left: 2rem;
  padding-right: 2rem;
}

li.hover {
  background: var(--color-background-mute);
}

li.selected {
  background: var(--color-background-soft);
}
</style>
