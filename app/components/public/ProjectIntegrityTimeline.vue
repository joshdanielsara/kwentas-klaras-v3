<template>
  <ol v-if="steps.length" class="relative space-y-3 pl-1">
    <li
      v-for="(step, index) in steps"
      :key="`${step.kind}-${index}`"
      class="relative flex gap-3"
    >
      <div class="flex flex-col items-center">
        <span
          class="mt-1 h-2.5 w-2.5 rounded-full ring-4 shrink-0"
          :class="integrityTimelineDotClass(step.tone)"
          aria-hidden="true"
        ></span>
        <span
          v-if="index < steps.length - 1"
          class="mt-1 w-px flex-1 min-h-[1.25rem] bg-gray-200"
          aria-hidden="true"
        ></span>
      </div>
      <div class="min-w-0 pb-1">
        <p
          class="text-sm font-semibold"
          :class="step.tone === 'danger' ? 'text-red-800' : 'text-gray-900'"
        >
          {{ step.label }}
        </p>
        <span
          v-if="step.detail && step.tone === 'danger'"
          class="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border bg-red-100 text-red-900 border-red-200"
        >
          {{ step.detail }}
        </span>
        <p
          v-else-if="step.detail"
          class="mt-0.5 text-xs text-gray-600 break-words"
        >
          {{ step.detail }}
        </p>
        <p v-if="step.at" class="mt-0.5 text-xs text-gray-500">
          {{ formatIntegrityTimestamp(step.at) }}
        </p>
      </div>
    </li>
  </ol>
</template>

<script setup lang="ts">
import type { PublicIntegrityTimelineStep } from '~/types/audit/publicIntegrity'
import { formatIntegrityTimestamp } from '~/utils/audit/formatIntegrityTimestamp'
import { integrityTimelineDotClass } from '~/utils/audit/integrityTimelineToneClass'

defineProps<{
  steps: PublicIntegrityTimelineStep[]
}>()
</script>
