import { PUBLIC_CAROUSEL_INTERVAL_DEFAULT_SECONDS } from '~/constants/public/carouselSettings'
import { normalizeCarouselIntervalSeconds } from '~/utils/public/normalizeCarouselIntervalSeconds'

export const usePublicCarouselSettings = () => {
  const intervalSeconds = ref(PUBLIC_CAROUSEL_INTERVAL_DEFAULT_SECONDS)
  const loading = ref(false)
  const errorMessage = ref('')

  const fetchCarouselSettings = async () => {
    loading.value = true
    errorMessage.value = ''
    try {
      const response = await $fetch<{
        success: boolean
        carousel: { intervalSeconds: number }
      }>('/api/public/settings/carousel')
      intervalSeconds.value = normalizeCarouselIntervalSeconds(
        response.carousel?.intervalSeconds
      )
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string }
      errorMessage.value = err.data?.message || err.message || 'Failed to load carousel settings'
      console.error('[usePublicCarouselSettings] fetch failed', { error: errorMessage.value })
      intervalSeconds.value = PUBLIC_CAROUSEL_INTERVAL_DEFAULT_SECONDS
    } finally {
      loading.value = false
    }
  }

  return {
    intervalSeconds,
    loading,
    errorMessage,
    fetchCarouselSettings,
  }
}
