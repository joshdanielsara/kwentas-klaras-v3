import JSZip from 'jszip'
import type { AuditIntegrityBatch } from '@prisma/client'
import {
  COA_INTEGRITY_PACK_BATCHES_DIR,
  COA_INTEGRITY_PACK_DIGESTS_CSV_FILENAME,
  COA_INTEGRITY_PACK_README,
  COA_INTEGRITY_PACK_README_FILENAME,
} from '../../../app/constants/audit/coaIntegrityPack'
import {
  INTEGRITY_EVIDENCE_MANIFEST_FILENAME,
  INTEGRITY_EVIDENCE_PROOF_FILENAME,
} from '../../../app/constants/audit/integrityArchiveProviders'
import { buildIntegrityEvidenceManifest } from './buildIntegrityEvidenceManifest'
import { buildCoaIntegrityPackCsv } from './buildCoaIntegrityPackCsv'

export interface BuildCoaIntegrityPackZipInput {
  projectId: string
  batches: AuditIntegrityBatch[]
}

export interface CoaIntegrityPackZipResult {
  filename: string
  buffer: Buffer
  batchCount: number
}

/** Build an offline COA zip: README + digests.csv + per-batch manifest/.ots. */
export const buildCoaIntegrityPackZip = async (
  input: BuildCoaIntegrityPackZipInput
): Promise<CoaIntegrityPackZipResult> => {
  const zip = new JSZip()
  zip.file(COA_INTEGRITY_PACK_README_FILENAME, COA_INTEGRITY_PACK_README)
  zip.file(COA_INTEGRITY_PACK_DIGESTS_CSV_FILENAME, buildCoaIntegrityPackCsv(input.batches))

  for (const batch of input.batches) {
    const folder = `${COA_INTEGRITY_PACK_BATCHES_DIR}/${batch.id}`
    const manifest = buildIntegrityEvidenceManifest({
      batchId: batch.id,
      merkleRoot: batch.merkleRoot,
      status: batch.status,
      leafCount: batch.leafCount,
      sealedAt: batch.sealedAt,
      projectDataHashes: batch.projectDataHashes,
      financialDataHashes: batch.financialDataHashes,
      projectIds: [input.projectId],
    })
    zip.file(`${folder}/${INTEGRITY_EVIDENCE_MANIFEST_FILENAME}`, JSON.stringify(manifest, null, 2))
    if (batch.otsProof) {
      zip.file(
        `${folder}/${INTEGRITY_EVIDENCE_PROOF_FILENAME}`,
        Buffer.from(batch.otsProof, 'base64')
      )
    }
  }

  const buffer = Buffer.from(await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }))
  const safeProject = input.projectId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 24) || 'project'
  const stamp = new Date().toISOString().slice(0, 10)

  return {
    filename: `kwentas-klaras-coa-integrity-${safeProject}-${stamp}.zip`,
    buffer,
    batchCount: input.batches.length,
  }
}
