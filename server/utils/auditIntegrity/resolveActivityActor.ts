import {
  INTEGRITY_ACTIVITY_SOURCE,
  INTEGRITY_ACTOR_TYPE,
  type IntegrityActivitySource,
  type IntegrityActorType,
} from '../../../app/constants/audit/integrityActor'

export interface ResolvedActivityActor {
  actorType: IntegrityActorType
  actorId: string | null
  actorRoleSnapshot: string | null
  source: IntegrityActivitySource
  userId: string | undefined
}

/** Normalize actor binding fields for a new activity write. */
export const resolveActivityActor = (input: {
  userId?: string | null
  actorType?: string | null
  actorId?: string | null
  actorRoleSnapshot?: string | null
  source?: string | null
}): ResolvedActivityActor => {
  const userId = input.userId?.trim() || undefined
  const actorId = (input.actorId ?? userId ?? null)?.trim() || null
  const actorRoleSnapshot = input.actorRoleSnapshot?.trim() || null

  let actorType = (input.actorType || '').trim().toLowerCase() as IntegrityActorType
  if (
    actorType !== INTEGRITY_ACTOR_TYPE.USER &&
    actorType !== INTEGRITY_ACTOR_TYPE.SYSTEM &&
    actorType !== INTEGRITY_ACTOR_TYPE.IMPORT &&
    actorType !== INTEGRITY_ACTOR_TYPE.UNKNOWN
  ) {
    actorType = userId ? INTEGRITY_ACTOR_TYPE.USER : INTEGRITY_ACTOR_TYPE.UNKNOWN
  }

  let source = (input.source || '').trim().toLowerCase() as IntegrityActivitySource
  if (
    source !== INTEGRITY_ACTIVITY_SOURCE.APP &&
    source !== INTEGRITY_ACTIVITY_SOURCE.IMPORT &&
    source !== INTEGRITY_ACTIVITY_SOURCE.SYSTEM
  ) {
    source =
      actorType === INTEGRITY_ACTOR_TYPE.IMPORT
        ? INTEGRITY_ACTIVITY_SOURCE.IMPORT
        : actorType === INTEGRITY_ACTOR_TYPE.SYSTEM
          ? INTEGRITY_ACTIVITY_SOURCE.SYSTEM
          : INTEGRITY_ACTIVITY_SOURCE.APP
  }

  return {
    actorType,
    actorId,
    actorRoleSnapshot,
    source,
    userId,
  }
}
