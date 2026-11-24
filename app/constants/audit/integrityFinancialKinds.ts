export const INTEGRITY_FINANCIAL_KIND = {
  BUDGET: 'budget',
  OBLIGATION: 'obligation',
  DISBURSEMENT: 'disbursement',
} as const

export type IntegrityFinancialKind =
  (typeof INTEGRITY_FINANCIAL_KIND)[keyof typeof INTEGRITY_FINANCIAL_KIND]

export const INTEGRITY_FINANCIAL_KIND_LABEL: Record<IntegrityFinancialKind, string> = {
  [INTEGRITY_FINANCIAL_KIND.BUDGET]: 'Additional budget',
  [INTEGRITY_FINANCIAL_KIND.OBLIGATION]: 'Obligation',
  [INTEGRITY_FINANCIAL_KIND.DISBURSEMENT]: 'Disbursement',
}

/** Stable leaf ordering: budgets → obligations → disbursements. */
export const INTEGRITY_FINANCIAL_KIND_ORDER: IntegrityFinancialKind[] = [
  INTEGRITY_FINANCIAL_KIND.BUDGET,
  INTEGRITY_FINANCIAL_KIND.OBLIGATION,
  INTEGRITY_FINANCIAL_KIND.DISBURSEMENT,
]
