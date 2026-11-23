import { useSuperadminAuthStore } from '~/stores/superadminAuthStore'

export const useSuperadminAuth = () => {
  const store = useSuperadminAuthStore()
  const loading = ref(false)
  const errorMessage = ref('')

  const fetchCsrfHeaders = async (): Promise<Record<string, string>> => {
    const headers: Record<string, string> = {}
    try {
      const csrfResponse = await $fetch<{ success: boolean; csrfToken: string }>('/api/csrf-token')
      if (csrfResponse.success && csrfResponse.csrfToken) {
        headers['x-csrf-token'] = csrfResponse.csrfToken
      }
    } catch (error) {
      console.error('[useSuperadminAuth] failed to get CSRF token', {
        error: error instanceof Error ? error.message : 'unknown',
      })
    }
    return headers
  }

  const login = async (email: string, password: string) => {
    loading.value = true
    errorMessage.value = ''
    try {
      const response = await $fetch<{ success: boolean; superadmin: { email: string } }>(
        '/api/superadmin/auth/login',
        {
          method: 'POST',
          body: { email, password },
        }
      )
      if (response.success) {
        store.setSuperadmin(response.superadmin)
        await navigateTo('/superadmin')
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string }
      errorMessage.value = err.data?.message || err.message || 'Login failed'
      console.error('[useSuperadminAuth] login failed', { error: errorMessage.value })
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      const headers = await fetchCsrfHeaders()
      await $fetch('/api/superadmin/auth/logout', {
        method: 'POST',
        headers,
      })
    } catch (error) {
      console.error('[useSuperadminAuth] logout failed', {
        error: error instanceof Error ? error.message : 'unknown',
      })
    } finally {
      store.clearSuperadmin()
      await navigateTo('/superadmin/login')
    }
  }

  const refreshSession = async (): Promise<boolean> => {
    try {
      const response = await $fetch<{ success: boolean; superadmin: { email: string } }>(
        '/api/superadmin/auth/me'
      )
      if (response.success) {
        store.setSuperadmin(response.superadmin)
        return true
      }
      store.clearSuperadmin()
      return false
    } catch (error) {
      console.error('[useSuperadminAuth] session refresh failed', {
        error: error instanceof Error ? error.message : 'unknown',
      })
      store.clearSuperadmin()
      return false
    }
  }

  return {
    loading,
    errorMessage,
    isAuthenticated: store.isAuthenticated,
    email: store.email,
    login,
    logout,
    refreshSession,
    fetchCsrfHeaders,
  }
}
