<template>
  <KitFormField :id="themeId" label="Theme" inline v-slot="{ control }">
    <KitSelect v-bind="control" :model-value="preference" @change="setTheme($event.target.value)">
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </KitSelect>
  </KitFormField>
</template>

<script setup>
import { useId } from 'vue'
import KitFormField from '@/components/kit/KitFormField.vue'
import KitSelect from '@/components/kit/KitSelect.vue'
import useTheme from '@/use/useTheme'

const { preference, setTheme } = useTheme()
const themeId = useId()
</script>
