import {
  PUBLIC_CAROUSEL_INTERVAL_DEFAULT_SECONDS,
  PUBLIC_CAROUSEL_INTERVAL_MAX_SECONDS,
  PUBLIC_CAROUSEL_INTERVAL_MIN_SECONDS,
} from '~/constants/public/carouselSettings'
import { normalizeCarouselIntervalSeconds } from '~/utils/public/normalizeCarouselIntervalSeconds'
import { useSuperadminAuth } from './useSuperadminAuth'

export const useCarouselSettings = () => {
  const { fetchCsrfHeaders } = useSuperadminAuth()
  const intervalSeconds = ref(PUBLIC_CAROUSEL_INTERVAL_DEFAULT_SECONDS)
  const minSeconds = ref(PUBLIC_CAROUSEL_INTERVAL_MIN_SECONDS)
  const maxSeconds = ref(PUBLIC_CAROUSEL_INTERVAL_MAX_SECONDS)
  const loading = ref(false)
  const saving = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')

  const fetchCarouselSettings = async () => {
    loading.value = true
    errorMessage.value = ''
    try {
      const response = await $fetch<{
        success: boolean
        carousel: {
          intervalSeconds: number
          minSeconds: number
          maxSeconds: number
        }
      }>('/api/superadmin/settings/carousel')
      intervalSeconds.value = normalizeCarouselIntervalSeconds(response.carousel.intervalSeconds)
      minSeconds.value = response.carousel.minSeconds
      maxSeconds.value = response.carousel.maxSeconds
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string }
      errorMessage.value = err.data?.message || err.message || 'Failed to load carousel settings'
      console.error('[useCarouselSettings] fetch failed', { error: errorMessage.value })
    } finally {
      loading.value = false
    }
  }

  const saveCarouselSettings = async (nextSeconds: number) => {
    saving.value = true
    errorMessage.value = ''
    successMessage.value = ''
    try {
      const headers = await fetchCsrfHeaders()
      const response = await $fetch<{
        success: boolean
        carousel: { intervalSeconds: number }
      }>('/api/superadmin/settings/carousel', {
        method: 'PUT',
        headers,
        body: { intervalSeconds: nextSeconds },
      })
      intervalSeconds.value = normalizeCarouselIntervalSeconds(response.carousel.intervalSeconds)
      successMessage.value = `Public carousel now advances every ${intervalSeconds.value} seconds.`
      return intervalSeconds.value
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string }
      errorMessage.value = err.data?.message || err.message || 'Failed to save carousel settings'
      console.error('[useCarouselSettings] save failed', { error: errorMessage.value })
      throw error
    } finally {
      saving.value = false
    }
  }

  return {
    intervalSeconds,
    minSeconds,
    maxSeconds,
    loading,
    saving,
    errorMessage,
    successMessage,
    fetchCarouselSettings,
    saveCarouselSettings,
  }
}
