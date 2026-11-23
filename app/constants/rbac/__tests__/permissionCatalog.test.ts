import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  ADMIN_NAV_READ_PERMISSION_KEYS,
  ADMIN_PERMISSION_KEYS,
  DEFAULT_PERMISSION_CATALOG,
  PROJECT_DETAIL_READ_PERMISSION_KEYS,
  STAFF_PERMISSION_KEYS,
  buildPermissionKey,
} from '../permissionCatalog'

describe('permissionCatalog', () => {
  it('builds permission keys as action:subject', () => {
    assert.equal(buildPermissionKey('Create', 'Project'), 'create:Project')
  })

  it('includes manage:all in default catalog and admin keys', () => {
    assert.ok(DEFAULT_PERMISSION_CATALOG.some((item) => item.key === 'manage:all'))
    assert.ok(ADMIN_PERMISSION_KEYS.includes('manage:all'))
  })

  it('includes project detail tab and action permissions', () => {
    const keys = DEFAULT_PERMISSION_CATALOG.map((item) => item.key)
    assert.ok(keys.includes('read:Budget'))
    assert.ok(keys.includes('create:Budget'))
    assert.ok(keys.includes('create:Obligation'))
    assert.ok(keys.includes('create:Disbursement'))
    assert.ok(keys.includes('create:Document'))
    assert.ok(keys.includes('export:ProjectLog'))
    assert.ok(keys.includes('read:ProjectIntegrity'))
    assert.ok(keys.includes('update:ProjectMap'))
    assert.ok(keys.includes('delete:ProjectMap'))
  })

  it('includes admin nav permissions including Settings', () => {
    const keys = DEFAULT_PERMISSION_CATALOG.map((item) => item.key)
    assert.ok(keys.includes('read:Report'))
    assert.ok(keys.includes('read:Graph'))
    assert.ok(keys.includes('read:CheckPayment'))
    assert.ok(keys.includes('read:Settings'))
    assert.ok(keys.includes('read:User'))
  })

  it('gives staff all nav reads except Users, plus project-detail reads and profile', () => {
    assert.deepEqual([...STAFF_PERMISSION_KEYS], [
      ...ADMIN_NAV_READ_PERMISSION_KEYS,
      ...PROJECT_DETAIL_READ_PERMISSION_KEYS,
      'read:Profile',
      'update:Profile',
    ])
    assert.ok(!STAFF_PERMISSION_KEYS.includes('read:User'))
  })
})
