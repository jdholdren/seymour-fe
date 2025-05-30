<template>
  <div id="container">
    <div :style="{ paddingRight: '16rem' }">
      <h1>Read</h1>
      <h1>What</h1>
      <h1>Matters.</h1>
      <h2>The RSS reader, simplified.</h2>
      <div id="form">
        <Button :style="{ marginTop: '1rem' }" class="gradient" label="Sign in with Github" @click="sso" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from "@/components/StyledButton.vue"

function sso() {
  // Go to the API for the redirect
  window.location.href = "/api/sso-login"
}
</script>

<style scoped>
#container {
  display: flex;
  align-items: flex-start;
  justify-content: center;

  padding-top: 20vh;
}

h1 {
  font-size: 6rem;
  line-height: 5rem;
  font-weight: bold;
}
</style>
