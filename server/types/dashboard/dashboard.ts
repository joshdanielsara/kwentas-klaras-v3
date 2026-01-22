export interface DashboardStats {
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
    createdAt: Date | string | null
  }>
}

export interface UtilizationRateData {
  label: string
  value: number
  color: string
}
