<template>
  <div class="flex flex-wrap items-center gap-3 sm:gap-4">
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        :disabled="!canNavigate"
        aria-label="Previous project"
        @click="$emit('previous')"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        class="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        :disabled="!canNavigate"
        aria-label="Next project"
        @click="$emit('next')"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <div class="flex items-center gap-6">
      <div>
        <div class="text-sm text-gray-600">Next in</div>
        <div class="text-xl sm:text-2xl font-bold text-gray-900">{{ Math.ceil(countdown) }}s</div>
      </div>
      <div>
        <div class="text-sm text-gray-600">Remaining</div>
        <div class="text-xl sm:text-2xl font-bold text-gray-900">{{ remaining }}</div>
      </div>
      <div class="hidden sm:block">
        <div class="text-sm text-gray-600">Auto-advance</div>
        <div class="text-sm font-semibold text-gray-900">every {{ intervalSeconds }}s</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  canNavigate: boolean
  countdown: number
  remaining: number
  intervalSeconds: number
}>()

defineEmits<{
  previous: []
  next: []
}>()
</script>
