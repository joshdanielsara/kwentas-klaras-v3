import type { Project } from '~/types/project/project'
import { useProjectFormatting } from './useProjectFormatting'

export const useProjectUtilization = (project: Ref<Project | null>) => {
  const { formatNumber } = useProjectFormatting()

  const utilizationChartData = computed(() => {
    if (!project.value) return { series: [], options: {}, utilizationRate: 0 }

    const appropriation = project.value.appropriation || 0
    const totalAddedBudget = project.value.totalAddedBudget || 0
    const totalBudget = appropriation + totalAddedBudget
    
    const totalDisbursements = 0
    const used = totalDisbursements
    const remaining = Math.max(0, totalBudget - used)
    const utilizationRate = totalBudget > 0 ? (used / totalBudget) * 100 : 0

    return {
      series: [utilizationRate, 100 - utilizationRate],
      options: {
        chart: {
          type: 'pie',
          height: 250,
        },
        colors: ['#10B981', '#E5E7EB'],
        labels: ['Utilized', 'Available'],
        legend: {
          position: 'bottom',
        },
        dataLabels: {
          enabled: true,
          formatter: (val: number) => `${val.toFixed(1)}%`,
        },
        tooltip: {
          y: {
            formatter: (val: number) => {
              const amount = totalBudget * (val / 100)
              return `₱${formatNumber(amount)} (${val.toFixed(1)}%)`
            },
          },
        },
      },
      utilizationRate: utilizationRate.toFixed(2),
    }
  })

  return {
    utilizationChartData,
  }
}

