<template>
  <ul>
    <li><v-icon class="icon" name="bi-grid-1x2-fill" />Your Subscriptions</li>
    <li><v-icon class="icon" name="bi-grid-1x2-fill" />New Subscription</li>
    <li><v-icon class="icon" name="bi-grid-1x2-fill" />Account Settings</li>
    <li @click="logout"><v-icon class="icon" name="bi-grid-1x2-fill" />Log Out</li>
  </ul>
</template>

<script setup>
function logout() {
  window.location.replace("/sso/logout")
}
</script >

<style scoped>
ul {
  padding: 0;

  text-decoration: none;
  list-style: none;
}

li {
  padding: 8px 24px 8px 24px;
  border: 1px solid rgba(0, 0, 0, 0);
}

li:hover {
  border: 1px solid var(--c-green);
  border-radius: 24px;

  cursor: pointer;
}

.icon {
  margin-right: 0.5rem;
}
</style>
