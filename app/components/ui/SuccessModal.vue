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
        @click.self="handleClose"
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
            class="bg-white rounded-2xl border border-green-200 shadow-2xl max-w-lg w-full mx-4 p-6 sm:p-8"
          >
            <div class="flex flex-col items-center text-center">
              <div
                class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4"
              >
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
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

              <div v-if="autoCloseSeconds > 0" class="w-full mb-6">
                <div
                  class="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-2"
                >
                  <div
                    class="h-full bg-green-500 transition-all duration-100 ease-linear"
                    :style="{ width: `${progressPercentage}%` }"
                  />
                </div>
                <p class="text-xs text-gray-500">
                  {{ countDownMessage }} {{ Math.ceil(remainingTime) }}s...
                </p>
              </div>

              <div class="flex justify-center">
                <Button
                  variant="primary"
                  @click="handleClose"
                  class="min-w-[120px]"
                >
                  {{ buttonText }}
                </Button>
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
import Button from './Button.vue'

interface Props {
  show: boolean
  title?: string
  message: string
  buttonText?: string
  autoCloseSeconds?: number
  countDownMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Success',
  buttonText: 'Close',
  autoCloseSeconds: 3,
  countDownMessage: 'Closing in',
})

const emit = defineEmits<{ close: [] }>()

const remainingTime = ref(0)
const progressPercentage = ref(100)
let progressInterval: ReturnType<typeof setInterval> | null = null
let closedManually = false

watch(
  () => props.show,
  (newValue) => {
    if (newValue && props.autoCloseSeconds > 0) {
      closedManually = false
      remainingTime.value = props.autoCloseSeconds
      progressPercentage.value = 100

      if (progressInterval) {
        clearInterval(progressInterval)
      }

      const updateFrequency = 100

      progressInterval = setInterval(() => {
        remainingTime.value = Math.max(0, remainingTime.value - 0.1)
        progressPercentage.value =
          (remainingTime.value / props.autoCloseSeconds) * 100

        if (remainingTime.value <= 0) {
          if (progressInterval) {
            clearInterval(progressInterval)
            progressInterval = null
          }
        }
      }, updateFrequency)

      setTimeout(() => {
        if (!closedManually) {
          handleClose()
        }
      }, props.autoCloseSeconds * 1000)
    } else {
      if (progressInterval) {
        clearInterval(progressInterval)
        progressInterval = null
      }
    }
  }
)

onUnmounted(() => {
  if (progressInterval) {
    clearInterval(progressInterval)
  }
})

const handleClose = () => {
  closedManually = true
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
  emit('close')
}
</script>

