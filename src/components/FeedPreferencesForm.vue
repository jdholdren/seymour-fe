<template>
  <section class="space-y-5" aria-label="Feed preferences">
    <KitText>
      Set an account-wide prompt to guide which articles appear across all your subscriptions.
      Changes apply to new articles only; articles already in your feed are not affected.
    </KitText>

    <KitAlert v-if="!loaded && error" tone="danger">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <span>{{ error }}</span>
        <KitButton variant="outline" size="sm" :disabled="loading" @click="onRetry">
          Try again
        </KitButton>
      </div>
    </KitAlert>
    <KitAlert v-else-if="loaded && error" tone="danger">{{ error }}</KitAlert>
    <KitAlert v-if="success" tone="info">{{ success }}</KitAlert>

    <template v-if="loaded">
      <KitFormField
        id="feed-preferences-prompt"
        label="Prompt"
        help="Leave this empty to show articles unfiltered."
      >
        <template #default="{ control }">
          <textarea
            v-bind="control"
            :value="draft"
            :disabled="loading || saving"
            rows="9"
            class="block min-h-56 w-full resize-y rounded-md bg-surface-raised px-3 py-3 text-sm text-foreground outline-1 -outline-offset-1 outline-border placeholder:text-muted focus:outline-2 focus:-outline-offset-2 focus:outline-primary-faded disabled:cursor-not-allowed disabled:bg-surface-container disabled:text-muted aria-invalid:outline-danger"
            placeholder="Describe the articles you want to see..."
            @input="onChange($event.target.value)"
          />
        </template>
      </KitFormField>

      <div class="flex flex-wrap items-center justify-between gap-3">
        <KitButton
          variant="outline"
          size="sm"
          :disabled="saving || loading"
          @click="onInsertExample"
        >
          Insert example
        </KitButton>
        <div class="flex flex-wrap gap-2">
          <KitButton variant="outline" :disabled="!dirty || saving || loading" @click="onDiscard">
            Discard changes
          </KitButton>
          <KitButton :disabled="!dirty || saving || loading" :loading="saving" @click="onSave">
            Save prompt
          </KitButton>
        </div>
      </div>
    </template>
    <p v-else-if="loading" class="text-sm text-muted" role="status">Loading preferences…</p>
  </section>
</template>

<script setup>
import KitAlert from '@/components/kit/KitAlert.vue'
import KitButton from '@/components/kit/KitButton.vue'
import KitFormField from '@/components/kit/KitFormField.vue'
import KitText from '@/components/kit/KitText.vue'

defineProps({
  draft: { type: String, default: '' },
  dirty: { type: Boolean, default: false },
  loaded: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  saving: { type: Boolean, default: false },
  error: { type: String, default: '' },
  success: { type: String, default: '' },
  onChange: { type: Function, required: true },
  onSave: { type: Function, required: true },
  onDiscard: { type: Function, required: true },
  onInsertExample: { type: Function, required: true },
  onRetry: { type: Function, required: true },
})
</script>
