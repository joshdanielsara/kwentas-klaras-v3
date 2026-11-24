import type { AuditIntegrityBatch } from '@prisma/client'
import {
  INTEGRITY_HISTORY_SCOPE,
  type IntegrityHistoryScope,
} from '../../../app/constants/audit/integrityHistoryScope'
import type { HistoricalBatchVerifyEntry } from './aggregateHistoricalBatchVerify'

export interface SealHistoryEntry {
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

const toIso = (value?: Date | null): string | null => {
  if (!value) {
    return null
  }
  return value.toISOString()
}

/** Public/admin seal history registry rows from batches + optional verify results. */
export const buildSealHistoryEntries = (input: {
  batches: AuditIntegrityBatch[]
  batchResults?: HistoricalBatchVerifyEntry[]
}): SealHistoryEntry[] => {
  const resultById = new Map(
    (input.batchResults || []).map((entry) => [entry.batchId, entry])
  )

  return input.batches.map((batch, index) => {
    const verify = resultById.get(batch.id)
    return {
      batchId: batch.id,
      merkleRoot: batch.merkleRoot,
      status: batch.status,
      leafCount: batch.leafCount,
      sealedAt: toIso(batch.sealedAt),
      hasOtsProof: Boolean(batch.otsProof),
      isLatest: index === 0,
      verified: verify ? verify.verified : null,
      verifyDetail: verify?.detail ?? null,
      historyScope: verify
        ? INTEGRITY_HISTORY_SCOPE.ALL_BATCHES
        : INTEGRITY_HISTORY_SCOPE.LATEST_ONLY,
    }
  })
}
