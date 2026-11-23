import type { RoleItem } from '~/types/rbac/role'
import { useSuperadminAuth } from './useSuperadminAuth'

export const useRoles = () => {
  const { fetchCsrfHeaders } = useSuperadminAuth()
  const roles = ref<RoleItem[]>([])
  const loading = ref(false)
  const errorMessage = ref('')

  const fetchRoles = async () => {
    loading.value = true
    errorMessage.value = ''
    try {
      const response = await $fetch<{ success: boolean; roles: RoleItem[] }>('/api/superadmin/roles')
      roles.value = response.roles || []
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string }
      errorMessage.value = err.data?.message || err.message || 'Failed to load roles'
      console.error('[useRoles] fetch failed', { error: errorMessage.value })
    } finally {
      loading.value = false
    }
  }

  const fetchRole = async (id: string) => {
    const response = await $fetch<{ success: boolean; role: RoleItem }>(`/api/superadmin/roles/${id}`)
    return response.role
  }

  const createRole = async (payload: {
    slug: string
    name: string
    description?: string
    permissionIds?: string[]
  }) => {
    const headers = await fetchCsrfHeaders()
    const response = await $fetch<{ success: boolean; role: RoleItem }>('/api/superadmin/roles', {
      method: 'POST',
      headers,
      body: payload,
    })
    return response.role
  }

  const updateRole = async (
    id: string,
    payload: { name?: string; description?: string | null; permissionIds?: string[] }
  ) => {
    const headers = await fetchCsrfHeaders()
    const response = await $fetch<{ success: boolean; role: RoleItem }>(`/api/superadmin/roles/${id}`, {
      method: 'PUT',
      headers,
      body: payload,
    })
    return response.role
  }

  const deleteRole = async (id: string) => {
    const headers = await fetchCsrfHeaders()
    await $fetch(`/api/superadmin/roles/${id}`, {
      method: 'DELETE',
      headers,
    })
  }

  return {
    roles,
    loading,
    errorMessage,
    fetchRoles,
    fetchRole,
    createRole,
    updateRole,
    deleteRole,
  }
}
