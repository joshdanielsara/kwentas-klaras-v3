export const INTEGRITY_TIMELINE_STEP = {
  RECORDED: 'recorded',
  SEALED: 'sealed',
  CHECKED: 'checked',
  INTACT: 'intact',
  ALTERED: 'altered',
} as const

export type IntegrityTimelineStepKind =
  (typeof INTEGRITY_TIMELINE_STEP)[keyof typeof INTEGRITY_TIMELINE_STEP]

export const INTEGRITY_TIMELINE_LABELS: Record<IntegrityTimelineStepKind, string> = {
  [INTEGRITY_TIMELINE_STEP.RECORDED]: 'Activity history recorded',
  [INTEGRITY_TIMELINE_STEP.SEALED]: 'Records sealed (OpenTimestamps)',
  [INTEGRITY_TIMELINE_STEP.CHECKED]: 'Integrity check run',
  [INTEGRITY_TIMELINE_STEP.INTACT]: 'History matches sealed records',
  [INTEGRITY_TIMELINE_STEP.ALTERED]: 'Sealed records no longer match',
}

export const INTEGRITY_TIMELINE_TONE = {
  NEUTRAL: 'neutral',
  SUCCESS: 'success',
  WARNING: 'warning',
  DANGER: 'danger',
} as const

export type IntegrityTimelineTone =
  (typeof INTEGRITY_TIMELINE_TONE)[keyof typeof INTEGRITY_TIMELINE_TONE]
