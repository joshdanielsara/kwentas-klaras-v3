<template>
  <div class="space-y-6">
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-50">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 flex items-center justify-center">
              <svg class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">Record Integrity</h3>
              <p class="text-xs text-gray-500">
                Sealed activity history (same check constituents use on the public page)
              </p>
            </div>
          </div>

          <div class="sm:text-right">
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              :disabled="downloading"
              @click="downloadCoaPack(projectId)"
            >
              {{ downloading ? 'Preparing zip…' : 'Download COA pack' }}
            </button>
            <p class="mt-1.5 text-xs text-gray-500 max-w-xs sm:ml-auto">
              Offline zip of manifests, OpenTimestamps proofs, and digests CSV for auditors.
            </p>
            <p v-if="errorMessage" class="mt-1 text-xs text-red-600">{{ errorMessage }}</p>
          </div>
        </div>
      </div>
      <div class="p-6">
        <PublicProjectIntegrityPanel
          :project-id="projectId"
          always-show-timeline
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PublicProjectIntegrityPanel from '~/components/public/ProjectIntegrityPanel.vue'
import { useCoaIntegrityPackDownload } from '~/composables/admin/useCoaIntegrityPackDownload'

defineProps<{
  projectId: string
}>()

const { downloading, errorMessage, downloadCoaPack } = useCoaIntegrityPackDownload()
</script>
