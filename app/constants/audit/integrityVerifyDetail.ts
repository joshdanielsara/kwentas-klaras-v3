/** Short badge / timeline copy returned from integrity verify. */
export const INTEGRITY_VERIFY_DETAIL = {
  PROJECT_DATA_MISMATCH: 'Project data altered',
  FINANCIAL_DATA_MISMATCH: 'Financial records altered',
  ACTIVITY_HASH_MISMATCH: 'Activity history altered',
  MERKLE_MISMATCH: 'Seal fingerprint mismatch',
  NO_OTS_PROOF: 'No OpenTimestamps proof on batch',
  DIGEST_FALLBACK: 'Sealed digests no longer match current records',
  HISTORY_INCOMPLETE: 'Sealed history incomplete',
  HISTORY_UNAVAILABLE: 'Could not finish historical seal check',
} as const

export type IntegrityVerifyDetail =
  (typeof INTEGRITY_VERIFY_DETAIL)[keyof typeof INTEGRITY_VERIFY_DETAIL]

/** Build a short verify line that includes how many historical batches were checked. */
export const formatHistoricalVerifyDetail = (input: {
  checkedCount: number
  failedCount: number
  primaryDetail: string | null
}): string => {
  const scope =
    input.checkedCount <= 0
      ? 'No sealed batches'
      : input.checkedCount === 1
        ? '1 sealed batch checked'
        : `${input.checkedCount} sealed batches checked`

  if (input.failedCount > 0) {
    const failBit =
      input.failedCount === 1
        ? '1 batch failed'
        : `${input.failedCount} batches failed`
    return input.primaryDetail
      ? `${scope} · ${failBit} · ${input.primaryDetail}`
      : `${scope} · ${failBit}`
  }

  return input.primaryDetail ? `${scope} · ${input.primaryDetail}` : scope
}
