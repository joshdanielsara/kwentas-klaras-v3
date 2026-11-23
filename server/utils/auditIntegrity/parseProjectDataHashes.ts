import type { ProjectIntegritySnapshot } from './projectIntegritySnapshot'

export type ProjectDataHashMap = Record<string, string>

export interface ProjectDataSealEntry {
  hash: string
  snapshot?: ProjectIntegritySnapshot
}

export type ProjectDataSealMap = Record<string, ProjectDataSealEntry>

const isSnapshot = (value: unknown): value is ProjectIntegritySnapshot => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }
  const record = value as Record<string, unknown>
  return typeof record.name === 'string' && typeof record.appropriation === 'number'
}

export const parseProjectDataSealMap = (raw?: string | null): ProjectDataSealMap => {
  if (!raw) {
    return {}
  }
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {}
    }
    const result: ProjectDataSealMap = {}
    for (const [projectId, value] of Object.entries(parsed)) {
      if (typeof value === 'string' && value.length > 0) {
        result[projectId] = { hash: value }
        continue
      }
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const entry = value as { hash?: unknown; snapshot?: unknown }
        if (typeof entry.hash === 'string' && entry.hash.length > 0) {
          result[projectId] = {
            hash: entry.hash,
            snapshot: isSnapshot(entry.snapshot) ? entry.snapshot : undefined,
          }
        }
      }
    }
    return result
  } catch {
    return {}
  }
}

/** Hash-only map for Merkle leaves (legacy + rich seal formats). */
export const parseProjectDataHashes = (raw?: string | null): ProjectDataHashMap => {
  const sealMap = parseProjectDataSealMap(raw)
  const result: ProjectDataHashMap = {}
  for (const [projectId, entry] of Object.entries(sealMap)) {
    result[projectId] = entry.hash
  }
  return result
}

export const serializeProjectDataSealMap = (map: ProjectDataSealMap): string => {
  const sortedKeys = Object.keys(map).sort()
  const ordered: ProjectDataSealMap = {}
  for (const key of sortedKeys) {
    ordered[key] = map[key]
  }
  return JSON.stringify(ordered)
}

/** @deprecated Prefer serializeProjectDataSealMap — kept for callers that only have hashes. */
export const serializeProjectDataHashes = (map: ProjectDataHashMap): string => {
  const sealMap: ProjectDataSealMap = {}
  for (const [projectId, hash] of Object.entries(map)) {
    sealMap[projectId] = { hash }
  }
  return serializeProjectDataSealMap(sealMap)
}

/** Project data leaves append after activity leaves, sorted by project id. */
export const projectDataHashesToLeafList = (map: ProjectDataHashMap): string[] => {
  return Object.keys(map)
    .sort()
    .map((projectId) => map[projectId])
}
