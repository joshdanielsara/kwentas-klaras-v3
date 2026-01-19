import { DashboardService } from '../../services/dashboard/DashboardService'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    const dashboardService = new DashboardService()
    const stats = await dashboardService.getStats()
    const utilizationData = await dashboardService.getUtilizationRateData()

    return {
      success: true,
      stats,
      utilizationData,
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to fetch dashboard data',
  })
})
