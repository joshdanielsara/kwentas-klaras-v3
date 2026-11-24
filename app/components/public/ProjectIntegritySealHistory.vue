<template>
  <div class="rounded-lg border border-gray-100 bg-white/70 px-3 py-3 space-y-3">
    <div>
      <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {{ SEAL_HISTORY_TITLE }}
      </p>
      <p class="mt-1 text-xs text-gray-600">{{ SEAL_HISTORY_INTRO }}</p>
    </div>

    <p v-if="!entries.length" class="text-sm text-gray-600">{{ SEAL_HISTORY_EMPTY }}</p>

    <ul v-else class="space-y-2">
      <li
        v-for="entry in entries"
        :key="entry.batchId"
        class="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
      >
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="min-w-0">
            <p class="text-sm font-semibold text-gray-900 truncate">
              {{ entry.sealedAt ? formatIntegrityTimestamp(entry.sealedAt) : 'Seal date unknown' }}
            </p>
            <p class="mt-0.5 text-xs text-gray-500 font-mono break-all">
              {{ entry.merkleRoot.slice(0, 20) }}…
            </p>
          </div>
          <div class="flex items-center gap-1.5 flex-wrap justify-end">
            <span
              v-if="entry.isLatest"
              class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border bg-blue-50 text-blue-800 border-blue-200"
            >
              {{ SEAL_HISTORY_LATEST_BADGE }}
            </span>
            <span
              class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border"
              :class="verifyBadgeClass(entry.verified)"
            >
              {{ verifyBadgeLabel(entry.verified) }}
            </span>
          </div>
        </div>
        <p v-if="entry.verifyDetail" class="mt-1 text-xs text-gray-600">{{ entry.verifyDetail }}</p>
        <button
          type="button"
          class="mt-2 text-xs font-medium text-blue-700 hover:underline"
          @click="emit('download-pack', 'project', projectId)"
        >
          {{ SEAL_HISTORY_DOWNLOAD_PACK }} (project leaf)
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { PublicSealHistoryEntry } from '~/types/audit/publicIntegrity'
import {
  SEAL_HISTORY_DOWNLOAD_PACK,
  SEAL_HISTORY_EMPTY,
  SEAL_HISTORY_INTRO,
  SEAL_HISTORY_LATEST_BADGE,
  SEAL_HISTORY_TITLE,
} from '~/constants/audit/sealHistoryCopy'
import { formatIntegrityTimestamp } from '~/utils/audit/formatIntegrityTimestamp'

defineProps<{
  entries: PublicSealHistoryEntry[]
  projectId: string
}>()

const emit = defineEmits<{
  'download-pack': [kind: string, recordId: string]
}>()

const verifyBadgeLabel = (verified: boolean | null) => {
  if (verified === true) return 'Verified'
  if (verified === false) return 'Failed'
  return 'Not checked'
}

const verifyBadgeClass = (verified: boolean | null) => {
  if (verified === true) return 'bg-emerald-50 text-emerald-800 border-emerald-200'
  if (verified === false) return 'bg-red-50 text-red-800 border-red-200'
  return 'bg-gray-100 text-gray-700 border-gray-200'
}
</script>
