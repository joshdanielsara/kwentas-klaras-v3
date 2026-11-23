import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { PROJECT_DETAIL_TABS } from '../detailTabs'
import { PROJECT_DETAIL_TAB_PERMISSIONS } from '../detailTabPermissions'

describe('detailTabPermissions', () => {
  it('defines a read permission for every project detail tab', () => {
    for (const tab of PROJECT_DETAIL_TABS) {
      const config = PROJECT_DETAIL_TAB_PERMISSIONS[tab.id]
      assert.ok(config, `missing permission config for tab ${tab.id}`)
      assert.equal(config.read.action, 'read')
      assert.ok(config.read.subject.length > 0)
    }
  })

  it('requires create actions for budget, obligations, disbursements, and documents', () => {
    assert.deepEqual(PROJECT_DETAIL_TAB_PERMISSIONS.budget.create, { action: 'create', subject: 'Budget' })
    assert.deepEqual(PROJECT_DETAIL_TAB_PERMISSIONS.obligations.create, { action: 'create', subject: 'Obligation' })
    assert.deepEqual(PROJECT_DETAIL_TAB_PERMISSIONS.disbursements.create, { action: 'create', subject: 'Disbursement' })
    assert.deepEqual(PROJECT_DETAIL_TAB_PERMISSIONS.documents.create, { action: 'create', subject: 'Document' })
  })

  it('requires map update/delete and log export actions', () => {
    assert.deepEqual(PROJECT_DETAIL_TAB_PERMISSIONS.map.update, { action: 'update', subject: 'ProjectMap' })
    assert.deepEqual(PROJECT_DETAIL_TAB_PERMISSIONS.map.delete, { action: 'delete', subject: 'ProjectMap' })
    assert.deepEqual(PROJECT_DETAIL_TAB_PERMISSIONS.logs.export, { action: 'export', subject: 'ProjectLog' })
  })

  it('requires ProjectIntegrity read for the Integrity tab', () => {
    assert.deepEqual(PROJECT_DETAIL_TAB_PERMISSIONS.integrity.read, {
      action: 'read',
      subject: 'ProjectIntegrity',
    })
  })
})
