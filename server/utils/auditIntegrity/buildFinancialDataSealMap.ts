import {
  INTEGRITY_FINANCIAL_KIND,
  type IntegrityFinancialKind,
} from '../../../app/constants/audit/integrityFinancialKinds'
import { hashFinancialRecordSnapshot } from './hashFinancialRecord'
import {
  toFinancialRecordSnapshot,
  type FinancialRecordPayload,
} from './financialRecordSnapshot'
import {
  type FinancialDataSealMap,
  type FinancialKindSealMap,
  financialKindMapKey,
} from './parseFinancialDataSeals'

const sealRows = (
  kind: IntegrityFinancialKind,
  rows: FinancialRecordPayload[]
): FinancialKindSealMap => {
  const map: FinancialKindSealMap = {}
  for (const row of rows) {
    const snapshot = toFinancialRecordSnapshot(kind, row)
    map[row.id] = {
      hash: hashFinancialRecordSnapshot(snapshot),
      snapshot,
    }
  }
  return map
}

/** Build seal map for all money rows belonging to the given projects. */
export const buildFinancialDataSealMap = (input: {
  budgets: FinancialRecordPayload[]
  obligations: FinancialRecordPayload[]
  disbursements: FinancialRecordPayload[]
}): FinancialDataSealMap => {
  return {
    [financialKindMapKey(INTEGRITY_FINANCIAL_KIND.BUDGET)]: sealRows(
      INTEGRITY_FINANCIAL_KIND.BUDGET,
      input.budgets
    ),
    [financialKindMapKey(INTEGRITY_FINANCIAL_KIND.OBLIGATION)]: sealRows(
      INTEGRITY_FINANCIAL_KIND.OBLIGATION,
      input.obligations
    ),
    [financialKindMapKey(INTEGRITY_FINANCIAL_KIND.DISBURSEMENT)]: sealRows(
      INTEGRITY_FINANCIAL_KIND.DISBURSEMENT,
      input.disbursements
    ),
  }
}
