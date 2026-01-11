import { UserRole } from '~/enums/UserRole'
import { useAuthStore } from '~/stores/authStore'

export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) {
    return navigateTo('/auth/login', { replace: true })
  }

  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login', { replace: true })
  }

  if (authStore.userRole.value !== UserRole.ADMIN) {
    return navigateTo('/admin', { replace: true })
  }
})
