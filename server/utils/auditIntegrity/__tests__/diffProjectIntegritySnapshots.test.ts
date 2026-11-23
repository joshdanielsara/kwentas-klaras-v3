import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { diffProjectIntegritySnapshots } from '../diffProjectIntegritySnapshots'
import type { ProjectIntegritySnapshot } from '../projectIntegritySnapshot'

const base = (): ProjectIntegritySnapshot => ({
  appropriation: 1231231,
  code: 'A-1',
  endDate: '',
  id: 'p1',
  implementingUnit: 'Engineering',
  latitude: null,
  location: 'Poblacion',
  longitude: null,
  name: 'Test Blockchain',
  remarks: '',
  services: 'Infra',
  startDate: '',
  year: 2026,
})

describe('diffProjectIntegritySnapshots', () => {
  it('lists changed project fields with sealed vs now values', () => {
    const sealed = base()
    const current = {
      ...base(),
      name: 'Test Blockchain [DATA TAMPERED]',
      appropriation: 999999999,
    }

    const alterations = diffProjectIntegritySnapshots(sealed, current)
    assert.equal(alterations.length, 2)
    assert.equal(alterations[0].field, 'appropriation')
    assert.equal(alterations[0].sealedValue, '1,231,231')
    assert.equal(alterations[0].currentValue, '999,999,999')
    assert.equal(alterations[1].field, 'name')
    assert.match(alterations[1].currentValue, /DATA TAMPERED/)
  })

  it('returns empty when snapshots match', () => {
    const sealed = base()
    assert.deepEqual(diffProjectIntegritySnapshots(sealed, base()), [])
  })
})
