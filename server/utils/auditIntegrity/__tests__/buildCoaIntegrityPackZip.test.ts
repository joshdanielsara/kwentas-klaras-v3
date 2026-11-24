import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import JSZip from 'jszip'
import type { AuditIntegrityBatch } from '@prisma/client'
import { buildCoaIntegrityPackZip } from '../buildCoaIntegrityPackZip'
import { buildCoaIntegrityPackCsv } from '../buildCoaIntegrityPackCsv'
import {
  COA_INTEGRITY_PACK_DIGESTS_CSV_FILENAME,
  COA_INTEGRITY_PACK_README_FILENAME,
} from '../../../../app/constants/audit/coaIntegrityPack'

const sampleBatch = (overrides: Partial<AuditIntegrityBatch> = {}): AuditIntegrityBatch =>
  ({
    id: 'batch1',
    merkleRoot: 'abc123',
    otsProof: Buffer.from('ots').toString('base64'),
    status: 'submitted',
    leafCount: 3,
    projectDataHashes: '{"p1":{"hash":"h"}}',
    financialDataHashes: null,
    sealedAt: new Date('2026-01-15T00:00:00.000Z'),
    createdAt: new Date('2026-01-15T00:00:00.000Z'),
    updatedAt: new Date('2026-01-15T00:00:00.000Z'),
    ...overrides,
  }) as AuditIntegrityBatch

describe('buildCoaIntegrityPackZip', () => {
  it('builds digests csv rows', () => {
    const csv = buildCoaIntegrityPackCsv([sampleBatch()])
    assert.match(csv, /batch_id,merkle_root/)
    assert.match(csv, /batch1,abc123,submitted,3/)
    assert.match(csv, /yes/)
  })

  it('packs readme, csv, manifest, and ots proof', async () => {
    const pack = await buildCoaIntegrityPackZip({
      projectId: 'proj-1',
      batches: [sampleBatch()],
    })
    assert.equal(pack.batchCount, 1)
    assert.match(pack.filename, /\.zip$/)

    const zip = await JSZip.loadAsync(pack.buffer)
    assert.ok(zip.file(COA_INTEGRITY_PACK_README_FILENAME))
    assert.ok(zip.file(COA_INTEGRITY_PACK_DIGESTS_CSV_FILENAME))
    assert.ok(zip.file('batches/batch1/manifest.json'))
    assert.ok(zip.file('batches/batch1/proof.ots'))
  })
})
