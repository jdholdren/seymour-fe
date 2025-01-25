<template>
  <section id="left">
    <div id="left-inner">
      <h1>Almost there!</h1>
      <h2>Just need an invite code</h2>
      <Transition>
        <div v-if="fetching">
          <VueSpinner />
        </div>
        <div v-else>
          <TextInput id="code" label="Invite code" v-model="code" />
          <Button @click="submit" label="Register" :disabled="disabled" />
          <span class="error">{{ error }}</span>
        </div>
      </Transition>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import useApiFetch from '@/api/useApiFetch'

import Button from "@/components/StyledButton.vue"
import TextInput from "@/components/TextInput.vue"
import router from "@/router";

import { VueSpinner } from 'vue3-spinners';
import { getViewer } from "@/me";

const code = ref("")
const error = ref("")

const disabled = computed(() => { return code.value.length < 14 })

const { fetching, statusCode, call: submitCode } = useApiFetch("POST", "/api/users/")
async function submit() {
  // Reset for the next request
  error.value = ""

  await submitCode({
    invite_code: code.value
  })

  const scode = statusCode.value
  if (scode === 409) {
    // Go back through the loop
    router.push("/")
    return
  }
  if (scode === 400) {
    error.value = "Invalid invite code"
    return
  }
  if (scode >= 500) {
    error.value = "Temporary server error"
    return
  }

  await getViewer()

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
