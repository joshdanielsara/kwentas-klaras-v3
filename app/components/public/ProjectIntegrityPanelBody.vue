<template>
  <div class="space-y-3">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <p class="text-sm text-gray-600 min-w-0 flex-1">
        {{ helperLine }}
      </p>
      <button
        type="button"
        class="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
        :disabled="checking || !projectId"
        @click="emit('recheck')"
      >
        {{ checking ? INTEGRITY_PANEL_CHECKING_LABEL : INTEGRITY_PANEL_RECHECK_LABEL }}
      </button>
    </div>

    <ProjectIntegrityAlterations
      v-if="isAltered"
      :alterations="integrity?.alterations || []"
    />

    <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
    <p v-if="packError" class="text-sm text-red-600">{{ packError }}</p>

    <div
      v-if="showTimeline"
      class="rounded-lg border px-3 py-3"
      :class="isAltered ? 'border-red-200 bg-red-50/60' : 'border-gray-100 bg-white/70'"
    >
      <p
        class="text-xs font-semibold uppercase tracking-wide mb-3"
        :class="isAltered ? 'text-red-700' : 'text-gray-500'"
      >
        {{ isAltered ? 'Alteration timeline' : 'Integrity timeline' }}
      </p>
      <ProjectIntegrityTimeline :steps="integrity?.timeline || []" />
    </div>

    <ProjectIntegrityMoneyTrail
      :trail="integrity?.moneyTrail"
      @download-pack="onDownloadPack"
    />

    <ProjectIntegritySealHistory
      :entries="integrity?.sealHistory || []"
      :project-id="projectId"
      @download-pack="onDownloadPack"
    />

    <ProjectIntegrityTechnicalDetails
      v-if="integrity?.merkleRoot"
      :sealed-at="integrity.sealedAt"
      :batch-id="integrity.batchId"
      :merkle-root="integrity.merkleRoot"
      :ots-proof="integrity.otsProof"
      :sealed-count="integrity.sealedCount"
      :activity-count="integrity.activityCount"
      :verify-detail="integrity.verifyDetail"
      :history-batch-count="integrity.historyBatchCount"
      :history-verified-count="integrity.historyVerifiedCount"
      :reloading="checking"
      @reload="emit('reload-stamp')"
    />
  </div>
</template>

<script setup lang="ts">
import ProjectIntegrityAlterations from '~/components/public/ProjectIntegrityAlterations.vue'
import ProjectIntegrityTimeline from '~/components/public/ProjectIntegrityTimeline.vue'
import ProjectIntegrityTechnicalDetails from '~/components/public/ProjectIntegrityTechnicalDetails.vue'
import ProjectIntegrityMoneyTrail from '~/components/public/ProjectIntegrityMoneyTrail.vue'
import ProjectIntegritySealHistory from '~/components/public/ProjectIntegritySealHistory.vue'
import {
  INTEGRITY_PANEL_CHECKING_LABEL,
  INTEGRITY_PANEL_RECHECK_LABEL,
} from '~/constants/audit/integrityPanelActions'
import type { PublicProjectIntegrity } from '~/types/audit/publicIntegrity'
import { useIntegrityLeafPackDownload } from '~/composables/public/useIntegrityLeafPackDownload'

const props = defineProps<{
  integrity: PublicProjectIntegrity | null
  checking: boolean
  errorMessage: string
  isAltered: boolean
  showTimeline: boolean
  helperLine: string
  projectId: string
}>()

const emit = defineEmits<{
  recheck: []
  'reload-stamp': []
}>()

const { errorMessage: packError, downloadLeafPack } = useIntegrityLeafPackDownload()

const onDownloadPack = async (kind: string, recordId: string) => {
  const leafKind = kind === 'appropriation' ? 'project' : kind
  await downloadLeafPack(props.projectId, leafKind, recordId)
}
</script>
