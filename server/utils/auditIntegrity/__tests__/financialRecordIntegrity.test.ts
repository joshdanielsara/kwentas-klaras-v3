import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { INTEGRITY_FINANCIAL_KIND } from '../../../../app/constants/audit/integrityFinancialKinds'
import { buildFinancialDataSealMap } from '../buildFinancialDataSealMap'
import { diffFinancialDataSeals } from '../diffFinancialDataSeals'
import { hashFinancialRecordSnapshot } from '../hashFinancialRecord'
import { toFinancialRecordSnapshot } from '../financialRecordSnapshot'
import {
  financialDataSealsToLeafList,
  serializeFinancialDataSealMap,
  parseFinancialDataSealMap,
} from '../parseFinancialDataSeals'

describe('financialRecordIntegrity', () => {
  it('hashes money rows stably and changes when amount changes', () => {
    const base = toFinancialRecordSnapshot(INTEGRITY_FINANCIAL_KIND.OBLIGATION, {
      id: 'o1',
      projectId: 'p1',
      amount: 1000,
      reason: 'Works',
      status: 'approved',
      payee: 'ABC Corp',
    })
    const altered = toFinancialRecordSnapshot(INTEGRITY_FINANCIAL_KIND.OBLIGATION, {
      id: 'o1',
      projectId: 'p1',
      amount: 1800,
      reason: 'Works',
      status: 'approved',
      payee: 'ABC Corp',
    })
    assert.notEqual(hashFinancialRecordSnapshot(base), hashFinancialRecordSnapshot(altered))
  })

  it('diffs sealed vs current obligation amounts', () => {
    const sealed = buildFinancialDataSealMap({
      budgets: [],
      obligations: [
        {
          id: 'o1',
          projectId: 'p1',
          amount: 1000,
          reason: 'Works',
          status: 'approved',
          payee: 'ABC Corp',
        },
      ],
      disbursements: [],
    })
    const current = buildFinancialDataSealMap({
      budgets: [],
      obligations: [
        {
          id: 'o1',
          projectId: 'p1',
          amount: 1800,
          reason: 'Works',
          status: 'approved',
          payee: 'ABC Corp',
        },
      ],
      disbursements: [],
    })

    const result = diffFinancialDataSeals(sealed, current)
    assert.equal(result.match, false)
    assert.ok(result.alterations.some((item) => item.field.includes('amount')))
    assert.match(result.alterations[0].label, /Obligation/i)
  })

  it('round-trips financial seal JSON and leaf order', () => {
    const map = buildFinancialDataSealMap({
      budgets: [
        {
          id: 'b1',
          projectId: 'p1',
          amount: 500,
          reason: 'Extra',
          status: 'approved',
        },
      ],
      obligations: [
        {
          id: 'o1',
          projectId: 'p1',
          amount: 1000,
          reason: 'Works',
          status: 'approved',
          payee: 'ABC',
        },
      ],
      disbursements: [
        {
          id: 'd1',
          projectId: 'p1',
          amount: 800,
          reason: 'Payment',
          status: 'approved',
          payee: 'ABC',
        },
      ],
    })
    const raw = serializeFinancialDataSealMap(map)
    const parsed = parseFinancialDataSealMap(raw)
    const leaves = financialDataSealsToLeafList(parsed)
    assert.equal(leaves.length, 3)
    assert.equal(leaves[0], map.budgets.b1.hash)
    assert.equal(leaves[1], map.obligations.o1.hash)
    assert.equal(leaves[2], map.disbursements.d1.hash)
  })

  it('returns null match for legacy empty financial seals', () => {
    const result = diffFinancialDataSeals(
      { budgets: {}, obligations: {}, disbursements: {} },
      buildFinancialDataSealMap({
        budgets: [],
        obligations: [],
        disbursements: [],
      })
    )
    assert.equal(result.match, null)
  })
})
