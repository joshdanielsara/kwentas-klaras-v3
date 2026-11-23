import type { PermissionItem } from '~/types/rbac/permission'
import { useSuperadminAuth } from './useSuperadminAuth'

export const usePermissions = () => {
  const { fetchCsrfHeaders } = useSuperadminAuth()
  const permissions = ref<PermissionItem[]>([])
  const loading = ref(false)
  const errorMessage = ref('')

  const fetchPermissions = async () => {
    loading.value = true
    errorMessage.value = ''
    try {
      const response = await $fetch<{ success: boolean; permissions: PermissionItem[] }>(
        '/api/superadmin/permissions'
      )
      permissions.value = response.permissions || []
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string }
      errorMessage.value = err.data?.message || err.message || 'Failed to load permissions'
      console.error('[usePermissions] fetch failed', { error: errorMessage.value })
    } finally {
      loading.value = false
    }
  }

  const createPermission = async (payload: {
    action: string
    subject: string
    label: string
    description?: string
  }) => {
    const headers = await fetchCsrfHeaders()
    const response = await $fetch<{ success: boolean; permission: PermissionItem }>(
      '/api/superadmin/permissions',
      {
        method: 'POST',
        headers,
        body: payload,
      }
    )
    return response.permission
  }

  const updatePermission = async (
    id: string,
    payload: { label?: string; description?: string | null }
  ) => {
    const headers = await fetchCsrfHeaders()
    const response = await $fetch<{ success: boolean; permission: PermissionItem }>(
      `/api/superadmin/permissions/${id}`,
      {
        method: 'PUT',
        headers,
        body: payload,
      }
    )
    return response.permission
  }

  const deletePermission = async (id: string) => {
    const headers = await fetchCsrfHeaders()
    await $fetch(`/api/superadmin/permissions/${id}`, {
      method: 'DELETE',
      headers,
    })
  }

  return {
    permissions,
    loading,
    errorMessage,
    fetchPermissions,
    createPermission,
    updatePermission,
    deletePermission,
  }
}
