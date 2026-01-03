<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
          <div
            v-if="show"
            class="fixed inset-0 bg-brand-bg bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-[9999]"
          >
        <Transition
          enter-active-class="transform transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transform transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="show"
            class="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-lg w-full mx-4 p-6 sm:p-8"
          >
            <div class="flex flex-col items-center text-center">
              <div
                class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4"
              >
                <svg class="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>

              <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                {{ title }}
              </h3>
              <p
                class="text-sm sm:text-base text-gray-600 leading-relaxed mb-6"
              >
                {{ message }}
              </p>

              <div class="w-full mb-6">
                <div
                  class="h-3 w-full bg-gray-100 rounded-full overflow-hidden mb-2"
                >
                  <div
                    class="h-full bg-blue-500 transition-all duration-300 ease-out"
                    :style="{ width: `${progressPercentage}%` }"
                  />
                </div>
                <p class="text-xs text-gray-500">
                  {{ progressPercentage }}%
                </p>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

interface Props {
  show: boolean
  title?: string
  message?: string
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Processing',
  message: 'Please wait while we process your request...',
  duration: 2000,
})

const progressPercentage = ref(1)
let progressInterval: ReturnType<typeof setInterval> | null = null
let animationStartTime: number | null = null

watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      progressPercentage.value = 1
      animationStartTime = Date.now()
      
      if (progressInterval) {
        clearInterval(progressInterval)
      }

      const updateFrequency = 50
      const targetDuration = props.duration
      const maxProgress = 99

      progressInterval = setInterval(() => {
        if (animationStartTime) {
          const elapsed = Date.now() - animationStartTime
          const progress = Math.min(maxProgress, (elapsed / targetDuration) * maxProgress + 1)
          progressPercentage.value = Math.floor(progress)
          
          if (progress >= maxProgress) {
            if (progressInterval) {
              clearInterval(progressInterval)
              progressInterval = null
            }
            progressPercentage.value = 99
          }
        }
      }, updateFrequency)
    } else {
      if (progressInterval) {
        clearInterval(progressInterval)
        progressInterval = null
      }
      progressPercentage.value = 1
      animationStartTime = null
    }
  }
)

onUnmounted(() => {
  if (progressInterval) {
    clearInterval(progressInterval)
  }
})
</script>

