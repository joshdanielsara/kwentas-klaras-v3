import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { INTEGRITY_ALTERATIONS_TITLE } from '../integrityAlterationsCopy'
import { INTEGRITY_PROJECT_FIELD_LABEL } from '../integrityProjectFieldLabels'

describe('integrityAlterationsCopy', () => {
  it('labels what-changed section and project fields', () => {
    assert.equal(INTEGRITY_ALTERATIONS_TITLE, 'What changed')
    assert.equal(INTEGRITY_PROJECT_FIELD_LABEL.name, 'Project name')
    assert.equal(INTEGRITY_PROJECT_FIELD_LABEL.appropriation, 'Budget / appropriation')
  })
})
