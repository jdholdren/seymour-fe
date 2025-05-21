<template>
  <ul>
    <RouterLink :to="{ 'name': 'read' }">
      <li :class="{ selected: $route.name === 'read' }"><v-icon class="icon" name="bi-grid-1x2-fill" />Read</li>
    </RouterLink>
    <RouterLink :to="{ name: 'subscriptions' }">
      <li :class="{ selected: $route.name === 'subscriptions' }"><v-icon class="icon"
          name="bi-grid-1x2-fill" />Subscriptions</li>
    </RouterLink>
    <RouterLink :to="{ name: 'account' }">
      <li :class="{ selected: $route.name === 'account' }"><v-icon class="icon" name="bi-grid-1x2-fill" />Account
        Settings</li>
    </RouterLink>
    <a href="/sso/logout">
      <li><v-icon class="icon" name="bi-grid-1x2-fill" />Log Out</li>
    </a>
  </ul>
</template>

<script setup>
import { RouterLink } from 'vue-router';


</script>

<style scoped>
ul {
  padding: 0;

  text-decoration: none;
  list-style: none;
}

li {
  padding: 8px 24px 8px 24px;
  border: 1px solid rgba(0, 0, 0, 0);

  color: var(--color-text);
}

li:hover {
  color: var(--color-text-hover);
}

li.selected {
  background-color: var(--color-background);
  border-radius: 4px;
}

.icon {
  margin-right: 0.5rem;
}
</style>
