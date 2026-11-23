/** Short badge / timeline copy returned from integrity verify. */
export const INTEGRITY_VERIFY_DETAIL = {
  PROJECT_DATA_MISMATCH: 'Project data altered',
  ACTIVITY_HASH_MISMATCH: 'Activity history altered',
  MERKLE_MISMATCH: 'Seal fingerprint mismatch',
  NO_OTS_PROOF: 'No OpenTimestamps proof on batch',
  DIGEST_FALLBACK: 'Sealed digests no longer match current records',
} as const

export type IntegrityVerifyDetail =
  (typeof INTEGRITY_VERIFY_DETAIL)[keyof typeof INTEGRITY_VERIFY_DETAIL]
