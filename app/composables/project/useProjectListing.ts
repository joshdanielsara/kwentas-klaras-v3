import type { Project } from '~/types/project/project'
import { useProjectFormatting } from './useProjectFormatting'

export const useProjectListing = () => {
  const { formatNumber } = useProjectFormatting()

  const getUtilizationRate = (project: Project): string => {
    const appropriation = project.appropriation || 0
    const totalAddedBudget = project.totalAddedBudget || 0
    const totalBudget = appropriation + totalAddedBudget
    const totalDisbursements = 0
    const utilizationRate = totalBudget > 0 ? (totalDisbursements / totalBudget) * 100 : 0
    return utilizationRate.toFixed(1)
  }

  const getUtilizationChartSeries = (project: Project): number[] => {
    const appropriation = project.appropriation || 0
    const totalAddedBudget = project.totalAddedBudget || 0
    const totalBudget = appropriation + totalAddedBudget
    const totalDisbursements = 0
    const utilizationRate = totalBudget > 0 ? (totalDisbursements / totalBudget) * 100 : 0
    const remainingBudget = 100 - utilizationRate
    return [utilizationRate, remainingBudget]
  }

  const getUtilizationChartOptions = (project: Project) => {
    const appropriation = project.appropriation || 0
    const totalAddedBudget = project.totalAddedBudget || 0
    const totalBudget = appropriation + totalAddedBudget
    const totalDisbursements = 0
    const utilizationRate = totalBudget > 0 ? (totalDisbursements / totalBudget) * 100 : 0
    const remainingBudget = 100 - utilizationRate

    return {
      chart: {
        type: 'donut',
        height: 350,
        animations: {
          enabled: true,
          easing: 'cubicBezier(0.4, 0, 0.2, 1)',
          speed: 1400,
          animateGradually: {
            enabled: true,
            delay: 150,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 550,
        },
      },
        background: 'transparent',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      },
      labels: ['Utilized Budget', 'Remaining Budget'],
      colors: ['#10B981', '#3B82F6'],
      legend: {
        show: true,
        position: 'bottom',
        fontSize: '18px',
        fontWeight: 600,
        markers: {
          width: 14,
          height: 14,
          radius: 7,
        },
        itemMargin: {
          horizontal: 15,
        },
      },
      plotOptions: {
        pie: {
          expandOnClick: false,
          donut: {
            size: '75%',
            labels: {
              show: true,
              name: {
                show: false,
              },
              value: {
                show: false,
              },
              total: {
                show: true,
                label: 'Utilization Rate',
                fontSize: '24px',
                fontWeight: 700,
                color: '#1E293B',
                formatter: () => {
                  return utilizationRate.toFixed(1) + '%'
                },
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => {
          return val.toFixed(1) + '%'
        },
        style: {
          fontSize: '16px',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          fontWeight: 500,
        },
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: (val: number) => {
            return val.toFixed(1) + '%'
          },
        },
      },
    }
  }

  const goToProject = (projectId: string | undefined) => {
    if (projectId) {
      navigateTo(`/admin/projects/${projectId}`)
    }
  }

  return {
    getUtilizationRate,
    getUtilizationChartSeries,
    getUtilizationChartOptions,
    goToProject,
  }
}

