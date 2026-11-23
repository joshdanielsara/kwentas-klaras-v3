import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { roleRequiresDepartment } from '../roleRequiresDepartment'

describe('roleRequiresDepartment', () => {
  it('does not require department for admin', () => {
    assert.equal(roleRequiresDepartment('admin'), false)
    assert.equal(roleRequiresDepartment('Admin'), false)
  })

  it('requires department for staff and custom roles', () => {
    assert.equal(roleRequiresDepartment('staffs'), true)
    assert.equal(roleRequiresDepartment('budget-officer'), true)
  })
})
