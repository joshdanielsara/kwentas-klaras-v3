import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createAbility } from '../index'

const baseUser = {
  firstName: 'Test',
  lastName: 'User',
  username: 'test',
  email: 'test@example.com',
  role: 'staffs',
  department: 'Budget',
  status: 'Active' as const,
}

describe('createAbility', () => {
  it('denies everything for inactive users', () => {
    const ability = createAbility({ ...baseUser, status: 'Inactive', permissions: [{ key: 'manage:all', action: 'manage', subject: 'all' }] })
    assert.equal(ability.can('manage', 'all'), false)
  })

  it('grants manage all when permission is present', () => {
    const ability = createAbility({
      ...baseUser,
      role: 'admin',
      permissions: [{ key: 'manage:all', action: 'manage', subject: 'all' }],
    })
    assert.equal(ability.can('manage', 'all'), true)
    assert.equal(ability.can('delete', 'User'), true)
  })

  it('grants only listed permissions for staff-like roles', () => {
    const ability = createAbility({
      ...baseUser,
      permissions: [
        { key: 'read:Project', action: 'read', subject: 'Project' },
        { key: 'update:Profile', action: 'update', subject: 'Profile' },
      ],
    })
    assert.equal(ability.can('read', 'Project'), true)
    assert.equal(ability.can('update', 'Profile'), true)
    assert.equal(ability.can('create', 'Project'), false)
  })
})
