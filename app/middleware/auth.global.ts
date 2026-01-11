import { useAuthStore } from '~/stores/authStore'

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/auth/login') {
    return
  }

  if (process.server) {
    if (to.path.startsWith('/admin')) {
      return navigateTo('/auth/login', { replace: true })
    }
    return
  }

  const authStore = useAuthStore()

  if (to.path.startsWith('/admin')) {
    if (!authStore.isAuthenticated) {
      return navigateTo('/auth/login', { replace: true })
    }
  }
})
