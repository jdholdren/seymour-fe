<template>
  <div id="container">
    <div id="headline">
      <h1>Read</h1>
      <h1>What</h1>
      <h1>Matters.</h1>
      <h2>The RSS reader, curated by you.</h2>
      <div id="form">
        <Button :style="{ marginTop: '1rem' }" class="gradient" label="Sign in with Github ↗" @click="sso" />
      </div>
    </div>
    <h2 :style="{ marginTop: '20vh' }">How it works</h2>
    <StepSection heading="01. Curated by AI"
      description="Your feed is catered by an LLM that you control. Tell it what you want and what you don't." />
    <StepSection heading="02. Design that doesn't get in the way"
      description="Beautiful, minimal design that doesn't distract from your reading experience." />
    <StepSection heading="03. Offline first"
      description="The offline experience is first party, not an afterthought. Your feed works anywhere you do." />
  </div>
</template>

<script setup>
import Button from "@/components/StyledButton.vue"
import StepSection from "@/views/welcome/internal/StepSection.vue"

// TODO: Need a roadmap section

function sso() {
  // Go to the API for the redirect
  window.location.href = "/api/sso-login"
}
</script>

<style scoped>
#container {
  margin-left: var(--size-gutter);
}

#headline {
  padding-top: 20vh;
}
</style>
