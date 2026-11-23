import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { INTEGRITY_VERIFY_DETAIL } from '../integrityVerifyDetail'
import { PUBLIC_INTEGRITY_LABELS, PUBLIC_INTEGRITY_STATUS } from '../integrityStatus'

describe('integrityVerifyDetail', () => {
  it('uses short badge-friendly verify messages', () => {
    assert.equal(INTEGRITY_VERIFY_DETAIL.PROJECT_DATA_MISMATCH, 'Project data altered')
    assert.equal(INTEGRITY_VERIFY_DETAIL.ACTIVITY_HASH_MISMATCH, 'Activity history altered')
  })

  it('labels failed status as records altered', () => {
    assert.equal(PUBLIC_INTEGRITY_LABELS[PUBLIC_INTEGRITY_STATUS.FAILED], 'Records altered')
  })
})
