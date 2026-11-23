export interface ActivityIntegrityPayload {
  projectId: string
  action: string
  description: string
  userId?: string | null
  metadata?: string | null
  createdAt?: string | Date | null
}

/** Stable JSON for hashing — field order fixed, nulls omitted as empty string. */
export const canonicalizeActivity = (payload: ActivityIntegrityPayload): string => {
  const createdAt =
    payload.createdAt instanceof Date
      ? payload.createdAt.toISOString()
      : payload.createdAt
        ? new Date(payload.createdAt).toISOString()
        : ''

  return JSON.stringify({
    action: payload.action.trim(),
    createdAt,
    description: payload.description.trim(),
    metadata: payload.metadata ?? '',
    projectId: payload.projectId,
    userId: payload.userId ?? '',
  })
}
