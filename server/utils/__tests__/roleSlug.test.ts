import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { normalizeRoleSlug, validateRoleSlug } from '../roleSlug'

describe('roleSlug', () => {
  it('normalizes slug to lowercase', () => {
    assert.equal(normalizeRoleSlug(' Auditor '), 'auditor')
  })

  it('accepts valid slug', () => {
    assert.equal(validateRoleSlug('auditor'), null)
  })

  it('rejects invalid slug', () => {
    assert.match(validateRoleSlug('Admin Role') || '', /slug/)
  })
})
