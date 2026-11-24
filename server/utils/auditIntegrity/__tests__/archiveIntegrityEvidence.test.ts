import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { archiveIntegrityEvidence } from '../archiveIntegrityEvidence'
import { INTEGRITY_ARCHIVE_PROVIDER } from '../../../../app/constants/audit/integrityArchiveProviders'
import type { IObjectStore } from '../../objectStore/IObjectStore'

describe('archiveIntegrityEvidence', () => {
  it('no-ops when archive is disabled', async () => {
    const result = await archiveIntegrityEvidence(
      {
        batchId: 'batch-1',
        merkleRoot: 'abc',
        status: 'submitted',
        leafCount: 1,
      },
      {
        config: {
          provider: INTEGRITY_ARCHIVE_PROVIDER.NONE,
          enabled: false,
          keyPrefix: 'integrity-evidence/',
        },
        store: null,
      }
    )
    assert.equal(result.archived, false)
  })

  it('writes manifest and proof through the object store', async () => {
    const puts: Array<{ key: string; contentType: string }> = []
    const store: IObjectStore = {
      async putObject(input) {
        puts.push({ key: input.key, contentType: input.contentType })
      },
    }

    const result = await archiveIntegrityEvidence(
      {
        batchId: 'batch-1',
        merkleRoot: 'abc',
        status: 'submitted',
        leafCount: 2,
        otsProof: Buffer.from('ots-bytes').toString('base64'),
        projectIds: ['p1'],
      },
      {
        config: {
          provider: INTEGRITY_ARCHIVE_PROVIDER.R2,
          enabled: true,
          keyPrefix: 'integrity-evidence/',
          s3: {
            bucket: 'seals',
            region: 'auto',
            accessKeyId: 'k',
            secretAccessKey: 's',
            endpoint: 'https://example.r2.cloudflarestorage.com',
            forcePathStyle: true,
          },
        },
        store,
      }
    )

    assert.equal(result.archived, true)
    assert.equal(puts.length, 2)
    assert.equal(puts[0].key, 'integrity-evidence/batch-1/manifest.json')
    assert.equal(puts[1].key, 'integrity-evidence/batch-1/proof.ots')
  })
})
