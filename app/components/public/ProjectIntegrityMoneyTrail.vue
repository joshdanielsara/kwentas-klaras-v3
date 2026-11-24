<template>
  <div v-if="trail && trail.steps.length" class="rounded-lg border border-gray-100 bg-white/70 px-3 py-3 space-y-3">
    <div>
      <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {{ FOLLOW_THE_MONEY_TITLE }}
      </p>
      <p class="mt-1 text-xs text-gray-600">{{ FOLLOW_THE_MONEY_INTRO }}</p>
    </div>

    <ol class="space-y-2">
      <li
        v-for="(step, index) in trail.steps"
        :key="`${step.kind}-${step.recordId || index}`"
        class="flex items-start justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
      >
        <div class="min-w-0">
          <p class="text-sm font-semibold text-gray-900">{{ step.label }}</p>
          <p v-if="step.detail" class="mt-0.5 text-xs text-gray-600 break-words">{{ step.detail }}</p>
          <p v-if="step.date" class="mt-0.5 text-xs text-gray-500">
            {{ formatIntegrityTimestamp(step.date) }}
          </p>
        </div>
        <div class="text-right shrink-0">
          <p class="text-sm font-semibold text-gray-900">{{ formatPeso(step.amount) }}</p>
          <span
            class="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border"
            :class="
              step.sealed
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-900 border-amber-200'
            "
          >
            {{ step.sealedLabel }}
          </span>
          <button
            v-if="step.recordId && step.sealed"
            type="button"
            class="mt-1.5 block w-full text-[11px] font-medium text-blue-700 hover:underline"
            @click="emit('download-pack', step.kind, step.recordId)"
          >
            {{ SEAL_HISTORY_DOWNLOAD_PACK }}
          </button>
        </div>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import type { PublicFollowTheMoneyTrail } from '~/types/audit/publicIntegrity'
import {
  FOLLOW_THE_MONEY_INTRO,
  FOLLOW_THE_MONEY_TITLE,
} from '~/constants/audit/followTheMoneyCopy'
import { SEAL_HISTORY_DOWNLOAD_PACK } from '~/constants/audit/sealHistoryCopy'
import { formatIntegrityTimestamp } from '~/utils/audit/formatIntegrityTimestamp'

defineProps<{
  trail: PublicFollowTheMoneyTrail | null | undefined
}>()

const emit = defineEmits<{
  'download-pack': [kind: string, recordId: string]
}>()

const formatPeso = (amount: number) =>
  `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
</script>
