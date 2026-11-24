import { createHash } from 'node:crypto'
import { canonicalizeFinancialRecord } from './canonicalizeFinancialRecord'
import type { FinancialRecordSnapshot } from './financialRecordSnapshot'

export const hashFinancialRecordSnapshot = (snapshot: FinancialRecordSnapshot): string => {
  return createHash('sha256').update(canonicalizeFinancialRecord(snapshot), 'utf8').digest('hex')
}
