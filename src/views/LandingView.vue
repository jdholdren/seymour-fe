<template>
  <div class="flex min-h-svh bg-surface p-3 text-foreground">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-20 focus:rounded-md focus:bg-surface focus:p-4 focus:text-foreground focus:outline-2 focus:outline-primary"
      >Skip to content</a
    >

    <div class="flex min-w-0 flex-1 flex-col lg:w-[63%] lg:flex-none">
      <header class="flex items-center justify-between gap-4 px-4 py-4 sm:px-8 sm:py-7 lg:px-10">
        <RouterLink to="/" aria-label="Seymour home" class="rounded-sm">
          <SeymourWordmark />
        </RouterLink>
        <ThemeSelector />
      </header>

      <main id="main" tabindex="-1" class="flex flex-1 items-center px-4 py-8 sm:px-8 lg:px-10">
        <section class="w-full max-w-md" aria-labelledby="login-heading">
          <h1
            id="login-heading"
            class="font-serif text-4xl font-normal leading-tight tracking-tight sm:text-5xl"
          >
            Sign in to Seymour
          </h1>
          <p class="mt-4 text-base leading-relaxed text-muted">
            Your thoughtful reading space is waiting.
          </p>

          <KitButton class="mt-8 w-full justify-center" size="lg" @click="signInWithGitHub">
            <PhGithubLogo aria-hidden="true" class="size-5" />
            Continue with GitHub
          </KitButton>
        </section>
      </main>
    </div>

    <aside class="art-panel hidden lg:block lg:w-[37%]" aria-hidden="true"></aside>
  </div>
</template>

<script setup>
import { PhGithubLogo } from '@phosphor-icons/vue'
import { useRoute } from 'vue-router'
import SeymourWordmark from '@/components/SeymourWordmark.vue'
import ThemeSelector from '@/components/ThemeSelector.vue'
import KitButton from '@/components/kit/KitButton.vue'
import { normalizeReturnPath } from '@/use/authNavigation'

const route = useRoute()

function signInWithGitHub() {
  const redirect = normalizeReturnPath(route.query.redirect)
  const host = window.__CONFIG__?.VITE_API_HOST || import.meta.env.VITE_API_HOST || ''
  window.location.href = `${host}/api/oauth-login/gh?s=${encodeURIComponent(redirect)}`
}
</script>

<style scoped>
@reference '../assets/main.css';

.art-panel {
  border-radius: 12px;
  background-color: var(--color-surface-container);
  background-image: radial-gradient(
      ellipse at 20% 18%,
      color-mix(in oklab, var(--color-primary-faded) 48%, transparent),
      transparent 55%
    ),
    radial-gradient(
      ellipse at 82% 82%,
      color-mix(in oklab, var(--color-primary) 42%, transparent),
      transparent 58%
    ),
    radial-gradient(
      ellipse at 65% 38%,
      color-mix(in oklab, var(--color-mint) 34%, transparent),
      transparent 56%
    ),
    repeating-radial-gradient(
      circle at 50% 50%,
      transparent 0 3px,
      color-mix(in oklab, var(--color-foreground) 3%, transparent) 3.5px 4px
    );
}

a:focus-visible {
  @apply outline-2 outline-offset-4 outline-primary-faded;
}
</style>
