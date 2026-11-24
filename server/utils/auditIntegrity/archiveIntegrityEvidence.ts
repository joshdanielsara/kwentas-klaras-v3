import {
  INTEGRITY_EVIDENCE_MANIFEST_FILENAME,
  INTEGRITY_EVIDENCE_PROOF_FILENAME,
} from '../../../app/constants/audit/integrityArchiveProviders'
import type { IObjectStore } from '../objectStore/IObjectStore'
import {
  createIntegrityObjectStore,
} from '../objectStore/createObjectStore'
import type { IntegrityArchiveEnvConfig } from '../objectStore/resolveObjectStoreConfig'
import { resolveIntegrityArchiveConfig } from '../objectStore/resolveIntegrityArchiveConfig'
import {
  buildIntegrityEvidenceManifest,
  type IntegrityEvidenceManifestInput,
} from './buildIntegrityEvidenceManifest'

export interface ArchiveIntegrityEvidenceResult {
  archived: boolean
  provider: string
  manifestKey: string | null
  proofKey: string | null
}

const buildObjectKey = (prefix: string, batchId: string, filename: string): string => {
  return `${prefix}${batchId}/${filename}`
}

/**
 * Write seal evidence (manifest JSON + .ots proof) to the configured object store.
 * No-ops when archive provider is none / misconfigured. Does not throw to callers —
 * logs and returns archived:false so Mongo sealing is never blocked by archive outages.
 */
export const archiveIntegrityEvidence = async (
  input: IntegrityEvidenceManifestInput & { otsProof?: string | null },
  deps?: {
    store?: IObjectStore | null
    config?: IntegrityArchiveEnvConfig
  }
): Promise<ArchiveIntegrityEvidenceResult> => {
  const config = deps?.config ?? (await resolveIntegrityArchiveConfig())
  const store = deps?.store === undefined ? createIntegrityObjectStore(config) : deps.store

  if (!config.enabled || !store) {
    return {
      archived: false,
      provider: config.provider,
      manifestKey: null,
      proofKey: null,
    }
  }

  const manifestKey = buildObjectKey(
    config.keyPrefix,
    input.batchId,
    INTEGRITY_EVIDENCE_MANIFEST_FILENAME
  )
  const proofKey = input.otsProof
    ? buildObjectKey(config.keyPrefix, input.batchId, INTEGRITY_EVIDENCE_PROOF_FILENAME)
    : null

  try {
    const manifest = buildIntegrityEvidenceManifest(input)
    await store.putObject({
      key: manifestKey,
      body: JSON.stringify(manifest, null, 2),
      contentType: 'application/json',
    })

    if (proofKey && input.otsProof) {
      await store.putObject({
        key: proofKey,
        body: Buffer.from(input.otsProof, 'base64'),
        contentType: 'application/vnd.opentimestamps.ots',
      })
    }

    console.log('[archiveIntegrityEvidence] archived seal evidence', {
      provider: config.provider,
      batchId: input.batchId,
      manifestKey,
      proofKey,
    })

    return {
      archived: true,
      provider: config.provider,
      manifestKey,
      proofKey,
    }
  } catch (error: unknown) {
    console.error('[archiveIntegrityEvidence] archive failed', {
      provider: config.provider,
      batchId: input.batchId,
      error: error instanceof Error ? error.message : 'unknown',
    })
    return {
      archived: false,
      provider: config.provider,
      manifestKey,
      proofKey,
    }
  }
}
