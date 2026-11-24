import { INTEGRITY_EVIDENCE_MANIFEST_VERSION } from '../../../app/constants/audit/integrityArchiveProviders'

export interface IntegrityEvidenceManifestInput {
  batchId: string
  merkleRoot: string
  status: string
  leafCount: number
  sealedAt?: Date | string | null
  projectDataHashes?: string | null
  financialDataHashes?: string | null
  projectIds?: string[]
}

export interface IntegrityEvidenceManifest {
  version: number
  batchId: string
  merkleRoot: string
  status: string
  leafCount: number
  sealedAt: string | null
  projectIds: string[]
  projectDataHashes: unknown
  financialDataHashes: unknown
  archivedAt: string
}

const parseJsonField = (raw?: string | null): unknown => {
  if (!raw) {
    return null
  }
  try {
    return JSON.parse(raw)
  } catch {
    return raw
  }
}

const toIso = (value?: Date | string | null): string | null => {
  if (!value) {
    return null
  }
  if (value instanceof Date) {
    return value.toISOString()
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

export const buildIntegrityEvidenceManifest = (
  input: IntegrityEvidenceManifestInput
): IntegrityEvidenceManifest => {
  return {
    version: INTEGRITY_EVIDENCE_MANIFEST_VERSION,
    batchId: input.batchId,
    merkleRoot: input.merkleRoot,
    status: input.status,
    leafCount: input.leafCount,
    sealedAt: toIso(input.sealedAt),
    projectIds: input.projectIds ?? [],
    projectDataHashes: parseJsonField(input.projectDataHashes),
    financialDataHashes: parseJsonField(input.financialDataHashes),
    archivedAt: new Date().toISOString(),
  }
}
