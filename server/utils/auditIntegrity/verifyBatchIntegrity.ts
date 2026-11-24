import type { ProjectActivity } from '@prisma/client'
import { hashActivityPayload } from './hashActivity'
import { buildMerkleProof, buildMerkleRoot, verifyMerkleProof } from './merkleTree'
import { verifyDigestHexProof } from './openTimestampsClient'
import { INTEGRITY_VERIFY_DETAIL } from '../../../app/constants/audit/integrityVerifyDetail'
import {
  diffProjectIntegritySnapshots,
  type ProjectIntegrityAlteration,
} from './diffProjectIntegritySnapshots'
import { diffFinancialDataSeals } from './diffFinancialDataSeals'
import {
  parseProjectDataHashes,
  parseProjectDataSealMap,
  projectDataHashesToLeafList,
} from './parseProjectDataHashes'
import {
  filterFinancialSealsForProject,
  financialDataSealsToLeafList,
  parseFinancialDataSealMap,
  type FinancialDataSealMap,
} from './parseFinancialDataSeals'
import type { ProjectIntegritySnapshot } from './projectIntegritySnapshot'

export interface BatchIntegrityVerifyResult {
  merkleOk: boolean
  otsOk: boolean
  activityHashesMatch: boolean
  projectDataMatch: boolean | null
  financialDataMatch: boolean | null
  verified: boolean
  detail: string
  alterations: ProjectIntegrityAlteration[]
}

/**
 * Verify sealed activities (+ optional project + financial hashes) against Merkle root + OTS.
 * Leaf order: activities by merkleIndex, then project hashes by projectId, then financial hashes.
 */
export const verifyBatchIntegrity = async (input: {
  projectId: string
  projectActivities: ProjectActivity[]
  batchActivities: ProjectActivity[]
  merkleRoot: string
  otsProof: string | null
  projectDataHashesJson?: string | null
  financialDataHashesJson?: string | null
  currentProjectDataHash?: string | null
  currentProjectSnapshot?: ProjectIntegritySnapshot | null
  currentFinancialSeals?: FinancialDataSealMap | null
  /**
   * When false (older historical batches), skip live project/money comparison so
   * later legitimate edits + re-seals do not false-fail older commitments.
   * Activity digests + Merkle + OTS still run.
   */
  checkLiveProjectAndFinancial?: boolean
}): Promise<BatchIntegrityVerifyResult> => {
  const checkLive = input.checkLiveProjectAndFinancial !== false
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
        actorType: activity.actorType,
        actorId: activity.actorId,
        actorRoleSnapshot: activity.actorRoleSnapshot,
        source: activity.source,
        canonVersion: activity.canonVersion,
      })
      return recomputed === activity.integrityHash
    })

  const activityHashesMatch =
    activityHashChecks.length === 0
      ? true
      : activityHashChecks.every(Boolean)

  const sealedProjectData = parseProjectDataHashes(input.projectDataHashesJson)
  const sealedProjectHash = sealedProjectData[input.projectId] ?? null
  const sealEntry = parseProjectDataSealMap(input.projectDataHashesJson)[input.projectId]

  let projectDataMatch: boolean | null = null
  let alterations: ProjectIntegrityAlteration[] = []

  if (checkLive) {
    if (sealedProjectHash && input.currentProjectDataHash) {
      projectDataMatch = sealedProjectHash === input.currentProjectDataHash
    } else if (sealedProjectHash && !input.currentProjectDataHash) {
      projectDataMatch = false
    }

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
  }

  const sealedFinancialAll = parseFinancialDataSealMap(input.financialDataHashesJson)
  const sealedFinancial = filterFinancialSealsForProject(
    sealedFinancialAll,
    input.projectId
  )

  let financialDataMatch: boolean | null = null
  if (checkLive) {
    const currentFinancial = input.currentFinancialSeals ?? {
      budgets: {},
      obligations: {},
      disbursements: {},
    }
    const financialDiff = diffFinancialDataSeals(sealedFinancial, currentFinancial)
    financialDataMatch = financialDiff.match
    if (financialDataMatch === false) {
      alterations = [...alterations, ...financialDiff.alterations]
    }
  }

  // Historical batch with no remaining project activity leaves still needs merkle from
  // other projects' activities in the same batch; empty project slice is OK if hashes match.

  const activityLeaves = ordered
    .filter((activity) => activity.integrityHash)
    .map((activity) => activity.integrityHash as string)

  const projectLeaves = projectDataHashesToLeafList(sealedProjectData)
  const financialLeaves = financialDataSealsToLeafList(sealedFinancialAll)
  const leaves = [...activityLeaves, ...projectLeaves, ...financialLeaves]

  const root = buildMerkleRoot(leaves)
  let merkleOk =
    activityHashesMatch &&
    root === input.merkleRoot &&
    projectDataMatch !== false &&
    financialDataMatch !== false

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
  } else if (financialDataMatch === false) {
    detail = INTEGRITY_VERIFY_DETAIL.FINANCIAL_DATA_MISMATCH
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
    financialDataMatch,
    verified:
      merkleOk &&
      otsOk &&
      projectDataMatch !== false &&
      financialDataMatch !== false,
    detail,
    alterations,
  }
}
