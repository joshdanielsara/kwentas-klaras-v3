import type { Ref } from 'vue'
import type { Project } from '~/types/project/project'
import { PUBLIC_CAROUSEL_INTERVAL_DEFAULT_SECONDS } from '~/constants/public/carouselSettings'
import { normalizeCarouselIntervalSeconds } from '~/utils/public/normalizeCarouselIntervalSeconds'

export const useProjectCarousel = (
  projects: Ref<readonly Project[]>,
  intervalSeconds?: Ref<number>
) => {
  const currentIndex = ref(0)
  const countdown = ref(PUBLIC_CAROUSEL_INTERVAL_DEFAULT_SECONDS)
  let autoPlayInterval: ReturnType<typeof setInterval> | null = null
  let countdownInterval: ReturnType<typeof setInterval> | null = null
  let autoPlayActive = false

  const resolvedIntervalSeconds = computed(() =>
    normalizeCarouselIntervalSeconds(
      intervalSeconds?.value ?? PUBLIC_CAROUSEL_INTERVAL_DEFAULT_SECONDS
    )
  )

  const intervalMs = computed(() => resolvedIntervalSeconds.value * 1000)

  const currentProject = computed(() => {
    return projects.value[currentIndex.value] || null
  })

  const remainingProjects = computed(() => {
    const total = projects.value.length
    if (total === 0 || total === 1) return 0
    const remaining = total - currentIndex.value - 1
    return remaining > 0 ? remaining : 0
  })

  const canNavigate = computed(() => projects.value.length > 1)

  const resetCountdown = () => {
    countdown.value = resolvedIntervalSeconds.value
  }

  const stopCountdown = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval)
      countdownInterval = null
    }
  }

  const startCountdown = () => {
    stopCountdown()
    resetCountdown()
    countdownInterval = setInterval(() => {
      countdown.value = Math.max(0, countdown.value - 0.1)
      if (countdown.value <= 0) {
        resetCountdown()
      }
    }, 100)
  }

  const clearAutoPlayTimer = () => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval)
      autoPlayInterval = null
    }
  }

  const scheduleAutoPlay = () => {
    clearAutoPlayTimer()
    if (!autoPlayActive || projects.value.length <= 1) {
      return
    }
    startCountdown()
    autoPlayInterval = setInterval(() => {
      nextProject({ restartTimer: false })
    }, intervalMs.value)
  }

  const nextProject = (options?: { restartTimer?: boolean }) => {
    if (projects.value.length === 0) {
      return
    }
    currentIndex.value = (currentIndex.value + 1) % projects.value.length
    if (options?.restartTimer !== false && autoPlayActive) {
      scheduleAutoPlay()
    } else {
      resetCountdown()
    }
  }

  const previousProject = () => {
    if (projects.value.length === 0) {
      return
    }
    currentIndex.value =
      (currentIndex.value - 1 + projects.value.length) % projects.value.length
    if (autoPlayActive) {
      scheduleAutoPlay()
    } else {
      resetCountdown()
    }
  }

  const goToIndex = (index: number) => {
    if (index >= 0 && index < projects.value.length) {
      currentIndex.value = index
      if (autoPlayActive) {
        scheduleAutoPlay()
      } else {
        resetCountdown()
      }
    }
  }

  const startAutoPlay = () => {
    autoPlayActive = true
    scheduleAutoPlay()
  }

  const stopAutoPlay = () => {
    autoPlayActive = false
    clearAutoPlayTimer()
    stopCountdown()
  }

  watch(resolvedIntervalSeconds, () => {
    if (autoPlayActive) {
      scheduleAutoPlay()
    } else {
      resetCountdown()
    }
  })

  watch(
    () => projects.value.length,
    (length) => {
      if (currentIndex.value >= length) {
        currentIndex.value = Math.max(0, length - 1)
      }
      if (autoPlayActive) {
        if (length > 1) {
          scheduleAutoPlay()
        } else {
          clearAutoPlayTimer()
          stopCountdown()
        }
      }
    }
  )

  return {
    currentIndex,
    currentProject,
    countdown,
    remainingProjects,
    canNavigate,
    intervalSeconds: resolvedIntervalSeconds,
    nextProject,
    previousProject,
    goToIndex,
    startAutoPlay,
    stopAutoPlay,
  }
}
