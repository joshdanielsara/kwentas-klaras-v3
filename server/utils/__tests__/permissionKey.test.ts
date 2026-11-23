import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  toPermissionKey,
  validatePermissionParts,
} from '../permissionKey'

describe('permissionKey', () => {
  it('accepts valid action and subject', () => {
    assert.equal(validatePermissionParts('export', 'Report'), null)
    assert.equal(toPermissionKey('Export', 'Report'), 'export:Report')
  })

  it('rejects invalid action', () => {
    assert.match(validatePermissionParts('1export', 'Report') || '', /Action/)
  })

  it('rejects invalid subject', () => {
    assert.match(validatePermissionParts('export', 'report!') || '', /Subject/)
  })
})
