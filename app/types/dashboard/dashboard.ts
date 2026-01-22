export interface UtilizationRateData {
  label: string
  value: number
  color: string
}

export interface DashboardStats {
  totalUsers: number
  activeProjects: number
  totalBudget: number
  totalApprovedDisbursements: number
  totalObligations: number
  utilizationRate: number
}

export interface DashboardActivity {
  title: string
  description: string
  time: string
}
