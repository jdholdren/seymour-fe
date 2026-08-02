<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-8">
    <h1 class="text-4xl font-bold text-gray-900">Seymour</h1>
    <Button
      class="bg-primary hover:bg-primary-dark text-white px-8 py-4 text-lg font-semibold transition-colors"
      label="Log in with GitHub"
      @click="loginWithGithub"
    />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

import Button from '@/components/StyledButton.vue'

const route = useRoute()

function loginWithGithub() {
  const host = window.__CONFIG__?.VITE_API_HOST || import.meta.env.VITE_API_HOST || ''
  const redirect = route.query.redirect || '/'
  window.location.href = `${host}/api/oauth-login/gh?s=${encodeURIComponent(redirect)}`
}
</script>
