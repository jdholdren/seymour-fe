<template>
  <div class="w-full flex justify-center mt-[20vh]">
    <div class="max-w-3xl p-16 text-center">
      <h1 class="text-7xl block">Read what matters.</h1>
      <h2 class="text-2xl my-3 block">RSS feeds enhanced by AI filtering. Create prompts that reveal the most relevant
        content from all your favorite sources.</h2>
      <Button class="my-6 bg-primary text-white" label="Sign in with Github" @click="sso" />
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
