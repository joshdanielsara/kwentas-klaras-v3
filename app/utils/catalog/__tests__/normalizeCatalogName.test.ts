import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { normalizeCatalogName, validateCatalogName } from '../normalizeCatalogName'

describe('normalizeCatalogName', () => {
  it('trims and collapses whitespace', () => {
    assert.equal(normalizeCatalogName('  Barangay   Poblacion  '), 'Barangay Poblacion')
  })

  it('accepts valid names', () => {
    assert.equal(validateCatalogName("Mayor's Office"), null)
    assert.equal(validateCatalogName('Barangay El Pardo'), null)
  })

  it('rejects empty or short names', () => {
    assert.ok(validateCatalogName(''))
    assert.ok(validateCatalogName('A'))
  })
})
