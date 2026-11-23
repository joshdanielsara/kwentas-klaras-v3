import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { SUPERADMIN_CATALOG_RESOURCES } from '../catalogResources'

describe('SUPERADMIN_CATALOG_RESOURCES', () => {
  it('covers barangays, services, and implementing units', () => {
    const resources = SUPERADMIN_CATALOG_RESOURCES.map((item) => item.resource)
    assert.deepEqual(resources, ['locations', 'services', 'departments'])
  })

  it('maps UI paths for all three catalogs', () => {
    const paths = SUPERADMIN_CATALOG_RESOURCES.map((item) => item.path)
    assert.ok(paths.includes('/superadmin/barangays'))
    assert.ok(paths.includes('/superadmin/services'))
    assert.ok(paths.includes('/superadmin/implementing-units'))
  })
})
