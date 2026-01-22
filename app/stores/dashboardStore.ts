import { useErrorHandler } from '~/composables/error/useErrorHandler'
import { useAuthHeaders } from '~/composables/auth/useAuthHeaders'
import type { DashboardStats, DashboardActivity, UtilizationRateData } from '~/types/dashboard/dashboard'

const stats = ref<DashboardStats | null>(null)
const activities = ref<DashboardActivity[]>([])
const utilizationData = ref<UtilizationRateData[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const lastFetched = ref<Date | null>(null)

const CACHE_DURATION_MS = 5 * 60 * 1000

const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
  return `${Math.floor(diffInSeconds / 31536000)} years ago`
}

export const useDashboardStore = () => {
  const isStale = computed(() => {
    if (!lastFetched.value) return true
    const now = new Date()
    const diff = now.getTime() - lastFetched.value.getTime()
    return diff > CACHE_DURATION_MS
  })

  const fetchDashboard = async (forceRefresh = false) => {
    if (!forceRefresh && !isStale.value && stats.value) {
      return
    }

    loading.value = true
    error.value = null

    await useErrorHandler(async () => {
      const headers = await useAuthHeaders()
      const response = await $fetch<{
        success: boolean
        stats: {
          totalUsers: number
          activeProjects: number
          totalBudget: number
          totalApprovedDisbursements: number
          totalObligations: number
          utilizationRate: number
          recentActivities: Array<{
            id: string
            projectId: string
            action: string
            description: string
            createdAt: Date | string
          }>
        }
        utilizationData: UtilizationRateData[]
      }>('/api/dashboard', { headers })

      if (response.success) {
        stats.value = {
          totalUsers: response.stats.totalUsers,
          activeProjects: response.stats.activeProjects,
          totalBudget: response.stats.totalBudget,
          totalApprovedDisbursements: response.stats.totalApprovedDisbursements,
          totalObligations: response.stats.totalObligations,
          utilizationRate: response.stats.utilizationRate,
        }

        activities.value = response.stats.recentActivities.map((activity) => {
          const createdAt = typeof activity.createdAt === 'string' 
            ? new Date(activity.createdAt) 
            : activity.createdAt
          
          const actionTitle = activity.action
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')

          return {
            title: actionTitle,
            description: activity.description.replace(/<[^>]*>/g, ''),
            time: formatTimeAgo(createdAt),
          }
        })

        utilizationData.value = response.utilizationData || []
        lastFetched.value = new Date()
      }
    }, {
      defaultMessage: 'Failed to fetch dashboard data',
      onError: (err) => {
        error.value = err.message
      }
    })

    loading.value = false
  }

  const refresh = () => {
    return fetchDashboard(true)
  }

  const clear = () => {
    stats.value = null
    activities.value = []
    utilizationData.value = []
    lastFetched.value = null
    error.value = null
  }

  return {
    stats: readonly(stats),
    activities: readonly(activities),
    utilizationData: readonly(utilizationData),
    loading: readonly(loading),
    error: readonly(error),
    isStale,
    fetchDashboard,
    refresh,
    clear,
  }
}
