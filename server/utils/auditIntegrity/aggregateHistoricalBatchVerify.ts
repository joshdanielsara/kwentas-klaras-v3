import type { BatchIntegrityVerifyResult } from './verifyBatchIntegrity'
import type { ProjectIntegrityAlteration } from './diffProjectIntegritySnapshots'
import { formatHistoricalVerifyDetail } from '../../../app/constants/audit/integrityVerifyDetail'
import {
  INTEGRITY_HISTORY_SCOPE,
  type IntegrityHistoryScope,
} from '../../../app/constants/audit/integrityHistoryScope'

export interface HistoricalBatchVerifyEntry {
  batchId: string
  verified: boolean
  detail: string
  isLatest: boolean
  checkLiveProjectAndFinancial: boolean
}

export interface AggregateHistoricalBatchVerifyResult {
  verified: boolean | null
  detail: string | null
  alterations: ProjectIntegrityAlteration[]
  historyScope: IntegrityHistoryScope
  historyBatchCount: number
  historyVerifiedCount: number
  historyFailedCount: number
  batchResults: HistoricalBatchVerifyEntry[]
}

/**
 * Aggregate per-batch verify results into one project-level outcome.
 * Any failed batch fails the project; all passing → verified.
 */
export const aggregateHistoricalBatchVerify = (
  results: Array<{
    batchId: string
    isLatest: boolean
    checkLiveProjectAndFinancial: boolean
    result: BatchIntegrityVerifyResult
  }>
): AggregateHistoricalBatchVerifyResult => {
  if (results.length === 0) {
    return {
      verified: null,
      detail: null,
      alterations: [],
      historyScope: INTEGRITY_HISTORY_SCOPE.NONE,
      historyBatchCount: 0,
      historyVerifiedCount: 0,
      historyFailedCount: 0,
      batchResults: [],
    }
  }

  const batchResults: HistoricalBatchVerifyEntry[] = results.map((entry) => ({
    batchId: entry.batchId,
    verified: entry.result.verified,
    detail: entry.result.detail,
    isLatest: entry.isLatest,
    checkLiveProjectAndFinancial: entry.checkLiveProjectAndFinancial,
  }))

  const historyVerifiedCount = batchResults.filter((entry) => entry.verified).length
  const historyFailedCount = batchResults.filter((entry) => !entry.verified).length
  const verified = historyFailedCount === 0

  const failedPrimary =
    results.find((entry) => !entry.result.verified)?.result.detail ?? null
  const latestOkDetail =
    results.find((entry) => entry.isLatest)?.result.detail ??
    results[0]?.result.detail ??
    null

  const alterations =
    results.find((entry) => entry.isLatest && entry.result.alterations.length > 0)
      ?.result.alterations ??
    results.find((entry) => entry.result.alterations.length > 0)?.result.alterations ??
    []

  return {
    verified,
    detail: formatHistoricalVerifyDetail({
      checkedCount: results.length,
      failedCount: historyFailedCount,
      primaryDetail: verified ? latestOkDetail : failedPrimary,
    }),
    alterations,
    historyScope: INTEGRITY_HISTORY_SCOPE.ALL_BATCHES,
    historyBatchCount: results.length,
    historyVerifiedCount,
    historyFailedCount,
    batchResults,
  }
}
