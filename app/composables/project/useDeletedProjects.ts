import type { Project } from '~/types/project/project'
import { useErrorHandler } from '../error/useErrorHandler'
import { useAuthHeaders } from '../auth/useAuthHeaders'
import { useDashboardStore } from '~/stores/dashboardStore'

export const useDeletedProjects = () => {
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchDeletedProjects = async () => {
    loading.value = true
    error.value = null

    await useErrorHandler(async () => {
      const headers = await useAuthHeaders()
      const response = await $fetch<{ success: boolean; projects: Project[] }>('/api/projects/deleted', { headers })
      if (response.success) {
        projects.value = response.projects
      }
    }, {
      defaultMessage: 'Failed to fetch deleted projects',
      onError: (err) => {
        error.value = err.message
      }
    })

    loading.value = false
  }

  const restoreProject = async (projectId: string) => {
    await useErrorHandler(async () => {
      const headers = await useAuthHeaders()
      const response = await $fetch<{ success: boolean; message?: string }>(`/api/projects/${projectId}/restore`, {
        method: 'POST',
        headers
      })

      if (response.success) {
        projects.value = projects.value.filter(p => p.id !== projectId)
        const dashboardStore = useDashboardStore()
        dashboardStore.refresh()
      }
    }, {
      defaultMessage: 'Failed to restore project',
    })
  }

  return {
    projects: readonly(projects),
    loading: readonly(loading),
    error: readonly(error),
    fetchDeletedProjects,
    restoreProject,
  }
}
