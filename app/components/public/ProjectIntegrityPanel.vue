<template>
  <details
    v-if="accordion"
    class="group rounded-xl border open:shadow-sm"
    :class="panelClass"
  >
    <summary
      class="flex cursor-pointer list-none items-center justify-between gap-3 px-3.5 py-3 sm:px-4 sm:py-3.5"
    >
      <div class="flex items-center gap-3 min-w-0">
        <div
          class="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
          :class="iconWrapClass"
          aria-hidden="true"
        >
          <svg class="h-5 w-5" :class="iconClass" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            Record integrity
          </p>
          <div class="mt-1 flex items-center gap-2 flex-wrap">
            <div
              v-if="checking && !integrity"
              class="h-6 w-32 rounded-full bg-gray-200 animate-pulse"
              aria-hidden="true"
            ></div>
            <span
              v-else
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border"
              :class="statusClass"
            >
              {{ statusBadgeLabel }}
            </span>
          </div>
          <p class="mt-1 text-xs font-normal text-gray-500 group-open:hidden">
            {{ INTEGRITY_PANEL_ACCORDION_HINT }}
          </p>
        </div>
      </div>
      <svg
        class="h-4 w-4 text-gray-400 transition-transform group-open:rotate-180 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </summary>

    <div class="border-t px-3.5 py-3 sm:px-4 sm:py-3.5 space-y-3" :class="accordionBodyBorderClass">
      <ProjectIntegrityPanelBody
        :integrity="integrity"
        :checking="checking"
        :error-message="errorMessage"
        :is-altered="isAltered"
        :show-timeline="showTimeline"
        :helper-line="helperLine"
        :project-id="projectId"
        @recheck="onRecheck"
        @reload-stamp="onReloadStamp"
      />
    </div>
  </details>

  <div
    v-else
    class="rounded-xl border px-3.5 py-3 sm:px-4 sm:py-3.5 space-y-3"
    :class="panelClass"
  >
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3 min-w-0">
        <div
          class="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
          :class="iconWrapClass"
          aria-hidden="true"
        >
          <svg class="h-5 w-5" :class="iconClass" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            Record integrity
          </p>
          <div class="mt-1 flex items-center gap-2 flex-wrap">
            <div
              v-if="checking && !integrity"
              class="h-6 w-32 rounded-full bg-gray-200 animate-pulse"
              aria-hidden="true"
            ></div>
            <span
              v-else
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border"
              :class="statusClass"
            >
              {{ statusBadgeLabel }}
            </span>
            <span
              v-if="integrity?.sealedAt && !isAltered"
              class="text-xs text-gray-500"
            >
              Sealed {{ formatIntegrityTimestamp(integrity.sealedAt) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <ProjectIntegrityPanelBody
      :integrity="integrity"
      :checking="checking"
      :error-message="errorMessage"
      :is-altered="isAltered"
      :show-timeline="showTimeline"
      :helper-line="helperLine"
      :project-id="projectId"
      @recheck="onRecheck"
      @reload-stamp="onReloadStamp"
    />
  </div>
</template>

<script setup lang="ts">
import ProjectIntegrityPanelBody from '~/components/public/ProjectIntegrityPanelBody.vue'
import { usePublicProjectIntegrity } from '~/composables/public/usePublicProjectIntegrity'
import { PUBLIC_INTEGRITY_HELPER_DEFAULT } from '~/constants/audit/integrityCopy'
import { INTEGRITY_PANEL_ACCORDION_HINT } from '~/constants/audit/integrityPanelActions'
import { PUBLIC_INTEGRITY_STATUS } from '~/constants/audit/integrityStatus'
import { formatIntegrityTimestamp } from '~/utils/audit/formatIntegrityTimestamp'

const props = withDefaults(
  defineProps<{
    projectId: string
    /** Admin project-details tab: always show timeline when sealed */
    alwaysShowTimeline?: boolean
    /** Public carousel: collapsed accordion by default */
    accordion?: boolean
  }>(),
  {
    alwaysShowTimeline: false,
    accordion: false,
  }
)

const {
  integrity,
  checking,
  errorMessage,
  verifyProject,
  statusClass,
} = usePublicProjectIntegrity()

const isAltered = computed(
  () => integrity.value?.status === PUBLIC_INTEGRITY_STATUS.FAILED
)

/** One badge only — prefer specific verify reason over generic status when failed. */
const statusBadgeLabel = computed(() => {
  if (isAltered.value && integrity.value?.verifyDetail) {
    return integrity.value.verifyDetail
  }
  return integrity.value?.label || 'No activity yet'
})

const showTimeline = computed(() => {
  const steps = integrity.value?.timeline || []
  if (steps.length === 0) {
    return false
  }
  if (props.alwaysShowTimeline && (integrity.value?.sealedCount ?? 0) > 0) {
    return true
  }
  return (
    isAltered.value ||
    integrity.value?.status === PUBLIC_INTEGRITY_STATUS.VERIFIED
  )
})

const helperLine = computed(() => {
  return integrity.value?.helperText || PUBLIC_INTEGRITY_HELPER_DEFAULT
})

const panelClass = computed(() => {
  if (isAltered.value) {
    return 'border-red-200 bg-red-50'
  }
  if (integrity.value?.status === PUBLIC_INTEGRITY_STATUS.VERIFIED) {
    return 'border-emerald-200 bg-emerald-50/70'
  }
  return 'border-gray-200 bg-white'
})

const accordionBodyBorderClass = computed(() => {
  if (isAltered.value) {
    return 'border-red-200'
  }
  if (integrity.value?.status === PUBLIC_INTEGRITY_STATUS.VERIFIED) {
    return 'border-emerald-200'
  }
  return 'border-gray-200'
})

const iconWrapClass = computed(() => {
  if (isAltered.value) {
    return 'bg-red-100'
  }
  if (
    integrity.value?.status === PUBLIC_INTEGRITY_STATUS.VERIFIED ||
    integrity.value?.status === PUBLIC_INTEGRITY_STATUS.SEALED
  ) {
    return 'bg-emerald-100'
  }
  return 'bg-blue-50'
})

const iconClass = computed(() => {
  if (isAltered.value) {
    return 'text-red-700'
  }
  if (
    integrity.value?.status === PUBLIC_INTEGRITY_STATUS.VERIFIED ||
    integrity.value?.status === PUBLIC_INTEGRITY_STATUS.SEALED
  ) {
    return 'text-emerald-700'
  }
  return 'text-blue-700'
})

const onRecheck = async () => {
  await verifyProject(props.projectId)
}

const onReloadStamp = async () => {
  await verifyProject(props.projectId)
}

watch(
  () => props.projectId,
  async (id) => {
    if (id) {
      await verifyProject(id)
    }
  },
  { immediate: true }
)
</script>
