<template>
  <section id="left">
    <div id="left-inner">
      <h1>Almost there!</h1>
      <h2>Just need an invite code</h2>
      <p>
        <TextInput id="code" label="Invite code" v-model="code" />
        <Button @click="submit" label="Register" :disabled="disabled" />
        <span class="error">{{ error }}</span>
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import useApiFetch from '@/api/useApiFetch'

import Button from "@/components/StyledButton.vue"
import TextInput from "@/components/TextInput.vue"
import router from "@/router";

const code = ref("")
const error = ref("")

const disabled = computed(() => { return code.value.length < 14 })

const { statusCode, call: submitCode } = useApiFetch("POST", "/api/users/")
async function submit() {
  await submitCode({
    invite_code: code.value
  })
  if (statusCode === 409) {
    router.push("/")
    return
  }
  if (statusCode != 202) {
    error.value = "Invalid invite code"
    return
  }

  // Redirect to the dashboard
  router.push("/")
}
</script>

<style scoped>
h1 {
  font-size: 4rem;
}

/** TODO: Breakpoint for mobile background **/
#left {
  height: 100vh;
  width: 60vw;
  max-width: 860px;

  display: flex;
  align-items: flex-end;
  flex-direction: column;

  padding-top: 35vh;

  background-color: var(--c-green);

  color: var(--vt-c-white);
}

#left-inner {
  padding-right: 10rem;
}

#left p {
  margin-top: 3rem;
}

Button {
  width: 100%;
  margin-top: 16px;
}

#code {
  width: 100%;
}

.error {
  color: #f00;
}
</style>
