import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { ADMIN_MENU } from '../adminMenu'
import { resolveAdminNavPermission } from '../adminNavPermissions'

describe('adminNavPermissions', () => {
  it('maps every sidebar path to a read permission', () => {
    for (const item of ADMIN_MENU) {
      const permission = resolveAdminNavPermission(item.path)
      assert.ok(permission, `missing nav permission for ${item.path}`)
      assert.equal(permission.action, 'read')
      assert.ok(permission.subject.length > 0)
    }
  })

  it('resolves nested project and user routes', () => {
    assert.deepEqual(resolveAdminNavPermission('/admin/projects/abc/edit'), {
      action: 'read',
      subject: 'Project',
    })
    assert.deepEqual(resolveAdminNavPermission('/admin/users/add'), {
      action: 'read',
      subject: 'User',
    })
  })

  it('keeps dashboard exact so /admin/projects is not Dashboard', () => {
    assert.deepEqual(resolveAdminNavPermission('/admin'), {
      action: 'read',
      subject: 'Dashboard',
    })
    assert.deepEqual(resolveAdminNavPermission('/admin/projects'), {
      action: 'read',
      subject: 'Project',
    })
  })

  it('requires Settings permission for settings route', () => {
    assert.deepEqual(resolveAdminNavPermission('/admin/settings'), {
      action: 'read',
      subject: 'Settings',
    })
  })
})
