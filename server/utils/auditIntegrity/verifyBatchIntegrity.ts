import type { ProjectActivity } from '@prisma/client'
import { hashActivityPayload } from './hashActivity'
import { buildMerkleProof, buildMerkleRoot, verifyMerkleProof } from './merkleTree'
import { verifyDigestHexProof } from './openTimestampsClient'
import { INTEGRITY_VERIFY_DETAIL } from '../../../app/constants/audit/integrityVerifyDetail'
import {
  diffProjectIntegritySnapshots,
  type ProjectIntegrityAlteration,
} from './diffProjectIntegritySnapshots'
import {
  parseProjectDataHashes,
  parseProjectDataSealMap,
  projectDataHashesToLeafList,
  type ProjectDataHashMap,
} from './parseProjectDataHashes'
import type { ProjectIntegritySnapshot } from './projectIntegritySnapshot'

export interface BatchIntegrityVerifyResult {
  merkleOk: boolean
  otsOk: boolean
  activityHashesMatch: boolean
  projectDataMatch: boolean | null
  verified: boolean
  detail: string
  alterations: ProjectIntegrityAlteration[]
}

/**
 * Verify sealed activities (+ optional project master-data hashes) against Merkle root + OTS.
 * Leaf order: activities by merkleIndex, then project data hashes sorted by projectId.
 */
export const verifyBatchIntegrity = async (input: {
  projectId: string
  projectActivities: ProjectActivity[]
  batchActivities: ProjectActivity[]
  merkleRoot: string
  otsProof: string | null
  projectDataHashesJson?: string | null
  currentProjectDataHash?: string | null
  currentProjectSnapshot?: ProjectIntegritySnapshot | null
}): Promise<BatchIntegrityVerifyResult> => {
  const ordered = [...input.batchActivities].sort(
    (a, b) => (a.merkleIndex ?? 0) - (b.merkleIndex ?? 0)
  )

  const activityIds = new Set(input.projectActivities.map((activity) => activity.id))
  const activityHashChecks = input.projectActivities
    .filter((activity) => activity.integrityHash)
    .map((activity) => {
      const recomputed = hashActivityPayload({
        projectId: activity.projectId,
        action: activity.action,
        description: activity.description,
        userId: activity.userId,
        metadata: activity.metadata,
        createdAt: activity.createdAt,
      })
      return recomputed === activity.integrityHash
    })

  const activityHashesMatch =
    activityHashChecks.length > 0 && activityHashChecks.every(Boolean)

  const sealedProjectData = parseProjectDataHashes(input.projectDataHashesJson)
  const sealedProjectHash = sealedProjectData[input.projectId] ?? null
  const sealEntry = parseProjectDataSealMap(input.projectDataHashesJson)[input.projectId]

  let projectDataMatch: boolean | null = null
  if (sealedProjectHash && input.currentProjectDataHash) {
    projectDataMatch = sealedProjectHash === input.currentProjectDataHash
  } else if (sealedProjectHash && !input.currentProjectDataHash) {
    projectDataMatch = false
  }

  let alterations: ProjectIntegrityAlteration[] = []
  if (
    projectDataMatch === false &&
    sealEntry?.snapshot &&
    input.currentProjectSnapshot
  ) {
    alterations = diffProjectIntegritySnapshots(
      sealEntry.snapshot,
      input.currentProjectSnapshot
    )
  }

  const activityLeaves = ordered
    .filter((activity) => activity.integrityHash)
    .map((activity) => activity.integrityHash as string)

  const projectLeaves = projectDataHashesToLeafList(sealedProjectData)
  const leaves = [...activityLeaves, ...projectLeaves]

  const root = buildMerkleRoot(leaves)
  let merkleOk =
    activityHashesMatch &&
    root === input.merkleRoot &&
    projectDataMatch !== false

  if (merkleOk && activityLeaves.length > 0) {
    const projectLeafIndexes = ordered
      .map((activity, index) => (activityIds.has(activity.id) ? index : -1))
      .filter((index) => index >= 0)

    const indexToCheck = projectLeafIndexes[0] ?? 0
    const proof = buildMerkleProof(leaves, indexToCheck)
    merkleOk = verifyMerkleProof(leaves[indexToCheck], proof, input.merkleRoot)
  }

  let otsOk = false
  let detail = ''

  if (projectDataMatch === false) {
    detail = INTEGRITY_VERIFY_DETAIL.PROJECT_DATA_MISMATCH
  } else if (!merkleOk) {
    detail = activityHashesMatch
      ? INTEGRITY_VERIFY_DETAIL.MERKLE_MISMATCH
      : INTEGRITY_VERIFY_DETAIL.ACTIVITY_HASH_MISMATCH
  } else if (!input.otsProof) {
    detail = INTEGRITY_VERIFY_DETAIL.NO_OTS_PROOF
  } else {
    const ots = await verifyDigestHexProof(input.merkleRoot, input.otsProof)
    otsOk = ots.ok
    detail = ots.detail
  }

  return {
    merkleOk,
    otsOk,
    activityHashesMatch,
    projectDataMatch,
    verified: merkleOk && otsOk && projectDataMatch !== false,
    detail,
    alterations,
  }
}

export type { ProjectDataHashMap, ProjectIntegrityAlteration }
