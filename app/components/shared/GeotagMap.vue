<template>
  <div class="w-full">
    <div class="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-300">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">Project Location</h3>
              <p class="text-xs text-gray-500">Click on the map to set project coordinates</p>
            </div>
          </div>
          <div v-if="hasSaveButton && hasLocation" class="flex items-center gap-2">
            <button
              v-if="showClearButton"
              @click="handleClearLocation"
              :disabled="saving"
              class="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear Location
            </button>
            <button
              @click="handleSaveLocation"
              :disabled="saving"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="saving">Saving...</span>
              <span v-else>Save Location</span>
            </button>
          </div>
        </div>
      </div>
      <div class="p-6">
        <div v-if="error" class="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>
        <div ref="mapContainer" class="w-full h-[600px] rounded-lg border border-gray-200"></div>
        <div v-if="currentLatitude !== null && currentLongitude !== null" class="mt-4">
          <div class="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-300">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900">Location Details</h3>
                  <p class="text-xs text-gray-500">Geographic coordinates and address information</p>
                </div>
              </div>
            </div>
            <div class="p-6 space-y-6">
              <div class="bg-blue-50 border border-blue-100 rounded-lg p-6">
                <div class="flex items-center gap-2 mb-4">
                  <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <h4 class="text-sm font-semibold text-blue-900 uppercase tracking-wide">Coordinates</h4>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p class="text-xs font-medium text-blue-700 uppercase tracking-wide mb-2">Latitude</p>
                    <p class="text-base font-semibold text-blue-900">{{ currentLatitude.toFixed(6) }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-medium text-blue-700 uppercase tracking-wide mb-2">Longitude</p>
                    <p class="text-base font-semibold text-blue-900">{{ currentLongitude.toFixed(6) }}</p>
                  </div>
                </div>
              </div>

              <div v-if="locationInfo.loading" class="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div class="flex items-center justify-center gap-3">
                  <div class="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                  <span class="text-sm font-medium text-gray-700">Identifying location...</span>
                </div>
              </div>

              <div v-else-if="locationInfo.error" class="bg-red-50 border border-red-200 rounded-lg p-6">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="text-sm text-red-700">{{ locationInfo.error }}</p>
                </div>
              </div>

              <div v-else-if="locationInfo.barangay || locationInfo.municipality" class="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div class="flex items-center gap-2 mb-4">
                  <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h4 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">Address Information</h4>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div v-if="locationInfo.barangay">
                    <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Barangay</p>
                    <p class="text-base font-semibold text-gray-900">{{ locationInfo.barangay }}</p>
                  </div>
                  <div v-if="locationInfo.municipality">
                    <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Municipality</p>
                    <p class="text-base font-semibold text-gray-900">{{ locationInfo.municipality }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGeotagMap } from '~/composables/map/useGeotagMap'

interface Props {
  projectId?: string
  locationName?: string | null
  initialLatitude?: number | null
  initialLongitude?: number | null
  hasSaveButton?: boolean
  showClearButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hasSaveButton: true,
  showClearButton: true,
})

const emit = defineEmits<{
  saved: [latitude: number | null, longitude: number | null]
  'update:coordinates': [latitude: number | null, longitude: number | null]
}>()

const {
  currentLatitude,
  currentLongitude,
  saving,
  error,
  locationInfo,
  hasLocation,
  reverseGeocode,
  geocodeLocation,
  getDefaultIcon,
  saveLocation,
  clearLocation,
  setCoordinates,
  getDefaultCenter,
} = useGeotagMap({
  projectId: props.projectId,
  locationName: props.locationName,
  initialLatitude: props.initialLatitude,
  initialLongitude: props.initialLongitude,
})

const mapContainer = ref<HTMLElement | null>(null)
let map: any = null
let marker: any = null
let clickMarker: any = null
let L: any = null

const initMap = async () => {
  if (!mapContainer.value || typeof window === 'undefined') return

  try {
    L = await import('leaflet')
    await import('leaflet/dist/leaflet.css')

    const defaultCenter = getDefaultCenter()
    let centerLat = defaultCenter.lat
    let centerLng = defaultCenter.lng
    let zoom = defaultCenter.zoom

    if (currentLatitude.value !== null && currentLongitude.value !== null) {
      centerLat = currentLatitude.value
      centerLng = currentLongitude.value
      zoom = 13
    } else if (props.locationName) {
      const coords = await geocodeLocation(props.locationName)
      if (coords) {
        centerLat = coords.lat
        centerLng = coords.lng
        zoom = 13
      }
    }

    map = L.default.map(mapContainer.value).setView([centerLat, centerLng], zoom)

    L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    if (currentLatitude.value !== null && currentLongitude.value !== null) {
      marker = L.default.marker([currentLatitude.value, currentLongitude.value], { icon: getDefaultIcon(L.default) })
        .addTo(map)
        .bindPopup('Project Location')
      await reverseGeocode(currentLatitude.value, currentLongitude.value)
    }

    map.on('click', async (e: any) => {
      const { lat, lng } = e.latlng
      setCoordinates(lat, lng)

      if (clickMarker) {
        map.removeLayer(clickMarker)
      }

      clickMarker = L.default.marker([lat, lng], { icon: getDefaultIcon(L.default) })
        .addTo(map)
        .bindPopup('Click to set location')

      if (marker) {
        map.removeLayer(marker)
        marker = null
      }

      await reverseGeocode(lat, lng)
      emit('update:coordinates', lat, lng)
    })
  } catch (err) {
    console.error('Failed to load map:', err)
    error.value = 'Failed to load map'
  }
}

const handleSaveLocation = async () => {
  if (currentLatitude.value === null || currentLongitude.value === null || !L) return

  const response = await saveLocation(currentLatitude.value, currentLongitude.value)

  if (response.success) {
    if (clickMarker) {
      map?.removeLayer(clickMarker)
      clickMarker = null
    }

    if (marker) {
      map?.removeLayer(marker)
    }

    marker = L.default.marker([currentLatitude.value, currentLongitude.value], { icon: getDefaultIcon(L.default) })
      .addTo(map!)
      .bindPopup('Project Location')

    emit('saved', currentLatitude.value, currentLongitude.value)
  }
}

const handleClearLocation = async () => {
  const response = await clearLocation()

  if (response.success) {
    if (marker) {
      map?.removeLayer(marker)
      marker = null
    }

    if (clickMarker) {
      map?.removeLayer(clickMarker)
      clickMarker = null
    }

    emit('saved', null, null)
    if (!props.projectId) {
      emit('update:coordinates', null, null)
    }
  }
}

onMounted(() => {
  nextTick(() => {
    initMap()
  })
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})

watch(() => props.locationName, async (newLocation) => {
  if (map && L && newLocation && !currentLatitude.value && !currentLongitude.value) {
    const coords = await geocodeLocation(newLocation)
    if (coords) {
      map.setView([coords.lat, coords.lng], 13)
    }
  }
})

watch(() => [props.initialLatitude, props.initialLongitude], async ([newLat, newLng]) => {
  if (map && L && newLat !== null && newLat !== undefined && newLng !== null && newLng !== undefined) {
    setCoordinates(newLat, newLng)

    if (marker) {
      map.removeLayer(marker)
    }

    marker = L.default.marker([newLat, newLng], { icon: getDefaultIcon(L.default) })
      .addTo(map)
      .bindPopup('Project Location')

    map.setView([newLat, newLng], 13)
    await reverseGeocode(newLat, newLng)
  }
})

watch(() => [currentLatitude.value, currentLongitude.value], ([lat, lng]) => {
  if (lat !== null && lat !== undefined && lng !== null && lng !== undefined && !props.projectId) {
    emit('update:coordinates', lat, lng)
  }
})
</script>

