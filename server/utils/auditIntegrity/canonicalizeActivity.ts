import {
  ACTIVITY_CANON_VERSION,
  ACTIVITY_CANON_VERSION_CURRENT,
  type ActivityCanonVersion,
} from '../../../app/constants/audit/integrityActor'

export interface ActivityIntegrityPayload {
  projectId: string
  action: string
  description: string
  userId?: string | null
  metadata?: string | null
  createdAt?: string | Date | null
  actorType?: string | null
  actorId?: string | null
  actorRoleSnapshot?: string | null
  source?: string | null
  canonVersion?: ActivityCanonVersion | number | null
}

const toIso = (value?: string | Date | null): string => {
  if (!value) {
    return ''
  }
  if (value instanceof Date) {
    return value.toISOString()
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString()
}

/**
 * Stable JSON for hashing.
 * v1 = legacy (no actor fields) — used when verifying old rows.
 * v2 = actor-bound — used for new writes.
 */
export const canonicalizeActivity = (payload: ActivityIntegrityPayload): string => {
  const version = payload.canonVersion ?? ACTIVITY_CANON_VERSION.V1
  const createdAt = toIso(payload.createdAt)

  if (version < ACTIVITY_CANON_VERSION.V2) {
    return JSON.stringify({
      action: payload.action.trim(),
      createdAt,
      description: payload.description.trim(),
      metadata: payload.metadata ?? '',
      projectId: payload.projectId,
      userId: payload.userId ?? '',
    })
  }

  return JSON.stringify({
    action: payload.action.trim(),
    actorId: payload.actorId ?? '',
    actorRoleSnapshot: payload.actorRoleSnapshot ?? '',
    actorType: payload.actorType ?? '',
    canonVersion: ACTIVITY_CANON_VERSION.V2,
    createdAt,
    description: payload.description.trim(),
    metadata: payload.metadata ?? '',
    projectId: payload.projectId,
    source: payload.source ?? '',
    userId: payload.userId ?? '',
  })
}

export const resolveActivityCanonVersion = (
  payload: Pick<
    ActivityIntegrityPayload,
    'canonVersion' | 'actorType' | 'actorId' | 'source'
  >
): ActivityCanonVersion => {
  if (payload.canonVersion === ACTIVITY_CANON_VERSION.V2) {
    return ACTIVITY_CANON_VERSION.V2
  }
  if (payload.canonVersion === ACTIVITY_CANON_VERSION.V1) {
    return ACTIVITY_CANON_VERSION.V1
  }
  // Infer: new actor-bound rows without explicit version still hash as v2 at write time
  if (payload.actorType || payload.actorId || payload.source) {
    return ACTIVITY_CANON_VERSION.V2
  }
  return ACTIVITY_CANON_VERSION.V1
}

export { ACTIVITY_CANON_VERSION_CURRENT }
