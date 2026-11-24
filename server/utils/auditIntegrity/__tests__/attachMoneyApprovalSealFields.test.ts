import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  attachMoneyApprovalSealFields,
  collectMoneyApprovalIds,
} from '../attachMoneyApprovalSealFields'

describe('attachMoneyApprovalSealFields', () => {
  it('merges approval status and requestId when approvalId is set', () => {
    const map = new Map([
      ['ap1', { id: 'ap1', status: 'approved', requestId: 'req-1' }],
    ])
    const next = attachMoneyApprovalSealFields(
      {
        id: 'b1',
        projectId: 'p1',
        amount: 10,
        reason: 'Extra',
        status: 'approved',
        approvalId: 'ap1',
      },
      map
    )
    assert.equal(next.approvalId, 'ap1')
    assert.equal(next.approvalStatus, 'approved')
    assert.equal(next.requestId, 'req-1')
  })

  it('leaves payloads without approvalId unchanged', () => {
    const next = attachMoneyApprovalSealFields(
      {
        id: 'b1',
        projectId: 'p1',
        amount: 10,
        reason: 'Extra',
        status: 'pending',
      },
      new Map()
    )
    assert.equal(next.approvalId, undefined)
    assert.equal(next.approvalStatus, undefined)
  })

  it('collects unique approval ids', () => {
    const ids = collectMoneyApprovalIds([
      { approvalId: 'a' },
      { approvalId: 'a' },
      { approvalId: null },
      { approvalId: 'b' },
    ])
    assert.deepEqual(ids.sort(), ['a', 'b'])
  })
})
