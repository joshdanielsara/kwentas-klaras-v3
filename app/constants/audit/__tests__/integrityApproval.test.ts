import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  INTEGRITY_APPROVAL_RESOURCE,
  INTEGRITY_APPROVAL_STATUS,
} from '../integrityApproval'

describe('integrityApproval', () => {
  it('exports stable approval statuses and resource kinds', () => {
    assert.equal(INTEGRITY_APPROVAL_STATUS.APPROVED, 'approved')
    assert.equal(INTEGRITY_APPROVAL_RESOURCE.DISBURSEMENT, 'disbursement')
  })
})
