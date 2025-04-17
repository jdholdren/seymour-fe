<template>
  <div id="container">
    <section id="left">
      <div>
        <h1>Read</h1>
        <h1>What</h1>
        <h1>Matters.</h1>
        <h2>The RSS reader, simplified.</h2>
        <div id="form">
          <Button :style="{ marginTop: '1rem' }" class="gradient" label="Sign in with Github" @click="sso" />
        </div>
      </div>
    </section>

    <img id="right" src="/landing.jpg">
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
  height: 100vh;

  display: flex;
  align-items: flex-start;
}

img {
  flex-grow: 1;
  max-height: 100vh;
}

h1 {
  font-size: 6rem;
  line-height: 5rem;
  font-weight: bold;
}

/** TODO: Breakpoint for mobile background **/
#left {
  height: 100vh;
  width: 60vw;
  max-width: 960px;

  display: flex;
  align-items: center;
  flex-direction: column;

  padding-top: 30vh;

  background-color: var(--c-green);

  color: var(--vt-c-white);
}

#form {
  margin-top: 2rem;
}
</style>
