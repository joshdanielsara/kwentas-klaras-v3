import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  INTEGRITY_FINANCIAL_KIND,
  INTEGRITY_FINANCIAL_KIND_LABEL,
  INTEGRITY_FINANCIAL_KIND_ORDER,
} from '../integrityFinancialKinds'
import { INTEGRITY_FINANCIAL_FIELD_LABEL } from '../integrityFinancialFieldLabels'

describe('integrityFinancialKinds', () => {
  it('orders budget before obligation before disbursement', () => {
    assert.deepEqual(INTEGRITY_FINANCIAL_KIND_ORDER, [
      INTEGRITY_FINANCIAL_KIND.BUDGET,
      INTEGRITY_FINANCIAL_KIND.OBLIGATION,
      INTEGRITY_FINANCIAL_KIND.DISBURSEMENT,
    ])
    assert.equal(INTEGRITY_FINANCIAL_KIND_LABEL.obligation, 'Obligation')
    assert.equal(INTEGRITY_FINANCIAL_FIELD_LABEL.amount, 'Amount')
  })
})
