import { useSuperadminAuth } from '~/composables/superadmin/useSuperadminAuth'
import { useSuperadminAuthStore } from '~/stores/superadminAuthStore'

export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) {
    return
  }

  if (to.path === '/superadmin/login') {
    return
  }

  const store = useSuperadminAuthStore()
  if (store.isAuthenticated.value) {
    return
  }

  const { refreshSession } = useSuperadminAuth()
  const ok = await refreshSession()
  if (!ok) {
    return navigateTo('/superadmin/login')
  }
})
