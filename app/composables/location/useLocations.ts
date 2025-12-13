export interface Location {
  id: string
  name: string
}

export const useLocations = () => {
  const locations = ref<Location[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchLocations = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ success: boolean; locations: Location[] }>('/api/locations')
      if (response.success) {
        locations.value = response.locations
      }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch locations'
    } finally {
      loading.value = false
    }
  }

  return {
    locations,
    loading,
    error,
    fetchLocations,
  }
}
