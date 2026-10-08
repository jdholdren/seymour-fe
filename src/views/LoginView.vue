<template>
  <div
    class="relative min-h-screen flex flex-col items-center justify-center gap-8 bg-surface text-foreground"
  >
    <ThemeSelector class="absolute right-4 top-4" />
    <h1 class="text-4xl font-bold text-foreground">Seymour</h1>
    <Button
      class="bg-primary hover:bg-primary-dark text-on-primary px-8 py-4 text-lg font-semibold transition-colors"
      label="Log in with GitHub"
      @click="loginWithGithub"
    />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

import Button from '@/components/StyledButton.vue'
import ThemeSelector from '@/components/ThemeSelector.vue'

const route = useRoute()

function loginWithGithub() {
  const host = window.__CONFIG__?.VITE_API_HOST || import.meta.env.VITE_API_HOST || ''
  const redirect = route.query.redirect || '/'
  window.location.href = `${host}/api/oauth-login/gh?s=${encodeURIComponent(redirect)}`
}
</script>
