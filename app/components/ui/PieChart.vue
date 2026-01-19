<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-300 animate-fade-in">
    <div class="p-4 lg:p-6 border-b border-gray-300">
      <h2 class="text-lg lg:text-xl font-bold text-brand-blue tracking-tight">
        {{ title }}
      </h2>
    </div>

    <div class="p-4 lg:p-6">
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-brand-blue border-t-transparent"></div>
      </div>

      <div v-else-if="error" class="flex items-center justify-center py-12">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <div v-else>
        <div ref="chartRef" class="min-h-[350px]"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'

interface Props {
  title: string
  series: number[]
  options: any
  loading?: boolean
  error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null
})

const chartRef = ref<HTMLElement | null>(null)
let chart: any = null
let ApexCharts: any = null

const renderChart = async () => {
  if (!chartRef.value || props.loading || props.error) return

  if (process.client && !ApexCharts) {
    ApexCharts = (await import('apexcharts')).default
  }

  await nextTick()

  if (!chartRef.value || !ApexCharts) return

  const chartOptions = {
    ...props.options,
    series: props.series,
    chart: {
      ...props.options.chart,
      parentHeightOffset: 0
    }
  }

  if (chart) {
    chart.updateOptions(chartOptions, false, true, true)
  } else {
    chart = new ApexCharts(chartRef.value, chartOptions)
    chart.render()
  }
}

onMounted(renderChart)

watch(
  () => [props.series, props.options, props.loading, props.error],
  renderChart,
  { deep: true }
)

onBeforeUnmount(() => {
  if (chart) chart.destroy()
})
</script>
