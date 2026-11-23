import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createAbility } from '../../abilities'
import { canAbilityAccessPath, findFirstAllowedAdminPath } from '../adminNavAccess'

const activeUser = {
  firstName: 'Test',
  lastName: 'User',
  username: 'test',
  email: 'test@example.com',
  role: 'staffs',
  department: 'Budget',
  status: 'Active' as const,
}

describe('adminNavAccess', () => {
  it('allows manage:all for every admin nav path', () => {
    const ability = createAbility({
      ...activeUser,
      role: 'admin',
      permissions: [{ key: 'manage:all', action: 'manage', subject: 'all' }],
    })
    assert.equal(canAbilityAccessPath(ability, '/admin/settings'), true)
    assert.equal(canAbilityAccessPath(ability, '/admin/users'), true)
  })

  it('hides Settings without read:Settings', () => {
    const ability = createAbility({
      ...activeUser,
      permissions: [
        { key: 'read:Dashboard', action: 'read', subject: 'Dashboard' },
        { key: 'read:Project', action: 'read', subject: 'Project' },
      ],
    })
    assert.equal(canAbilityAccessPath(ability, '/admin'), true)
    assert.equal(canAbilityAccessPath(ability, '/admin/settings'), false)
    assert.equal(findFirstAllowedAdminPath(ability), '/admin')
  })
})
