export const INTEGRITY_ACTOR_TYPE = {
  USER: 'user',
  SYSTEM: 'system',
  IMPORT: 'import',
  UNKNOWN: 'unknown',
} as const

export type IntegrityActorType =
  (typeof INTEGRITY_ACTOR_TYPE)[keyof typeof INTEGRITY_ACTOR_TYPE]

export const INTEGRITY_ACTIVITY_SOURCE = {
  APP: 'app',
  IMPORT: 'import',
  SYSTEM: 'system',
} as const

export type IntegrityActivitySource =
  (typeof INTEGRITY_ACTIVITY_SOURCE)[keyof typeof INTEGRITY_ACTIVITY_SOURCE]

export const ACTIVITY_CANON_VERSION = {
  V1: 1,
  V2: 2,
} as const

export type ActivityCanonVersion =
  (typeof ACTIVITY_CANON_VERSION)[keyof typeof ACTIVITY_CANON_VERSION]

export const ACTIVITY_CANON_VERSION_CURRENT = ACTIVITY_CANON_VERSION.V2
