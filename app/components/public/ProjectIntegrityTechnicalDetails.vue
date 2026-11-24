<template>
  <details class="group rounded-xl border border-gray-200 bg-white open:shadow-sm">
    <summary
      class="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50/80 rounded-xl"
    >
      <span class="inline-flex items-center gap-2.5 min-w-0">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700 shrink-0">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
            />
          </svg>
        </span>
        <span class="min-w-0">
          <span class="block">{{ INTEGRITY_TECHNICAL_DETAILS_TITLE }}</span>
          <span class="block text-xs font-normal text-gray-500 mt-0.5">
            {{ INTEGRITY_TECHNICAL_DETAILS_SUBTITLE }}
          </span>
        </span>
      </span>
      <span class="inline-flex items-center gap-2 shrink-0">
        <span class="hidden sm:inline text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
          {{ sealedCount }} of {{ activityCount }} locked
        </span>
        <svg
          class="h-4 w-4 text-gray-400 transition-transform group-open:rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </summary>

    <div class="border-t border-gray-200 px-4 py-4 space-y-4">
      <p class="text-sm text-gray-700 leading-relaxed">
        {{ INTEGRITY_TECHNICAL_DETAILS_INTRO }}
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
          <p class="text-xs text-gray-500">{{ INTEGRITY_TECHNICAL_FIELD.SEALED_AT.label }}</p>
          <p class="mt-0.5 text-sm font-semibold text-gray-900">
            {{ sealedAt ? formatIntegrityTimestamp(sealedAt) : 'Not sealed yet' }}
          </p>
        </div>

        <div class="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
          <p class="text-xs text-gray-500">{{ INTEGRITY_TECHNICAL_FIELD.COVERAGE.label }}</p>
          <p class="mt-0.5 text-sm font-semibold text-gray-900">
            {{ sealedCount }} of {{ activityCount }} log
            {{ activityCount === 1 ? 'entry' : 'entries' }}
          </p>
        </div>

        <div
          v-if="historyBatchCount != null && historyBatchCount > 0"
          class="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 sm:col-span-2"
        >
          <p class="text-xs text-gray-500">{{ INTEGRITY_TECHNICAL_FIELD.HISTORY.label }}</p>
          <p class="mt-0.5 text-sm font-semibold text-gray-900">
            {{ historyVerifiedCount ?? 0 }} of {{ historyBatchCount }} sealed
            {{ historyBatchCount === 1 ? 'batch' : 'batches' }} still match
          </p>
          <p class="mt-0.5 text-xs text-gray-500">
            {{ INTEGRITY_TECHNICAL_FIELD.HISTORY.help }}
          </p>
        </div>
      </div>

      <p v-if="verifyDetail" class="text-sm text-gray-700">
        <span class="font-semibold text-gray-900">{{ INTEGRITY_TECHNICAL_FIELD.VERIFY.label }}:</span>
        {{ verifyDetail }}
      </p>

      <details class="rounded-lg border border-gray-200 bg-white">
        <summary class="cursor-pointer list-none px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 rounded-lg">
          {{ INTEGRITY_TECHNICAL_CODES_TITLE }}
        </summary>
        <div class="border-t border-gray-100 px-3 py-3 space-y-3">
          <div class="space-y-1">
            <div class="flex items-center justify-between gap-2">
              <p class="text-xs text-gray-500">{{ INTEGRITY_TECHNICAL_FIELD.BATCH.label }}</p>
              <button
                v-if="batchId"
                type="button"
                class="shrink-0 rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                @click="copyValue(batchId, 'batch')"
              >
                {{ copiedKey === 'batch' ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <p class="rounded-md bg-gray-50 px-2.5 py-1.5 text-xs font-mono text-gray-800 break-all">
              {{ batchId || '—' }}
            </p>
          </div>

          <div class="space-y-1">
            <div class="flex items-center justify-between gap-2">
              <p class="text-xs text-gray-500">{{ INTEGRITY_TECHNICAL_FIELD.ROOT.label }}</p>
              <button
                v-if="merkleRoot"
                type="button"
                class="shrink-0 rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                @click="copyValue(merkleRoot, 'root')"
              >
                {{ copiedKey === 'root' ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <p class="rounded-md bg-gray-50 px-2.5 py-1.5 text-xs font-mono text-gray-800 break-all">
              {{ merkleRoot || '—' }}
            </p>
          </div>
        </div>
      </details>

      <div class="rounded-lg border border-emerald-200 bg-emerald-50/50 px-3 py-3 space-y-2.5">
        <div>
          <p class="text-sm font-semibold text-emerald-950">
            {{ INTEGRITY_INDEPENDENT_VERIFY_TITLE }}
          </p>
          <p class="mt-0.5 text-xs text-emerald-900/80">
            {{ INTEGRITY_INDEPENDENT_VERIFY_INTRO }}
          </p>
        </div>

        <ol class="list-decimal pl-4 space-y-1 text-sm text-emerald-950/90">
          <li v-for="(step, index) in INTEGRITY_INDEPENDENT_VERIFY_STEPS" :key="index">
            {{ step }}
          </li>
        </ol>

        <div class="flex flex-wrap items-center gap-2 pt-0.5">
          <button
            v-if="otsProof"
            type="button"
            class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
            @click="onDownloadProof"
          >
            {{ INTEGRITY_INDEPENDENT_VERIFY_DOWNLOAD_LABEL }}
          </button>
          <button
            v-else
            type="button"
            class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            :disabled="reloading"
            @click="emit('reload')"
          >
            {{ reloading ? 'Loading…' : INTEGRITY_INDEPENDENT_VERIFY_RELOAD_LABEL }}
          </button>
          <a
            :href="OPENTIMESTAMPS_VERIFY_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border border-emerald-300 bg-white text-emerald-900 hover:bg-emerald-50 transition-colors"
          >
            {{ INTEGRITY_INDEPENDENT_VERIFY_LINK_LABEL }}
          </a>
        </div>

        <p v-if="!otsProof" class="text-xs text-amber-900">
          {{ INTEGRITY_INDEPENDENT_VERIFY_MISSING_PROOF }}
          {{ INTEGRITY_INDEPENDENT_VERIFY_MISSING_PROOF_HOW[0] }}
        </p>
      </div>

      <p class="text-xs text-gray-500">
        {{ INTEGRITY_TECHNICAL_FOOTER }}
      </p>
    </div>
  </details>
</template>

<script setup lang="ts">
import {
  INTEGRITY_INDEPENDENT_VERIFY_DOWNLOAD_LABEL,
  INTEGRITY_INDEPENDENT_VERIFY_INTRO,
  INTEGRITY_INDEPENDENT_VERIFY_LINK_LABEL,
  INTEGRITY_INDEPENDENT_VERIFY_MISSING_PROOF,
  INTEGRITY_INDEPENDENT_VERIFY_MISSING_PROOF_HOW,
  INTEGRITY_INDEPENDENT_VERIFY_RELOAD_LABEL,
  INTEGRITY_INDEPENDENT_VERIFY_STEPS,
  INTEGRITY_INDEPENDENT_VERIFY_TITLE,
  INTEGRITY_TECHNICAL_CODES_TITLE,
  INTEGRITY_TECHNICAL_DETAILS_INTRO,
  INTEGRITY_TECHNICAL_DETAILS_SUBTITLE,
  INTEGRITY_TECHNICAL_DETAILS_TITLE,
  INTEGRITY_TECHNICAL_FIELD,
  INTEGRITY_TECHNICAL_FOOTER,
  OPENTIMESTAMPS_VERIFY_URL,
} from '~/constants/audit/integrityTechnicalDetailsCopy'
import { downloadOtsProof } from '~/utils/audit/downloadOtsProof'
import { formatIntegrityTimestamp } from '~/utils/audit/formatIntegrityTimestamp'

const props = defineProps<{
  sealedAt: string | Date | null
  batchId: string | null
  merkleRoot: string | null
  otsProof?: string | null
  sealedCount: number
  activityCount: number
  verifyDetail?: string | null
  historyBatchCount?: number | null
  historyVerifiedCount?: number | null
  reloading?: boolean
}>()

const emit = defineEmits<{
  reload: []
}>()

const copiedKey = ref<'batch' | 'root' | null>(null)
let copyResetTimer: ReturnType<typeof setTimeout> | null = null

const copyValue = async (value: string, key: 'batch' | 'root') => {
  try {
    await navigator.clipboard.writeText(value)
    copiedKey.value = key
    if (copyResetTimer) {
      clearTimeout(copyResetTimer)
    }
    copyResetTimer = setTimeout(() => {
      copiedKey.value = null
    }, 1500)
  } catch (error: unknown) {
    console.error('[ProjectIntegrityTechnicalDetails] copy failed', {
      error: error instanceof Error ? error.message : 'unknown',
    })
  }
}

const onDownloadProof = () => {
  if (!props.otsProof) {
    return
  }
  const safeId = (props.batchId || 'proof').replace(/[^a-zA-Z0-9_-]/g, '')
  try {
    downloadOtsProof(props.otsProof, `kwentas-klaras-integrity-${safeId}.ots`)
  } catch (error: unknown) {
    console.error('[ProjectIntegrityTechnicalDetails] download failed', {
      error: error instanceof Error ? error.message : 'unknown',
    })
  }
}

onBeforeUnmount(() => {
  if (copyResetTimer) {
    clearTimeout(copyResetTimer)
  }
})
</script>
