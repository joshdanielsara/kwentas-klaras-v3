export const AUDIT_BATCH_STATUS = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  CONFIRMED: 'confirmed',
} as const

export type AuditBatchStatus = (typeof AUDIT_BATCH_STATUS)[keyof typeof AUDIT_BATCH_STATUS]

export const PUBLIC_INTEGRITY_STATUS = {
  NONE: 'none',
  PENDING: 'pending',
  SEALED: 'sealed',
  VERIFIED: 'verified',
  FAILED: 'failed',
} as const

export type PublicIntegrityStatus =
  (typeof PUBLIC_INTEGRITY_STATUS)[keyof typeof PUBLIC_INTEGRITY_STATUS]

export const PUBLIC_INTEGRITY_LABELS: Record<PublicIntegrityStatus, string> = {
  [PUBLIC_INTEGRITY_STATUS.NONE]: 'No activity yet',
  [PUBLIC_INTEGRITY_STATUS.PENDING]: 'Sealing new activity',
  [PUBLIC_INTEGRITY_STATUS.SEALED]: 'Records sealed',
  [PUBLIC_INTEGRITY_STATUS.VERIFIED]: 'Verified just now',
  [PUBLIC_INTEGRITY_STATUS.FAILED]: 'Records altered',
}
