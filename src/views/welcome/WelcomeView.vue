<template>
  <div class="w-full content-center text-center">
    <div class="p-16">
      <h1 class="text-2xl">Read what matters.</h1>
      <Button class="my-5" label="Sign in with Github" @click="sso" />
    </div>
  </div>
</template>

<script setup>
import Button from "@/components/StyledButton.vue"

// TODO: Need a roadmap section

function sso() {
  // Go to the API for the redirect
  window.location.href = "/api/sso-login"
}
</script>
