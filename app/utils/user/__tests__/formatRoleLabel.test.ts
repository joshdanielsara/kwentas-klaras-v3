import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { formatRoleLabel } from '../formatRoleLabel'

describe('formatRoleLabel', () => {
  it('prefers explicit role name', () => {
    assert.equal(formatRoleLabel('budget_officer', 'Budget Officer'), 'Budget Officer')
  })

  it('maps system role slugs to labels', () => {
    assert.equal(formatRoleLabel('admin'), 'Admin')
    assert.equal(formatRoleLabel('staffs'), 'Staff')
  })

  it('title-cases custom slugs', () => {
    assert.equal(formatRoleLabel('budget-officer'), 'Budget Officer')
  })
})
