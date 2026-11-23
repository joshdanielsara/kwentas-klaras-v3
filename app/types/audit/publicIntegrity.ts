import type { PublicIntegrityStatus } from '~/constants/audit/integrityStatus'
import type {
  IntegrityTimelineStepKind,
  IntegrityTimelineTone,
} from '~/constants/audit/integrityTimeline'

export interface PublicIntegrityTimelineStep {
  kind: IntegrityTimelineStepKind
  label: string
  detail: string | null
  at: string | null
  tone: IntegrityTimelineTone
}

export interface PublicIntegrityAlteration {
  field: string
  label: string
  sealedValue: string
  currentValue: string
}

export interface PublicProjectIntegrity {
  projectId: string
  status: PublicIntegrityStatus
  label: string
  activityCount: number
  sealedCount: number
  sealedAt: string | Date | null
  merkleRoot: string | null
  otsProof: string | null
  batchId: string | null
  batchStatus: string | null
  verified: boolean | null
  verifyDetail: string | null
  alterations?: PublicIntegrityAlteration[]
  timeline: PublicIntegrityTimelineStep[]
  helperText: string
}
