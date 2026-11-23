import type { RoleOption } from '~/types/rbac/role'
import { useAuthHeaders } from '~/composables/auth/useAuthHeaders'
import { UserRole } from '~/enums/UserRole'

export const useRoleOptions = () => {
  const roles = ref<RoleOption[]>([])
  const loading = ref(false)
  const errorMessage = ref('')

  const fetchRoleOptions = async () => {
    loading.value = true
    errorMessage.value = ''
    try {
      const headers = await useAuthHeaders()
      const response = await $fetch<{ success: boolean; roles: RoleOption[] }>('/api/roles', {
        headers,
      })
      roles.value = response.roles || []
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string }
      errorMessage.value = err.data?.message || err.message || 'Failed to load roles'
      console.error('[useRoleOptions] fetch failed', { error: errorMessage.value })
      roles.value = [
        { id: 'fallback-admin', slug: UserRole.ADMIN, name: 'Admin', isSystem: true },
        { id: 'fallback-staffs', slug: UserRole.STAFFS, name: 'Staff', isSystem: true },
      ]
    } finally {
      loading.value = false
    }
  }

  return {
    roles,
    loading,
    errorMessage,
    fetchRoleOptions,
  }
}
