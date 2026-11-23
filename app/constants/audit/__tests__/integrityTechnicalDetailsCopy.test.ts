import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  INTEGRITY_INDEPENDENT_VERIFY_MISSING_PROOF_HOW,
  INTEGRITY_INDEPENDENT_VERIFY_STEPS,
  INTEGRITY_TECHNICAL_DETAILS_INTRO,
  INTEGRITY_TECHNICAL_DETAILS_SUBTITLE,
  INTEGRITY_TECHNICAL_DETAILS_TITLE,
  INTEGRITY_TECHNICAL_FIELD,
  INTEGRITY_TECHNICAL_FOOTER,
  OPENTIMESTAMPS_VERIFY_URL,
} from '../integrityTechnicalDetailsCopy'

describe('integrityTechnicalDetailsCopy', () => {
  it('keeps public copy short and plain', () => {
    assert.equal(INTEGRITY_TECHNICAL_DETAILS_TITLE, 'How this seal works')
    assert.equal(INTEGRITY_TECHNICAL_DETAILS_SUBTITLE, 'Easy explanation')
    assert.ok(INTEGRITY_TECHNICAL_DETAILS_INTRO.length < 180)
    assert.equal(INTEGRITY_TECHNICAL_FIELD.ROOT.label, 'Lock code')
    assert.match(INTEGRITY_TECHNICAL_FOOTER, /receipt/i)
  })

  it('includes short independent verify steps', () => {
    assert.equal(OPENTIMESTAMPS_VERIFY_URL, 'https://opentimestamps.org/')
    assert.equal(INTEGRITY_INDEPENDENT_VERIFY_STEPS.length, 3)
    assert.match(INTEGRITY_INDEPENDENT_VERIFY_STEPS[0], /Download.*stamp/i)
  })

  it('explains how to load a missing stamp file briefly', () => {
    assert.ok(INTEGRITY_INDEPENDENT_VERIFY_MISSING_PROOF_HOW.length >= 1)
    assert.match(INTEGRITY_INDEPENDENT_VERIFY_MISSING_PROOF_HOW[0], /Load stamp file/i)
  })
})
