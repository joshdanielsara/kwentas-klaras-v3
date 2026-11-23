const email = ref<string | null>(null)
const loading = ref(false)

export const useSuperadminAuthStore = () => {
  const isAuthenticated = computed(() => !!email.value)

  const setSuperadmin = (value: { email: string } | null) => {
    email.value = value?.email ?? null
  }

  const clearSuperadmin = () => {
    email.value = null
  }

  return {
    email: readonly(email),
    loading: readonly(loading),
    isAuthenticated,
    setSuperadmin,
    clearSuperadmin,
  }
}
