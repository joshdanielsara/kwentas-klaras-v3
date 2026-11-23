import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { canonicalizeActivity } from '../canonicalizeActivity'
import { hashActivityPayload } from '../hashActivity'

describe('canonicalizeActivity', () => {
  it('produces stable JSON field order', () => {
    const canonical = canonicalizeActivity({
      projectId: 'p1',
      action: 'updated',
      description: 'Changed budget',
      userId: 'u1',
      metadata: null,
      createdAt: '2026-01-01T00:00:00.000Z',
    })
    assert.equal(
      canonical,
      '{"action":"updated","createdAt":"2026-01-01T00:00:00.000Z","description":"Changed budget","metadata":"","projectId":"p1","userId":"u1"}'
    )
  })

  it('hashes consistently for the same payload', () => {
    const payload = {
      projectId: 'p1',
      action: 'created',
      description: 'Project created',
      createdAt: '2026-01-01T00:00:00.000Z',
    }
    assert.equal(hashActivityPayload(payload), hashActivityPayload(payload))
    assert.equal(hashActivityPayload(payload).length, 64)
  })
})
