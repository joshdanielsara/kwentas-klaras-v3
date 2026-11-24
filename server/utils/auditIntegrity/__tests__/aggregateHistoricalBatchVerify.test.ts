import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { aggregateHistoricalBatchVerify } from '../aggregateHistoricalBatchVerify'
import type { BatchIntegrityVerifyResult } from '../verifyBatchIntegrity'
import { INTEGRITY_HISTORY_SCOPE } from '../../../../app/constants/audit/integrityHistoryScope'

const okResult = (detail = 'Bitcoin attested'): BatchIntegrityVerifyResult => ({
  merkleOk: true,
  otsOk: true,
  activityHashesMatch: true,
  projectDataMatch: true,
  financialDataMatch: true,
  verified: true,
  detail,
  alterations: [],
})

const failResult = (detail: string): BatchIntegrityVerifyResult => ({
  merkleOk: false,
  otsOk: false,
  activityHashesMatch: false,
  projectDataMatch: null,
  financialDataMatch: null,
  verified: false,
  detail,
  alterations: [],
})

describe('aggregateHistoricalBatchVerify', () => {
  it('returns none scope when there are no batches', () => {
    const aggregate = aggregateHistoricalBatchVerify([])
    assert.equal(aggregate.historyScope, INTEGRITY_HISTORY_SCOPE.NONE)
    assert.equal(aggregate.verified, null)
    assert.equal(aggregate.historyBatchCount, 0)
  })

  it('passes when every historical batch verifies', () => {
    const aggregate = aggregateHistoricalBatchVerify([
      {
        batchId: 'latest',
        isLatest: true,
        checkLiveProjectAndFinancial: true,
        result: okResult(),
      },
      {
        batchId: 'older',
        isLatest: false,
        checkLiveProjectAndFinancial: false,
        result: okResult(),
      },
    ])
    assert.equal(aggregate.verified, true)
    assert.equal(aggregate.historyScope, INTEGRITY_HISTORY_SCOPE.ALL_BATCHES)
    assert.equal(aggregate.historyBatchCount, 2)
    assert.equal(aggregate.historyVerifiedCount, 2)
    assert.equal(aggregate.historyFailedCount, 0)
    assert.match(aggregate.detail || '', /2 sealed batches checked/)
  })

  it('fails the project when any older batch fails', () => {
    const aggregate = aggregateHistoricalBatchVerify([
      {
        batchId: 'latest',
        isLatest: true,
        checkLiveProjectAndFinancial: true,
        result: okResult(),
      },
      {
        batchId: 'older',
        isLatest: false,
        checkLiveProjectAndFinancial: false,
        result: failResult('Activity history altered'),
      },
    ])
    assert.equal(aggregate.verified, false)
    assert.equal(aggregate.historyFailedCount, 1)
    assert.match(aggregate.detail || '', /1 batch failed/)
    assert.match(aggregate.detail || '', /Activity history altered/)
  })
})
