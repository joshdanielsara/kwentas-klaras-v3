<template>
  <svg
    :class="iconClasses"
    :width="size"
    :height="size"
    fill="none"
    stroke="currentColor"
    :viewBox="viewBox"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke-width="strokeWidth"
      :d="path"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { STAT_ICONS, ACTION_ICONS, NAVIGATION_ICONS } from '../../constants/ui/icons'
import type { StatIconKey, ActionIconKey, NavigationIconKey } from '../../constants/ui/icons'

interface IconProps {
  name: StatIconKey | ActionIconKey | NavigationIconKey
  size?: number | string
  class?: string
  strokeWidth?: number | string
}

const props = withDefaults(defineProps<IconProps>(), {
  size: 24,
  strokeWidth: 2,
  class: '',
})

const iconData = computed(() => {
  if (props.name in STAT_ICONS) {
    return STAT_ICONS[props.name as StatIconKey]
  }
  if (props.name in ACTION_ICONS) {
    return ACTION_ICONS[props.name as ActionIconKey]
  }
  if (props.name in NAVIGATION_ICONS) {
    return NAVIGATION_ICONS[props.name as NavigationIconKey]
  }
  return null
})

const path = computed(() => iconData.value?.path || '')
const viewBox = computed(() => iconData.value?.viewBox || '0 0 24 24')
const iconClasses = computed(() => props.class || '')
</script>

