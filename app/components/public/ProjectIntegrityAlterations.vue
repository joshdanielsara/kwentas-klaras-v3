<template>
  <div v-if="alterations.length" class="rounded-lg border border-red-200 bg-white/80 px-3 py-3 space-y-2">
    <p class="text-xs font-semibold uppercase tracking-wide text-red-700">
      {{ INTEGRITY_ALTERATIONS_TITLE }}
    </p>
    <ul class="space-y-2">
      <li
        v-for="item in alterations"
        :key="item.field"
        class="rounded-md border border-red-100 bg-red-50/80 px-2.5 py-2"
      >
        <p class="text-xs font-semibold text-red-900">{{ item.label }}</p>
        <p class="mt-1 text-xs text-red-800/90 break-words">
          <span class="font-medium">{{ INTEGRITY_ALTERATIONS_SEALED_LABEL }}:</span>
          {{ item.sealedValue }}
        </p>
        <p class="mt-0.5 text-xs text-red-900 break-words">
          <span class="font-medium">{{ INTEGRITY_ALTERATIONS_NOW_LABEL }}:</span>
          {{ item.currentValue }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {
  INTEGRITY_ALTERATIONS_NOW_LABEL,
  INTEGRITY_ALTERATIONS_SEALED_LABEL,
  INTEGRITY_ALTERATIONS_TITLE,
} from '~/constants/audit/integrityAlterationsCopy'
import type { PublicIntegrityAlteration } from '~/types/audit/publicIntegrity'

defineProps<{
  alterations: PublicIntegrityAlteration[]
}>()
</script>
