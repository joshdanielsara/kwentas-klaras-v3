export const INTEGRITY_HISTORY_SCOPE = {
  ALL_BATCHES: 'all_batches',
  LATEST_ONLY: 'latest_only',
  NONE: 'none',
} as const

export type IntegrityHistoryScope =
  (typeof INTEGRITY_HISTORY_SCOPE)[keyof typeof INTEGRITY_HISTORY_SCOPE]

export const INTEGRITY_HISTORY_SCOPE_LABEL: Record<IntegrityHistoryScope, string> = {
  [INTEGRITY_HISTORY_SCOPE.ALL_BATCHES]: 'All sealed history',
  [INTEGRITY_HISTORY_SCOPE.LATEST_ONLY]: 'Latest seal only',
  [INTEGRITY_HISTORY_SCOPE.NONE]: 'No seals yet',
}
