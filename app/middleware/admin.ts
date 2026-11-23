import { useAuthStore } from '~/stores/authStore'
import { canAbilityAccessPath, findFirstAllowedAdminPath } from '~/utils/adminNavAccess'

export default defineNuxtRouteMiddleware(async () => {
  if (process.server) {
    return navigateTo('/auth/login', { replace: true })
  }

  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login', { replace: true })
  }

  if (!canAbilityAccessPath(authStore.ability.value, '/admin/users')) {
    const fallback = findFirstAllowedAdminPath(authStore.ability.value) || '/admin'
    return navigateTo(fallback, { replace: true })
  }
})
