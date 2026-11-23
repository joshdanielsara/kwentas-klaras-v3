import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { AUDIT_BATCH_STATUS, PUBLIC_INTEGRITY_STATUS } from '../../../../app/constants/audit/integrityStatus'
import { mapPublicIntegrityStatus } from '../mapPublicIntegrityStatus'

describe('mapPublicIntegrityStatus', () => {
  it('maps empty activities to none', () => {
    assert.equal(
      mapPublicIntegrityStatus({ activityCount: 0, sealedCount: 0 }),
      PUBLIC_INTEGRITY_STATUS.NONE
    )
  })

  it('maps unsealed activities to pending', () => {
    assert.equal(
      mapPublicIntegrityStatus({ activityCount: 3, sealedCount: 0 }),
      PUBLIC_INTEGRITY_STATUS.PENDING
    )
  })

  it('maps submitted batch to sealed', () => {
    assert.equal(
      mapPublicIntegrityStatus({
        activityCount: 3,
        sealedCount: 3,
        batchStatus: AUDIT_BATCH_STATUS.SUBMITTED,
      }),
      PUBLIC_INTEGRITY_STATUS.SEALED
    )
  })

  it('prefers live verify results when everything is sealed', () => {
    assert.equal(
      mapPublicIntegrityStatus({
        activityCount: 2,
        sealedCount: 2,
        batchStatus: AUDIT_BATCH_STATUS.CONFIRMED,
        verified: true,
      }),
      PUBLIC_INTEGRITY_STATUS.VERIFIED
    )
    assert.equal(
      mapPublicIntegrityStatus({
        activityCount: 2,
        sealedCount: 2,
        batchStatus: AUDIT_BATCH_STATUS.CONFIRMED,
        verified: false,
      }),
      PUBLIC_INTEGRITY_STATUS.FAILED
    )
  })

  it('keeps pending while newer activity rows are still unsealed', () => {
    assert.equal(
      mapPublicIntegrityStatus({
        activityCount: 3,
        sealedCount: 2,
        batchStatus: AUDIT_BATCH_STATUS.SUBMITTED,
        verified: true,
      }),
      PUBLIC_INTEGRITY_STATUS.PENDING
    )
  })
})
