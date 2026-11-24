import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import type { ProjectActivity } from '@prisma/client'
import { hashActivityPayload } from '../hashActivity'
import { hashProjectPayload } from '../hashProject'
import { buildMerkleRoot } from '../merkleTree'
import { verifyBatchIntegrity } from '../verifyBatchIntegrity'
import {
  serializeProjectDataHashes,
  serializeProjectDataSealMap,
} from '../parseProjectDataHashes'
import { toProjectIntegritySnapshot } from '../projectIntegritySnapshot'
import { buildFinancialDataSealMap } from '../buildFinancialDataSealMap'
import { serializeFinancialDataSealMap } from '../parseFinancialDataSeals'

const makeActivity = (
  overrides: Partial<ProjectActivity> & {
    id: string
    projectId: string
    merkleIndex: number
  }
): ProjectActivity => {
  const base = {
    action: 'created',
    description: `Activity ${overrides.id}`,
    userId: null,
    metadata: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    batchId: 'batch-1',
    integrityHash: null as string | null,
    ...overrides,
  }

  const integrityHash =
    overrides.integrityHash ??
    hashActivityPayload({
      projectId: base.projectId,
      action: base.action,
      description: base.description,
      userId: base.userId,
      metadata: base.metadata,
      createdAt: base.createdAt,
    })

  return {
    ...base,
    integrityHash,
  } as ProjectActivity
}

describe('verifyBatchIntegrity', () => {
  it('verifies activity + project data leaves', async () => {
    const a = makeActivity({ id: 'a', projectId: 'p1', merkleIndex: 0 })
    const b = makeActivity({ id: 'b', projectId: 'p2', merkleIndex: 1 })
    const projectDataHashes = {
      p1: '1111111111111111111111111111111111111111111111111111111111111111',
      p2: '2222222222222222222222222222222222222222222222222222222222222222',
    }
    const activityLeaves = [a, b].map((activity) => activity.integrityHash as string)
    const merkleRoot = buildMerkleRoot([
      ...activityLeaves,
      projectDataHashes.p1,
      projectDataHashes.p2,
    ])

    const result = await verifyBatchIntegrity({
      projectId: 'p1',
      projectActivities: [a],
      batchActivities: [a, b],
      merkleRoot,
      otsProof: null,
      projectDataHashesJson: serializeProjectDataHashes(projectDataHashes),
      currentProjectDataHash: projectDataHashes.p1,
    })

    assert.equal(result.activityHashesMatch, true)
    assert.equal(result.projectDataMatch, true)
    assert.equal(result.merkleOk, true)
    assert.equal(result.verified, false)
    assert.deepEqual(result.alterations, [])
    assert.match(result.detail, /No OpenTimestamps|proof/i)
  })

  it('fails when project master data was altered and lists field diffs', async () => {
    const a = makeActivity({ id: 'a', projectId: 'p1', merkleIndex: 0 })
    const sealedPayload = {
      id: 'p1',
      name: 'Test Blockchain',
      appropriation: 1231231,
      year: 2026,
      services: 'Infra',
    }
    const currentPayload = {
      ...sealedPayload,
      name: 'Test Blockchain [DATA TAMPERED]',
      appropriation: 999999999,
    }
    const sealedHash = hashProjectPayload(sealedPayload)
    const currentHash = hashProjectPayload(currentPayload)
    const leaves = [a.integrityHash as string, sealedHash]
    const merkleRoot = buildMerkleRoot(leaves)

    const result = await verifyBatchIntegrity({
      projectId: 'p1',
      projectActivities: [a],
      batchActivities: [a],
      merkleRoot,
      otsProof: null,
      projectDataHashesJson: serializeProjectDataSealMap({
        p1: {
          hash: sealedHash,
          snapshot: toProjectIntegritySnapshot(sealedPayload),
        },
      }),
      currentProjectDataHash: currentHash,
      currentProjectSnapshot: toProjectIntegritySnapshot(currentPayload),
    })

    assert.equal(result.projectDataMatch, false)
    assert.equal(result.verified, false)
    assert.equal(result.detail, 'Project data altered')
    assert.equal(result.alterations.length, 2)
    assert.ok(result.alterations.some((item) => item.field === 'name'))
    assert.ok(result.alterations.some((item) => item.field === 'appropriation'))
  })

  it('fails when sealed obligation amount was altered', async () => {
    const a = makeActivity({ id: 'a', projectId: 'p1', merkleIndex: 0 })
    const sealedFinancial = buildFinancialDataSealMap({
      budgets: [],
      obligations: [
        {
          id: 'o1',
          projectId: 'p1',
          amount: 1000,
          reason: 'Works',
          status: 'approved',
          payee: 'ABC',
        },
      ],
      disbursements: [],
    })
    const currentFinancial = buildFinancialDataSealMap({
      budgets: [],
      obligations: [
        {
          id: 'o1',
          projectId: 'p1',
          amount: 1800,
          reason: 'Works',
          status: 'approved',
          payee: 'ABC',
        },
      ],
      disbursements: [],
    })
    const financialLeaf = sealedFinancial.obligations.o1.hash
    const merkleRoot = buildMerkleRoot([a.integrityHash as string, financialLeaf])

    const result = await verifyBatchIntegrity({
      projectId: 'p1',
      projectActivities: [a],
      batchActivities: [a],
      merkleRoot,
      otsProof: null,
      financialDataHashesJson: serializeFinancialDataSealMap(sealedFinancial),
      currentFinancialSeals: currentFinancial,
    })

    assert.equal(result.financialDataMatch, false)
    assert.equal(result.verified, false)
    assert.equal(result.detail, 'Financial records altered')
    assert.ok(result.alterations.some((item) => item.field.includes('amount')))
  })
})
