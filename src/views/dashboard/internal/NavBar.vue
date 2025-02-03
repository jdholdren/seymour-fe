<template>
  <ul>
    <RouterLink :to="{ 'name': 'read' }">
      <li><v-icon class="icon" name="bi-grid-1x2-fill" />Read</li>
    </RouterLink>
    <RouterLink :to="{ name: 'manage-feeds' }">
      <li><v-icon class="icon" name="bi-grid-1x2-fill" />Manage Feeds</li>
    </RouterLink>
    <RouterLink :to="{ name: 'account' }">
      <li><v-icon class="icon" name="bi-grid-1x2-fill" />Account Settings</li>
    </RouterLink>
    <a href="/sso/logout"><li><v-icon class="icon" name="bi-grid-1x2-fill" />Log Out</li></a>
  </ul>
</template>

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

.icon {
  margin-right: 0.5rem;
}
</style>
