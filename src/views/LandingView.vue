<template>
  <div class="min-h-screen bg-surface text-foreground">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:absolute focus:z-20 focus:bg-surface focus:p-4"
      >Skip to content</a
    >
    <header class="border-b border-border/40">
      <div
        class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 px-6 py-5 sm:px-10"
      >
        <a href="#" aria-label="Seymour home" class="text-3xl font-bold tracking-tight"
          >Seymour<span class="text-primary-faded">.</span></a
        >
        <nav aria-label="Main navigation" class="flex flex-wrap items-center gap-5 text-sm">
          <a href="#how-it-works" class="hidden text-muted hover:text-foreground sm:block"
            >How it works</a
          >
          <a href="#api" class="hidden text-muted hover:text-foreground sm:block">API</a>
          <ThemeSelector />
          <KitButton @click="getStarted">{{
            isLoggedIn ? 'Open timeline →' : 'Get started →'
          }}</KitButton>
        </nav>
      </div>
    </header>

    <main id="main" class="mx-auto max-w-6xl px-6 sm:px-10">
      <section class="hero py-20 text-center sm:py-24" aria-labelledby="hero-heading">
        <h1
          id="hero-heading"
          class="text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl"
        >
          Your feed.<br /><span class="text-primary-faded">Your rules.</span>
        </h1>
        <p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
          Seymour uses AI to read your RSS feeds and find what matters to you.<br
            class="hidden sm:block"
          />
          Just describe what you’re interested in, and let Seymour handle the filtering.
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-4">
          <KitButton @click="getStarted">{{
            isLoggedIn ? 'Open your timeline →' : 'Get started →'
          }}</KitButton>
          <KitButtonLink href="#how-it-works" variant="outline">See how it works ↓</KitButtonLink>
        </div>
      </section>

      <section
        id="how-it-works"
        class="section-rule grid gap-10 py-12 md:grid-cols-2 md:gap-16"
        aria-labelledby="sources-heading"
      >
        <div>
          <p class="eyebrow mb-4">01 / Set your preferences</p>
          <KitHeading id="sources-heading" size="marketing">
            Just tell Seymour<br />what you want.
          </KitHeading>
          <p class="mt-5 text-lg leading-relaxed text-muted">
            Forget complicated filters, keywords, and endless configuration. Write a prompt
            describing the kind of articles you care about, in your own words.
          </p>
          <p class="mt-4 text-lg leading-relaxed text-muted">
            Be as specific or broad as you’d like. You’re in control of what makes it into your
            feed.
          </p>
        </div>
        <aside class="self-center" aria-label="Example filtering prompt">
          <blockquote
            class="space-y-5 border-l-4 border-primary-faded pl-6 font-mono text-base leading-relaxed text-muted sm:pl-8 sm:text-lg"
          >
            <p>“I’m interested in software engineering, distributed systems, and AI agents.</p>
            <p>
              Prioritize deep technical articles, original research, and real-world engineering
              experience.
            </p>
            <p>Skip generic listicles, marketing, and product announcements.”</p>
          </blockquote>
        </aside>
      </section>

      <section class="section-rule py-12" aria-labelledby="timeline-heading">
        <p class="eyebrow mb-4">02 / AI evaluates your feeds</p>
        <KitHeading id="timeline-heading" size="marketing">
          Only the articles<br />worth your attention.
        </KitHeading>
        <p class="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          As new articles arrive, Seymour evaluates each one against your instructions, approving
          relevant stories and filtering out the rest.
        </p>
        <div class="mt-7 grid gap-4 md:grid-cols-3">
          <KitSurface
            v-for="article in articles"
            :key="article.title"
            as="article"
            :tone="article.approved ? 'raised' : 'secondary'"
            padding="md"
            bordered
          >
            <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span class="uppercase tracking-wide text-muted">{{ article.source }}</span>
              <span :class="article.approved ? 'text-primary-faded' : 'text-muted'">{{
                article.approved ? '✓ Approved' : '⊗ Rejected'
              }}</span>
            </div>
            <KitHeading
              as="h3"
              size="card"
              class="mt-4"
              :class="article.approved ? '' : 'text-muted'"
            >
              {{ article.title }}
            </KitHeading>
            <p class="mt-3 leading-relaxed text-muted">{{ article.description }}</p>
          </KitSurface>
        </div>
      </section>

      <KitSurface
        as="section"
        tone="secondary"
        padding="none"
        bordered
        id="api"
        class="relative mt-16 mb-16 grid w-full scroll-mt-6 gap-8 rounded-2xl border-border/30 p-8 sm:mt-24 sm:p-12 md:grid-cols-[minmax(0,1fr)_auto] md:gap-x-12 lg:p-14"
        aria-labelledby="start-heading"
      >
        <div
          aria-hidden="true"
          class="absolute -top-6 left-8 flex h-12 w-16 items-center justify-center rounded-lg border border-border/40 bg-surface font-mono text-xl font-semibold text-primary-faded sm:left-12"
        >
          &lt;/&gt;
        </div>
        <div class="pt-2">
          <p class="eyebrow mb-5 flex items-center gap-3">
            <span aria-hidden="true" class="h-px w-8 bg-primary-faded/50"></span>
            For developers
          </p>
          <KitHeading id="start-heading" size="marketing" class="max-w-[18ch]">
            Built to work with your tools.
          </KitHeading>
          <p class="mt-5 max-w-lg leading-relaxed text-muted">
            Seymour is API-first under the hood. Build integrations, automate reading workflows, or
            make something entirely your own.
          </p>
        </div>
        <div
          class="flex items-end border-t border-border/25 pt-6 md:border-t-0 md:border-l md:pl-8 md:pt-0"
        >
          <KitButtonLink
            href="https://github.com/jdholdren/seymour#readme"
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            class="shrink-0"
            >Explore API access →</KitButtonLink
          >
        </div>
      </KitSurface>
    </main>

    <footer
      class="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 px-6 pb-8 text-xs text-muted sm:px-10"
    >
      <p>© {{ new Date().getFullYear() }} Seymour</p>
    </footer>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import KitButton from '@/components/kit/KitButton.vue'
import KitButtonLink from '@/components/kit/KitButtonLink.vue'
import KitSurface from '@/components/kit/KitSurface.vue'
import KitHeading from '@/components/kit/KitHeading.vue'
import ThemeSelector from '@/components/ThemeSelector.vue'
import { isLoggedIn } from '@/me'
import { normalizeReturnPath } from '@/use/authNavigation'

const route = useRoute()
const router = useRouter()
const articles = [
  {
    source: 'Engineering blog',
    approved: true,
    title: 'Building a durable event processing system',
    description:
      'An in-depth exploration of production-grade messaging architecture and its practical tradeoffs.',
  },
  {
    source: 'Research journal',
    approved: true,
    title: 'Long-term memory for autonomous agents',
    description:
      'A novel research approach to how AI agents retain and retrieve knowledge over time.',
  },
  {
    source: 'Tech daily',
    approved: false,
    title: 'Top 10 must-have productivity apps',
    description: 'A roundup of popular applications and familiar productivity tips.',
  },
]

function getStarted() {
  const redirect = normalizeReturnPath(route.query.redirect)
  if (isLoggedIn.value) {
    router.push(redirect)
    return
  }
  const host = window.__CONFIG__?.VITE_API_HOST || import.meta.env.VITE_API_HOST || ''
  window.location.href = `${host}/api/oauth-login/gh?s=${encodeURIComponent(redirect)}`
}
</script>

<style scoped>
@reference '../assets/main.css';

.hero {
  --color-primary: var(--color-hero-primary);
  --color-primary-dark: var(--color-hero-primary-dark);
  --color-primary-faded: var(--color-hero-accent);
  --color-on-primary: var(--color-on-hero-primary);
}

.eyebrow {
  @apply text-xs font-semibold uppercase tracking-[0.18em] text-primary-faded;
}

.section-rule {
  @apply scroll-mt-6 border-t border-border/40;
}

a:focus-visible {
  @apply rounded-sm outline-2 outline-offset-4 outline-primary-faded;
}
</style>
