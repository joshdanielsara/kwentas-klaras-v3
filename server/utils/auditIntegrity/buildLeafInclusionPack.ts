import type { AuditIntegrityBatch, ProjectActivity } from '@prisma/client'
import { INTEGRITY_LEAF_KIND, type IntegrityLeafKind } from '../../../app/constants/audit/integrityLeafKinds'
import { buildMerkleProof, type MerkleProofStep } from './merkleTree'
import {
  parseProjectDataSealMap,
  projectDataHashesToLeafList,
} from './parseProjectDataHashes'
import {
  financialDataSealsToLeafList,
  parseFinancialDataSealMap,
} from './parseFinancialDataSeals'

export interface LeafInclusionPack {
  version: 1
  leafKind: IntegrityLeafKind
  leafId: string
  projectId: string
  batchId: string
  merkleRoot: string
  leafHash: string
  leafIndex: number
  inclusionProof: MerkleProofStep[]
  otsProof: string | null
  snapshot: unknown
  sealedAt: string | null
}

const rebuildLeaves = (
  batch: AuditIntegrityBatch,
  batchActivities: ProjectActivity[]
): string[] => {
  const ordered = [...batchActivities].sort(
    (a, b) => (a.merkleIndex ?? 0) - (b.merkleIndex ?? 0)
  )
  const activityLeaves = ordered
    .filter((activity) => activity.integrityHash)
    .map((activity) => activity.integrityHash as string)
  const projectLeaves = projectDataHashesToLeafList(
    Object.fromEntries(
      Object.entries(parseProjectDataSealMap(batch.projectDataHashes)).map(
        ([id, entry]) => [id, entry.hash]
      )
    )
  )
  const financialLeaves = financialDataSealsToLeafList(
    parseFinancialDataSealMap(batch.financialDataHashes)
  )
  return [...activityLeaves, ...projectLeaves, ...financialLeaves]
}

/**
 * Build an offline verify pack for one sealed leaf (activity / project / money row).
 */
export const buildLeafInclusionPack = (input: {
  leafKind: IntegrityLeafKind
  leafId: string
  projectId: string
  batch: AuditIntegrityBatch
  batchActivities: ProjectActivity[]
}): LeafInclusionPack | null => {
  const leaves = rebuildLeaves(input.batch, input.batchActivities)
  let leafIndex = -1
  let leafHash = ''
  let snapshot: unknown = null

  if (input.leafKind === INTEGRITY_LEAF_KIND.ACTIVITY) {
    const ordered = [...input.batchActivities].sort(
      (a, b) => (a.merkleIndex ?? 0) - (b.merkleIndex ?? 0)
    )
    const activity = ordered.find((row) => row.id === input.leafId)
    if (!activity?.integrityHash) {
      return null
    }
    leafIndex = ordered.findIndex((row) => row.id === input.leafId)
    leafHash = activity.integrityHash
    snapshot = {
      id: activity.id,
      action: activity.action,
      description: activity.description,
      actorType: activity.actorType,
      actorId: activity.actorId,
      actorRoleSnapshot: activity.actorRoleSnapshot,
      source: activity.source,
      userId: activity.userId,
      createdAt: activity.createdAt,
    }
  } else if (input.leafKind === INTEGRITY_LEAF_KIND.PROJECT) {
    const seals = parseProjectDataSealMap(input.batch.projectDataHashes)
    const entry = seals[input.leafId]
    if (!entry) {
      return null
    }
    const activityCount = input.batchActivities.filter((row) => row.integrityHash).length
    const projectIds = Object.keys(seals).sort()
    leafIndex = activityCount + projectIds.indexOf(input.leafId)
    leafHash = entry.hash
    snapshot = entry.snapshot ?? { projectId: input.leafId, hash: entry.hash }
  } else {
    const financial = parseFinancialDataSealMap(input.batch.financialDataHashes)
    const kindMap =
      input.leafKind === INTEGRITY_LEAF_KIND.BUDGET
        ? financial.budgets
        : input.leafKind === INTEGRITY_LEAF_KIND.OBLIGATION
          ? financial.obligations
          : financial.disbursements
    const entry = kindMap[input.leafId]
    if (!entry) {
      return null
    }
    const activityCount = input.batchActivities.filter((row) => row.integrityHash).length
    const projectCount = Object.keys(
      parseProjectDataSealMap(input.batch.projectDataHashes)
    ).length
    const financialLeaves = financialDataSealsToLeafList(financial)
    const offset = activityCount + projectCount
    leafIndex = offset + financialLeaves.indexOf(entry.hash)
    leafHash = entry.hash
    snapshot = entry.snapshot
  }

  if (leafIndex < 0 || leafIndex >= leaves.length || leaves[leafIndex] !== leafHash) {
    return null
  }

  return {
    version: 1,
    leafKind: input.leafKind,
    leafId: input.leafId,
    projectId: input.projectId,
    batchId: input.batch.id,
    merkleRoot: input.batch.merkleRoot,
    leafHash,
    leafIndex,
    inclusionProof: buildMerkleProof(leaves, leafIndex),
    otsProof: input.batch.otsProof,
    snapshot,
    sealedAt: input.batch.sealedAt ? input.batch.sealedAt.toISOString() : null,
  }
}
