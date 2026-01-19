import { ref, computed, readonly } from 'vue'
import { useErrorHandler } from '../error/useErrorHandler'
import { useAuthHeaders } from '../auth/useAuthHeaders'

export interface UtilizationRateData {
  label: string
  value: number
  color: string
}

export const useUtilizationRate = () => {
  const utilizationData = ref<UtilizationRateData[]>([])
  const averageUtilizationRate = ref<number>(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchUtilizationData = async () => {
    loading.value = true
    error.value = null

    await useErrorHandler(async () => {
      const headers = await useAuthHeaders()
      const response = await $fetch<{
        success: boolean
        stats: {
          utilizationRate: number
        }
        utilizationData: UtilizationRateData[]
      }>('/api/dashboard', { headers })

      if (response.success) {
        utilizationData.value = response.utilizationData ?? []
        averageUtilizationRate.value = response.stats?.utilizationRate ?? 0
      }
    }, {
      defaultMessage: 'Failed to fetch utilization data',
      onError: (err) => {
        error.value = err.message
      }
    })

    loading.value = false
  }

  const chartSeries = computed(() =>
    utilizationData.value.map(item => item.value)
  )

  const chartOptions = computed(() => {
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
      labels: utilizationData.value.map(item => item.label),
      colors: utilizationData.value.map(item => item.color),
      legend: {
        show: true,
        position: 'bottom',
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif',
        markers: {
          width: 12,
          height: 12,
          radius: 6
        }
      },
      dataLabels: {
        enabled: false
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val}%`
        }
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
                label: 'Total',
                fontSize: '24px',
                fontWeight: 700,
                color: '#2563EB',
                formatter: () => {
                  return '100%'
                },
              },
            },
          },
        },
      },
    }
  })

  return {
    utilizationData: readonly(utilizationData),
    averageUtilizationRate: readonly(averageUtilizationRate),
    loading: readonly(loading),
    error: readonly(error),
    chartOptions,
    chartSeries,
    fetchUtilizationData
  }
}
