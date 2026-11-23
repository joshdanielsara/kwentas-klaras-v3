import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { buildPublicIntegrityTimeline } from '../buildPublicIntegrityTimeline'
import {
  INTEGRITY_TIMELINE_STEP,
  INTEGRITY_TIMELINE_TONE,
} from '../../../../app/constants/audit/integrityTimeline'

describe('buildPublicIntegrityTimeline', () => {
  it('returns empty when there are no activities', () => {
    assert.deepEqual(buildPublicIntegrityTimeline({ activityCount: 0, sealedCount: 0 }), [])
  })

  it('builds recorded + sealed steps before a check', () => {
    const steps = buildPublicIntegrityTimeline({
      activityCount: 2,
      sealedCount: 2,
      sealedAt: '2026-11-24T01:08:00.000Z',
    })

    assert.equal(steps.length, 2)
    assert.equal(steps[0].kind, INTEGRITY_TIMELINE_STEP.RECORDED)
    assert.equal(steps[1].kind, INTEGRITY_TIMELINE_STEP.SEALED)
    assert.equal(steps[1].tone, INTEGRITY_TIMELINE_TONE.SUCCESS)
  })

  it('appends altered step when verification fails', () => {
    const steps = buildPublicIntegrityTimeline({
      activityCount: 1,
      sealedCount: 1,
      sealedAt: '2026-11-24T01:08:00.000Z',
      verified: false,
      verifyDetail: 'Activity history no longer matches the sealed Merkle root',
      checkedAt: '2026-11-24T01:10:00.000Z',
    })

    const last = steps[steps.length - 1]
    assert.equal(last.kind, INTEGRITY_TIMELINE_STEP.ALTERED)
    assert.equal(last.tone, INTEGRITY_TIMELINE_TONE.DANGER)
    assert.match(last.detail || '', /Merkle/)
  })

  it('appends intact step when verification succeeds', () => {
    const steps = buildPublicIntegrityTimeline({
      activityCount: 1,
      sealedCount: 1,
      verified: true,
      checkedAt: '2026-11-24T01:10:00.000Z',
    })

    assert.equal(steps.some((step) => step.kind === INTEGRITY_TIMELINE_STEP.INTACT), true)
  })
})
