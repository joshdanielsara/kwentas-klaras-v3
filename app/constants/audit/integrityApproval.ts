export const INTEGRITY_APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const

export type IntegrityApprovalStatus =
  (typeof INTEGRITY_APPROVAL_STATUS)[keyof typeof INTEGRITY_APPROVAL_STATUS]

export const INTEGRITY_APPROVAL_RESOURCE = {
  BUDGET: 'budget',
  OBLIGATION: 'obligation',
  DISBURSEMENT: 'disbursement',
} as const

export type IntegrityApprovalResource =
  (typeof INTEGRITY_APPROVAL_RESOURCE)[keyof typeof INTEGRITY_APPROVAL_RESOURCE]
