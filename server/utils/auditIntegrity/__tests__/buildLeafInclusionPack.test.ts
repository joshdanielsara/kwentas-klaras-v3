import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import type { AuditIntegrityBatch, ProjectActivity } from '@prisma/client'
import { buildMerkleRoot, verifyMerkleProof } from '../merkleTree'
import { buildLeafInclusionPack } from '../buildLeafInclusionPack'
import { INTEGRITY_LEAF_KIND } from '../../../../app/constants/audit/integrityLeafKinds'
import { hashActivityPayload } from '../hashActivity'

describe('buildLeafInclusionPack', () => {
  it('builds a verifiable inclusion pack for an activity leaf', () => {
    const createdAt = new Date('2026-01-01T00:00:00.000Z')
    const hash = hashActivityPayload({
      projectId: 'p1',
      action: 'created',
      description: 'New project',
      userId: 'u1',
      createdAt,
      canonVersion: 1,
    })

    const activity = {
      id: 'a1',
      projectId: 'p1',
      action: 'created',
      description: 'New project',
      userId: 'u1',
      integrityHash: hash,
      batchId: 'batch1',
      merkleIndex: 0,
      createdAt,
    } as ProjectActivity

    const leaves = [hash]
    const merkleRoot = buildMerkleRoot(leaves)
    const batch = {
      id: 'batch1',
      merkleRoot,
      otsProof: null,
      status: 'submitted',
      leafCount: 1,
      projectDataHashes: null,
      financialDataHashes: null,
      sealedAt: createdAt,
    } as AuditIntegrityBatch

    const pack = buildLeafInclusionPack({
      leafKind: INTEGRITY_LEAF_KIND.ACTIVITY,
      leafId: 'a1',
      projectId: 'p1',
      batch,
      batchActivities: [activity],
    })

    assert.ok(pack)
    assert.equal(pack?.leafHash, hash)
    assert.equal(verifyMerkleProof(pack!.leafHash, pack!.inclusionProof, merkleRoot), true)
  })
})
