import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  ACTIVITY_CANON_VERSION,
  INTEGRITY_ACTOR_TYPE,
} from '../integrityActor'
import { canonicalizeActivity } from '../../../../server/utils/auditIntegrity/canonicalizeActivity'
import { resolveActivityActor } from '../../../../server/utils/auditIntegrity/resolveActivityActor'

describe('integrityActor', () => {
  it('keeps v1 canonicalize stable without actor fields', () => {
    const a = canonicalizeActivity({
      projectId: 'p1',
      action: 'created',
      description: 'x',
      userId: 'u1',
      createdAt: '2026-01-01T00:00:00.000Z',
      canonVersion: ACTIVITY_CANON_VERSION.V1,
    })
    assert.ok(!a.includes('actorType'))
  })

  it('includes actor fields in v2 canonicalize', () => {
    const a = canonicalizeActivity({
      projectId: 'p1',
      action: 'created',
      description: 'x',
      userId: 'u1',
      actorType: INTEGRITY_ACTOR_TYPE.USER,
      actorId: 'u1',
      actorRoleSnapshot: 'staff',
      source: 'app',
      createdAt: '2026-01-01T00:00:00.000Z',
      canonVersion: ACTIVITY_CANON_VERSION.V2,
    })
    assert.ok(a.includes('actorType'))
    assert.ok(a.includes('staff'))
  })

  it('resolves default actor from userId', () => {
    const actor = resolveActivityActor({ userId: 'abc' })
    assert.equal(actor.actorType, INTEGRITY_ACTOR_TYPE.USER)
    assert.equal(actor.actorId, 'abc')
  })
})
