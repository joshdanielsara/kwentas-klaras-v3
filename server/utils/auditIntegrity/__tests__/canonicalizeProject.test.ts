import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { canonicalizeProject } from '../canonicalizeProject'
import { hashProjectPayload } from '../hashProject'

describe('canonicalizeProject', () => {
  it('hashes project master data stably', () => {
    const payload = {
      id: 'p1',
      name: ' Road Works ',
      implementingUnit: 'Engineering',
      location: 'Poblacion',
      appropriation: 1000,
      year: 2026,
      services: 'Infra',
      remarks: null,
      code: 'A-1',
      startDate: new Date('2026-01-01T00:00:00.000Z'),
      endDate: new Date('2026-12-31T00:00:00.000Z'),
      latitude: 9.1,
      longitude: 123.4,
    }

    const a = hashProjectPayload(payload)
    const b = hashProjectPayload({ ...payload, name: 'Road Works' })
    assert.equal(a, b)
    assert.match(canonicalizeProject(payload), /"appropriation":1000/)
  })

  it('changes hash when appropriation changes', () => {
    const base = {
      id: 'p1',
      name: 'Road Works',
      appropriation: 1000,
      year: 2026,
      services: 'Infra',
    }
    const left = hashProjectPayload(base)
    const right = hashProjectPayload({ ...base, appropriation: 999999 })
    assert.notEqual(left, right)
  })
})
