import type { User } from '~/types/user/user'
import { useErrorHandler } from '../error/useErrorHandler'
import { useAuthHeaders } from '../auth/useAuthHeaders'
import { useDashboardStore } from '~/stores/dashboardStore'

export const useDeletedUsers = () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchDeletedUsers = async () => {
    loading.value = true
    error.value = null

    await useErrorHandler(async () => {
      const headers = await useAuthHeaders()
      const response = await $fetch<{ success: boolean; users: User[] }>('/api/users/deleted', { headers })
      if (response.success) {
        users.value = response.users
      }
    }, {
      defaultMessage: 'Failed to fetch deleted users',
      onError: (err) => {
        error.value = err.message
      }
    })

    loading.value = false
  }

  const restoreUser = async (userId: string) => {
    await useErrorHandler(async () => {
      const headers = await useAuthHeaders()
      const response = await $fetch<{ success: boolean; message?: string }>(`/api/users/${userId}/restore`, {
        method: 'POST',
        headers
      })

      if (response.success) {
        users.value = users.value.filter(u => u.id !== userId)
        const dashboardStore = useDashboardStore()
        dashboardStore.refresh()
      }
    }, {
      defaultMessage: 'Failed to restore user',
    })
  }

  return {
    users: readonly(users),
    loading: readonly(loading),
    error: readonly(error),
    fetchDeletedUsers,
    restoreUser,
  }
}
