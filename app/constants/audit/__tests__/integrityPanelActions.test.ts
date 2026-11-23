import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  INTEGRITY_PANEL_ACCORDION_HINT,
  INTEGRITY_PANEL_CHECKING_LABEL,
  INTEGRITY_PANEL_RECHECK_LABEL,
} from '../integrityPanelActions'

describe('integrityPanelActions', () => {
  it('exposes recheck labels for auto-verify panel', () => {
    assert.equal(INTEGRITY_PANEL_RECHECK_LABEL, 'Recheck')
    assert.ok(INTEGRITY_PANEL_CHECKING_LABEL.length > 0)
    assert.equal(INTEGRITY_PANEL_ACCORDION_HINT, 'Tap to view details')
  })
})
