import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  INTEGRITY_HISTORY_SCOPE,
  INTEGRITY_HISTORY_SCOPE_LABEL,
} from '../integrityHistoryScope'
import { formatHistoricalVerifyDetail } from '../integrityVerifyDetail'
import { PUBLIC_INTEGRITY_LABELS, PUBLIC_INTEGRITY_STATUS } from '../integrityStatus'

describe('integrityHistoryScope', () => {
  it('labels all-history verified status clearly', () => {
    assert.equal(
      PUBLIC_INTEGRITY_LABELS[PUBLIC_INTEGRITY_STATUS.VERIFIED],
      'All sealed history verified'
    )
    assert.equal(
      INTEGRITY_HISTORY_SCOPE_LABEL[INTEGRITY_HISTORY_SCOPE.ALL_BATCHES],
      'All sealed history'
    )
  })

  it('formats historical verify detail with batch counts', () => {
    assert.match(
      formatHistoricalVerifyDetail({
        checkedCount: 3,
        failedCount: 1,
        primaryDetail: 'Activity history altered',
      }),
      /3 sealed batches checked · 1 batch failed · Activity history altered/
    )
  })
})
