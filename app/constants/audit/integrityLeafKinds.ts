export const INTEGRITY_LEAF_KIND = {
  ACTIVITY: 'activity',
  PROJECT: 'project',
  BUDGET: 'budget',
  OBLIGATION: 'obligation',
  DISBURSEMENT: 'disbursement',
} as const

export type IntegrityLeafKind =
  (typeof INTEGRITY_LEAF_KIND)[keyof typeof INTEGRITY_LEAF_KIND]

export const INTEGRITY_LEAF_KINDS: IntegrityLeafKind[] = [
  INTEGRITY_LEAF_KIND.ACTIVITY,
  INTEGRITY_LEAF_KIND.PROJECT,
  INTEGRITY_LEAF_KIND.BUDGET,
  INTEGRITY_LEAF_KIND.OBLIGATION,
  INTEGRITY_LEAF_KIND.DISBURSEMENT,
]
