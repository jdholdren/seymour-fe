<template>
  <div>
    <PageHeader :title="'Account Settings'" />
    <div class="my-6 p-4 rounded-md bg-white w-md border-slate-400 border-1">
      <h1 class="font-bold">Account Details</h1>
      <table class="table-auto">
        <tbody>
          <tr>
            <td>Email</td>
            <td>{{ viewer.email }}</td>
          </tr>
          <tr>
            <td>Active Since</td>
            <td>{{ since }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="my-6 p-4 rounded-md bg-white w-sm border-slate-400 border-1">
      <h1 class="font-bold">Account Actions</h1>
      <a href="/api/logout">
        <li>Log Out</li>
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { viewer } from '@/me'
import PageHeader from '@/components/PageHeader.vue'

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
