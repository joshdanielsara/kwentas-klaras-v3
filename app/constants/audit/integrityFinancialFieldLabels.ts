export const INTEGRITY_FINANCIAL_FIELD_LABEL = {
  amount: 'Amount',
  approvedBy: 'Approved by',
  approvedDate: 'Approved date',
  payee: 'Payee',
  reason: 'Reason',
  status: 'Status',
} as const

export type IntegrityFinancialFieldKey = keyof typeof INTEGRITY_FINANCIAL_FIELD_LABEL
