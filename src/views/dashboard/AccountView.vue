<template>
  <div>
    <div class="py-8">
      <h1 class="text-5xl font-bold">Account Details</h1>
    </div>
    <h1 class="font-bold">Info</h1>
    <div class="min-w-2xl my-6 mt-0.5 p-4 rounded-md bg-white w-md border-slate-400 border-1">
      <table>
        <tbody>
          <tr>
            <td class="font-bold">Email</td>
            <td>{{ viewer.email }}</td>
          </tr>
          <tr>
            <td class="font-bold">Active Since</td>
            <td>{{ since }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <h1 class="font-bold">Account Actions</h1>
    <div class="min-w-2xl my-6 mt-0.5 p-4 rounded-md bg-white w-md border-slate-400 border-1">
      <table>
        <tbody>
          <tr>
            <td class="cursor-pointer font-bold"><span class="color-primary">Log Out</span></td>
            <td>Add some help text here</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { viewer } from '@/me'

const since = computed(() => {
  if (!viewer.value.created_at) return

  const parsed = new Date(viewer.value.created_at)
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  return parsed.toLocaleDateString(undefined, options)
})
</script>


<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0.5rem;
}
</style>
