import type { Ref } from 'vue'
import type { Project } from '~/types/project/project'

const INTERVAL_MS = 5000

export const useProjectCarousel = (projects: Ref<readonly Project[]>) => {
  const currentIndex = ref(0)
  const countdown = ref(INTERVAL_MS / 1000)
  let autoPlayInterval: ReturnType<typeof setInterval> | null = null
  let countdownInterval: ReturnType<typeof setInterval> | null = null

  const currentProject = computed(() => {
    return projects.value[currentIndex.value] || null
  })

  const remainingProjects = computed(() => {
    const total = projects.value.length
    if (total === 0 || total === 1) return 0
    const remaining = total - currentIndex.value - 1
    return remaining > 0 ? remaining : 0
  })

  const resetCountdown = () => {
    countdown.value = INTERVAL_MS / 1000
  }

  const startCountdown = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval)
    }
    resetCountdown()
    countdownInterval = setInterval(() => {
      countdown.value = Math.max(0, countdown.value - 0.1)
      if (countdown.value <= 0) {
        resetCountdown()
      }
    }, 100)
  }

  const stopCountdown = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval)
      countdownInterval = null
    }
  }

  const nextProject = () => {
    if (projects.value.length > 0) {
      currentIndex.value = (currentIndex.value + 1) % projects.value.length
      resetCountdown()
    }
  }

  const goToIndex = (index: number) => {
    if (index >= 0 && index < projects.value.length) {
      currentIndex.value = index
      resetCountdown()
    }
  }

  const startAutoPlay = () => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval)
    }
    startCountdown()
    autoPlayInterval = setInterval(() => {
      nextProject()
    }, INTERVAL_MS)
  }

  const stopAutoPlay = () => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval)
      autoPlayInterval = null
    }
    stopCountdown()
  }

  return {
    currentIndex,
    currentProject,
    countdown,
    remainingProjects,
    nextProject,
    goToIndex,
    startAutoPlay,
    stopAutoPlay,
  }
}

