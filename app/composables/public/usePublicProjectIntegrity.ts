import type { PublicProjectIntegrity } from '~/types/audit/publicIntegrity'
import { PUBLIC_INTEGRITY_STATUS } from '~/constants/audit/integrityStatus'

export const usePublicProjectIntegrity = () => {
  const integrity = ref<PublicProjectIntegrity | null>(null)
  const checking = ref(false)
  const errorMessage = ref('')

  const fetchIntegrity = async (projectId: string, verify = false) => {
    if (!projectId) {
      integrity.value = null
      return null
    }

    checking.value = true
    errorMessage.value = ''
    try {
      const query = verify ? '?verify=1' : ''
      const response = await $fetch<{ success: boolean; integrity: PublicProjectIntegrity }>(
        `/api/public/projects/${projectId}/integrity${query}`
      )
      integrity.value = response.integrity
      return response.integrity
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string }
      errorMessage.value = err.data?.message || err.message || 'Could not check records'
      console.error('[usePublicProjectIntegrity] fetch failed', { error: errorMessage.value })
      return null
    } finally {
      checking.value = false
    }
  }

  const verifyProject = async (projectId: string) => {
    return fetchIntegrity(projectId, true)
  }

  const statusClass = computed(() => {
    const status = integrity.value?.status
    if (status === PUBLIC_INTEGRITY_STATUS.VERIFIED || status === PUBLIC_INTEGRITY_STATUS.SEALED) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-100'
    }
    if (status === PUBLIC_INTEGRITY_STATUS.FAILED) {
      return 'bg-red-50 text-red-800 border-red-100'
    }
    if (status === PUBLIC_INTEGRITY_STATUS.PENDING) {
      return 'bg-amber-50 text-amber-800 border-amber-100'
    }
    return 'bg-gray-50 text-gray-600 border-gray-100'
  })

  return {
    integrity,
    checking,
    errorMessage,
    fetchIntegrity,
    verifyProject,
    statusClass,
  }
}
