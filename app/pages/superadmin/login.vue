<template>
  <div class="h-screen flex bg-brand-bg overflow-hidden">
    <div class="w-full md:w-1/2 flex flex-col justify-center px-8 py-12 bg-white">
      <div class="max-w-md w-full mx-auto space-y-8">
        <h1 class="text-4xl font-extrabold text-brand-blue mb-2">Superadmin Access</h1>
        <p class="text-brand-green mb-8">Manage roles and permissions for Kwentas Klaras</p>
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <input
              v-model="email"
              type="email"
              class="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
              placeholder="superadmin@example.com"
              required
            />
          </div>
          <div class="space-y-2">
            <input
              v-model="password"
              type="password"
              class="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
              placeholder="Password"
              required
            />
          </div>
          <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
          <button
            type="submit"
            :disabled="loading"
            style="background-color: #2563EB;"
            class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:[background-color:#22C98D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Signing in...
            </span>
            <span v-else>Sign In</span>
          </button>
        </form>
      </div>
    </div>
    <div class="hidden md:flex w-1/2 relative overflow-hidden">
      <div class="absolute inset-0 bg-gray-300 opacity-60 z-0"></div>
      <div class="absolute inset-0 bg-brand-blue opacity-20 z-10"></div>
      <img src="/images/loginlogo.jpg" alt="Municipality of Boljoon Logo" class="w-full h-full object-cover relative z-20" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSuperadminAuth } from '~/composables/superadmin/useSuperadminAuth'

definePageMeta({
  layout: false,
})

const email = ref('')
const password = ref('')
const { login, loading, errorMessage, refreshSession } = useSuperadminAuth()

onMounted(async () => {
  const ok = await refreshSession()
  if (ok) {
    await navigateTo('/superadmin')
  }
})

const handleSubmit = async () => {
  await login(email.value, password.value)
}
</script>
