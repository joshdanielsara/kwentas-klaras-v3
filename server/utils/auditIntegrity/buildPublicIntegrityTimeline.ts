import {
  INTEGRITY_TIMELINE_LABELS,
  INTEGRITY_TIMELINE_STEP,
  INTEGRITY_TIMELINE_TONE,
  type IntegrityTimelineStepKind,
  type IntegrityTimelineTone,
} from '../../../app/constants/audit/integrityTimeline'
import { INTEGRITY_VERIFY_DETAIL } from '../../../app/constants/audit/integrityVerifyDetail'

export interface PublicIntegrityTimelineStep {
  kind: IntegrityTimelineStepKind
  label: string
  detail: string | null
  at: string | null
  tone: IntegrityTimelineTone
}

export const buildPublicIntegrityTimeline = (input: {
  activityCount: number
  sealedCount: number
  sealedAt?: Date | string | null
  verified?: boolean | null
  verifyDetail?: string | null
  checkedAt?: Date | string | null
}): PublicIntegrityTimelineStep[] => {
  const steps: PublicIntegrityTimelineStep[] = []

  if (input.activityCount <= 0) {
    return steps
  }

  steps.push({
    kind: INTEGRITY_TIMELINE_STEP.RECORDED,
    label: INTEGRITY_TIMELINE_LABELS[INTEGRITY_TIMELINE_STEP.RECORDED],
    detail: `${input.activityCount} activit${input.activityCount === 1 ? 'y' : 'ies'} on file`,
    at: null,
    tone: INTEGRITY_TIMELINE_TONE.NEUTRAL,
  })

  if (input.sealedCount > 0) {
    const sealedAt =
      input.sealedAt instanceof Date
        ? input.sealedAt.toISOString()
        : input.sealedAt ?? null

    steps.push({
      kind: INTEGRITY_TIMELINE_STEP.SEALED,
      label: INTEGRITY_TIMELINE_LABELS[INTEGRITY_TIMELINE_STEP.SEALED],
      detail: `${input.sealedCount} of ${input.activityCount} sealed`,
      at: sealedAt,
      tone: INTEGRITY_TIMELINE_TONE.SUCCESS,
    })
  }

  if (input.verified === null || input.verified === undefined) {
    return steps
  }

  const checkedAt =
    input.checkedAt instanceof Date
      ? input.checkedAt.toISOString()
      : input.checkedAt ?? new Date().toISOString()

  steps.push({
    kind: INTEGRITY_TIMELINE_STEP.CHECKED,
    label: INTEGRITY_TIMELINE_LABELS[INTEGRITY_TIMELINE_STEP.CHECKED],
    detail: null,
    at: checkedAt,
    tone: INTEGRITY_TIMELINE_TONE.NEUTRAL,
  })

  if (input.verified) {
    steps.push({
      kind: INTEGRITY_TIMELINE_STEP.INTACT,
      label: INTEGRITY_TIMELINE_LABELS[INTEGRITY_TIMELINE_STEP.INTACT],
      detail: input.verifyDetail,
      at: checkedAt,
      tone: INTEGRITY_TIMELINE_TONE.SUCCESS,
    })
    return steps
  }

  steps.push({
    kind: INTEGRITY_TIMELINE_STEP.ALTERED,
    label: INTEGRITY_TIMELINE_LABELS[INTEGRITY_TIMELINE_STEP.ALTERED],
    detail: input.verifyDetail || INTEGRITY_VERIFY_DETAIL.DIGEST_FALLBACK,
    at: checkedAt,
    tone: INTEGRITY_TIMELINE_TONE.DANGER,
  })

  return steps
}
