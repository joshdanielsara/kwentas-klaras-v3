import type { PublicIntegrityStatus } from '~/constants/audit/integrityStatus'
import type { IntegrityHistoryScope } from '~/constants/audit/integrityHistoryScope'
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

export interface PublicIntegrityBatchResult {
  batchId: string
  verified: boolean
  detail: string
  isLatest: boolean
  checkLiveProjectAndFinancial: boolean
}

export interface PublicSealHistoryEntry {
  batchId: string
  merkleRoot: string
  status: string
  leafCount: number
  sealedAt: string | null
  hasOtsProof: boolean
  isLatest: boolean
  verified: boolean | null
  verifyDetail: string | null
  historyScope: IntegrityHistoryScope
}

export interface PublicFollowTheMoneyStep {
  kind: 'appropriation' | 'budget' | 'obligation' | 'disbursement'
  label: string
  amount: number
  date: string | null
  detail: string | null
  sealed: boolean
  sealedLabel: string
  recordId: string | null
}

export interface PublicFollowTheMoneyTrail {
  steps: PublicFollowTheMoneyStep[]
  appropriationTotal: number
  obligationTotal: number
  disbursementTotal: number
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
  historyScope?: IntegrityHistoryScope
  historyBatchCount?: number
  historyVerifiedCount?: number
  historyFailedCount?: number
  batchResults?: PublicIntegrityBatchResult[]
  sealHistory?: PublicSealHistoryEntry[]
  moneyTrail?: PublicFollowTheMoneyTrail
  timeline: PublicIntegrityTimelineStep[]
  helperText: string
}
