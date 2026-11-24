import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import type { AuditIntegrityBatch } from '@prisma/client'
import { buildSealHistoryEntries } from '../buildSealHistoryEntries'
import { INTEGRITY_HISTORY_SCOPE } from '../../../../app/constants/audit/integrityHistoryScope'

describe('buildSealHistoryEntries', () => {
  it('marks the first batch as latest and attaches verify results', () => {
    const sealedAt = new Date('2026-02-01T00:00:00.000Z')
    const batches = [
      {
        id: 'batch-new',
        merkleRoot: 'root-new',
        otsProof: 'ots',
        status: 'confirmed',
        leafCount: 3,
        sealedAt,
      },
      {
        id: 'batch-old',
        merkleRoot: 'root-old',
        otsProof: null,
        status: 'submitted',
        leafCount: 1,
        sealedAt: null,
      },
    ] as AuditIntegrityBatch[]

    const entries = buildSealHistoryEntries({
      batches,
      batchResults: [
        {
          batchId: 'batch-new',
          verified: true,
          detail: 'ok',
          isLatest: true,
          checkLiveProjectAndFinancial: true,
        },
        {
          batchId: 'batch-old',
          verified: false,
          detail: 'fail',
          isLatest: false,
          checkLiveProjectAndFinancial: false,
        },
      ],
    })

    assert.equal(entries.length, 2)
    assert.equal(entries[0]?.isLatest, true)
    assert.equal(entries[0]?.verified, true)
    assert.equal(entries[0]?.hasOtsProof, true)
    assert.equal(entries[0]?.historyScope, INTEGRITY_HISTORY_SCOPE.ALL_BATCHES)
    assert.equal(entries[1]?.isLatest, false)
    assert.equal(entries[1]?.verified, false)
    assert.equal(entries[1]?.hasOtsProof, false)
  })
})
