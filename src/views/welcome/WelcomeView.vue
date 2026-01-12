<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Hero Section -->
    <div class="w-full flex justify-center pt-20 pb-16">
      <div class="max-w-4xl p-16 text-center">
        <h1 class="text-7xl font-bold text-gray-900 mb-6">Read what matters.</h1>
        <h2 class="text-2xl text-gray-700 mb-8 leading-relaxed">
          RSS feeds enhanced by AI filtering. Create prompts that reveal the most relevant
          content from all your favorite sources.
        </h2>
        <Button class="bg-primary hover:bg-primary-dark text-white px-8 py-4 text-lg font-semibold transition-colors"
          label="Sign in with Github" @click="sso" />
      </div>
    </div>

    <!-- What This App Does Section -->
    <div class="w-full bg-white py-20">
      <div class="max-w-4xl mx-auto px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-6">Your RSS feeds, intelligently filtered</h2>
          <div class="max-w-3xl mx-auto text-lg text-gray-700 leading-relaxed space-y-6">
            <p>
              I built this because RSS feeds weren't working for me. I'd subscribe to great sources, then end up
              glossing over most of the content because only a fraction was actually relevant to what I cared about.
            </p>
            <p>
              LLMs got good enough at understanding natural language that filtering feeds seemed like an obvious thing
              to try. Instead of being overwhelmed by everything in your feeds, you can be in control of exactly what
              makes it to your attention.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- How It Works Section -->
    <div class="w-full bg-gray-50 py-20">
      <div class="max-w-4xl mx-auto px-8">
        <h2 class="text-4xl font-bold text-gray-900 text-center mb-16">How it works</h2>
        <div class="grid md:grid-cols-3 gap-12">
          <div class="text-center">
            <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl font-bold text-white">1</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Create Smart Prompts</h3>
            <p class="text-gray-700">
              Write simple prompts describing what you want to see. Anthropic's AI understands context
              and filters content based on your specific interests.
            </p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl font-bold text-white">2</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Add Your Feeds</h3>
            <p class="text-gray-700">
              Connect all your favorite RSS feeds from blogs, news sites, podcasts, and more.
              Manage everything in one clean dashboard.
            </p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl font-bold text-white">3</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Read What Matters</h3>
            <p class="text-gray-700">
              Get a curated feed of only the most relevant articles. No noise, no clutter,
              just the content you actually want to read.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Screenshots Section -->
    <div class="w-full bg-white py-20">
      <div class="max-w-4xl mx-auto px-8">
        <h2 class="text-4xl font-bold text-gray-900 text-center mb-16">See it in action</h2>
        <div class="space-y-16">
          <!-- Dashboard screenshot -->
          <div class="rounded-lg shadow-lg overflow-hidden max-w-3xl mx-auto">
            <img src="/dashboard_sample.png" alt="RSS Dashboard showing organized feeds" class="w-full h-auto">
          </div>

          <!-- Prompt filtering screenshot -->
          <div class="rounded-lg shadow-lg overflow-hidden max-w-3xl mx-auto">
            <img src="/prompt_sample.png" alt="AI prompt creation and filtering interface" class="w-full h-auto">
          </div>
        </div>
      </div>
    </div>

    <!-- Final CTA Section -->
    <div class="w-full bg-primary py-20">
      <div class="max-w-4xl mx-auto px-8 text-center">
        <h2 class="text-4xl font-bold text-white mb-6">Ready to read smarter?</h2>
        <p class="text-xl text-blue-100 mb-8">
          Join the future of RSS reading. Less noise, more signal.
        </p>
        <Button class="bg-white hover:bg-gray-100 text-primary px-8 py-4 text-lg font-semibold transition-colors"
          label="Get Started with Github" @click="sso" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from "@/components/StyledButton.vue"

function sso() {
  // Go to the API for the redirect
  window.location.href = import.meta.env.VITE_API_HOST + "/api/sso-login"
}
</script>
