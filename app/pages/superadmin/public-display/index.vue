<template>
  <div class="h-screen bg-brand-bg flex overflow-hidden">
    <SuperadminSidebar />
    <main class="flex-1 flex flex-col overflow-hidden min-w-0">
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-brand-bg">
        <div class="space-y-6 max-w-2xl">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Public display</h1>
            <p class="text-sm text-gray-500">
              Configure the public projects carousel on the home page (`/`).
            </p>
          </div>

          <div v-if="loading" class="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <div class="h-5 w-48 rounded bg-gray-200 animate-pulse"></div>
            <div class="h-10 w-40 rounded bg-gray-200 animate-pulse"></div>
            <div class="h-10 w-28 rounded bg-gray-200 animate-pulse"></div>
          </div>

          <div v-else class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
            <div>
              <label for="carousel-interval" class="block text-sm font-semibold text-gray-900">
                Auto-advance interval (seconds)
              </label>
              <p class="mt-1 text-sm text-gray-500">
                How long each project stays on screen before moving to the next.
                Allowed range: {{ minSeconds }}–{{ maxSeconds }} seconds (default {{ defaultSeconds }}).
              </p>
              <input
                id="carousel-interval"
                v-model.number="draftSeconds"
                type="number"
                :min="minSeconds"
                :max="maxSeconds"
                step="1"
                class="mt-3 w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
            <p v-if="successMessage" class="text-sm text-emerald-700">{{ successMessage }}</p>

            <button
              type="button"
              class="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              :disabled="saving || !isDirty"
              @click="onSave"
            >
              {{ saving ? 'Saving…' : 'Save interval' }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import SuperadminSidebar from '~/components/superadmin/Sidebar.vue'
import { PUBLIC_CAROUSEL_INTERVAL_DEFAULT_SECONDS } from '~/constants/public/carouselSettings'
import { normalizeCarouselIntervalSeconds } from '~/utils/public/normalizeCarouselIntervalSeconds'
import { useCarouselSettings } from '~/composables/superadmin/useCarouselSettings'

definePageMeta({
  layout: false,
  middleware: 'superadmin',
})

const {
  intervalSeconds,
  minSeconds,
  maxSeconds,
  loading,
  saving,
  errorMessage,
  successMessage,
  fetchCarouselSettings,
  saveCarouselSettings,
} = useCarouselSettings()

const draftSeconds = ref(PUBLIC_CAROUSEL_INTERVAL_DEFAULT_SECONDS)
const defaultSeconds = PUBLIC_CAROUSEL_INTERVAL_DEFAULT_SECONDS

const isDirty = computed(
  () => normalizeCarouselIntervalSeconds(draftSeconds.value) !== intervalSeconds.value
)

onMounted(async () => {
  await fetchCarouselSettings()
  draftSeconds.value = intervalSeconds.value
})

const onSave = async () => {
  const next = normalizeCarouselIntervalSeconds(draftSeconds.value)
  draftSeconds.value = next
  await saveCarouselSettings(next)
}
</script>
