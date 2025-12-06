<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isVisible"
        :class="[
          'fixed top-4 right-4 z-[10000] max-w-md shadow-lg rounded-lg',
          variantClasses
        ]"
      >
        <div class="flex items-center justify-between p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg :class="iconClasses" viewBox="0 0 20 20" fill="currentColor">
                <path
                  v-if="variant === 'error'"
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
                <path
                  v-else-if="variant === 'success'"
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
                <path
                  v-else-if="variant === 'warning'"
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
                <path
                  v-else
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p :class="messageClasses">{{ message }}</p>
            </div>
          </div>
          <button
            v-if="dismissible"
            @click="dismiss"
            :class="closeButtonClasses"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

interface ToastProps {
  message?: string | null
  variant?: 'error' | 'success' | 'warning' | 'info'
  dismissible?: boolean
  duration?: number
}

const props = withDefaults(defineProps<ToastProps>(), {
  variant: 'error',
  dismissible: true,
  duration: 0,
})

const emit = defineEmits<{
  dismiss: []
}>()

const isVisible = computed(() => !!props.message)

const variantClasses = computed(() => {
  const variants = {
    error: 'bg-red-50 border border-red-200',
    success: 'bg-green-50 border border-green-200',
    warning: 'bg-yellow-50 border border-yellow-200',
    info: 'bg-blue-50 border border-blue-200',
  }
  return variants[props.variant]
})

const iconClasses = computed(() => {
  const classes = {
    error: 'h-5 w-5 text-red-400',
    success: 'h-5 w-5 text-green-400',
    warning: 'h-5 w-5 text-yellow-400',
    info: 'h-5 w-5 text-blue-400',
  }
  return classes[props.variant]
})

const messageClasses = computed(() => {
  const classes = {
    error: 'text-sm font-medium text-red-800',
    success: 'text-sm font-medium text-green-800',
    warning: 'text-sm font-medium text-yellow-800',
    info: 'text-sm font-medium text-blue-800',
  }
  return classes[props.variant]
})

const closeButtonClasses = computed(() => {
  const classes = {
    error: 'ml-4 text-red-600 hover:text-red-800',
    success: 'ml-4 text-green-600 hover:text-green-800',
    warning: 'ml-4 text-yellow-600 hover:text-yellow-800',
    info: 'ml-4 text-blue-600 hover:text-blue-800',
  }
  return classes[props.variant]
})

const dismiss = () => {
  emit('dismiss')
}

watch(() => props.message, (newMessage) => {
  if (newMessage && props.duration > 0) {
    setTimeout(() => {
      dismiss()
    }, props.duration)
  }
})
</script>

