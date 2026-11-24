import type {
  AdditionalBudget,
  Disbursement,
  Obligation,
  Project,
} from '@prisma/client'
import { AUDIT_BATCH_STATUS } from '../../../app/constants/audit/integrityStatus'
import { PUBLIC_INTEGRITY_LABELS } from '../../../app/constants/audit/integrityStatus'
import { PUBLIC_INTEGRITY_HELPER } from '../../../app/constants/audit/integrityCopy'
import { ProjectActivityRepository } from '../../repositories/project/ProjectActivityRepository'
import { AuditIntegrityBatchRepository } from '../../repositories/audit/AuditIntegrityBatchRepository'
import { ProjectRepository } from '../../repositories/project/ProjectRepository'
import { AdditionalBudgetRepository } from '../../repositories/additionalBudget/AdditionalBudgetRepository'
import { ObligationRepository } from '../../repositories/obligation/ObligationRepository'
import { DisbursementRepository } from '../../repositories/disbursement/DisbursementRepository'
import { hashActivityPayload } from '../../utils/auditIntegrity/hashActivity'
import { hashProjectPayload } from '../../utils/auditIntegrity/hashProject'
import { buildMerkleRoot } from '../../utils/auditIntegrity/merkleTree'
import { mapPublicIntegrityStatus } from '../../utils/auditIntegrity/mapPublicIntegrityStatus'
import { buildPublicIntegrityTimeline } from '../../utils/auditIntegrity/buildPublicIntegrityTimeline'
import { stampDigestHex } from '../../utils/auditIntegrity/openTimestampsClient'
import { verifyBatchIntegrity } from '../../utils/auditIntegrity/verifyBatchIntegrity'
import type { ProjectIntegrityAlteration } from '../../utils/auditIntegrity/diffProjectIntegritySnapshots'
import {
  projectDataHashesToLeafList,
  serializeProjectDataSealMap,
  type ProjectDataSealMap,
} from '../../utils/auditIntegrity/parseProjectDataHashes'
import { toProjectIntegritySnapshot } from '../../utils/auditIntegrity/projectIntegritySnapshot'
import type { ProjectIntegrityPayload } from '../../utils/auditIntegrity/canonicalizeProject'
import { buildFinancialDataSealMap } from '../../utils/auditIntegrity/buildFinancialDataSealMap'
import {
  financialDataSealsToLeafList,
  serializeFinancialDataSealMap,
} from '../../utils/auditIntegrity/parseFinancialDataSeals'
import type { FinancialRecordPayload } from '../../utils/auditIntegrity/financialRecordSnapshot'
import { archiveIntegrityEvidence } from '../../utils/auditIntegrity/archiveIntegrityEvidence'
import { aggregateHistoricalBatchVerify } from '../../utils/auditIntegrity/aggregateHistoricalBatchVerify'
import {
  INTEGRITY_HISTORY_SCOPE,
} from '../../../app/constants/audit/integrityHistoryScope'
import { buildFollowTheMoneyTrail } from '../../utils/auditIntegrity/buildFollowTheMoneyTrail'
import { buildSealHistoryEntries } from '../../utils/auditIntegrity/buildSealHistoryEntries'
import { buildLeafInclusionPack } from '../../utils/auditIntegrity/buildLeafInclusionPack'
import { parseFinancialDataSealMap } from '../../utils/auditIntegrity/parseFinancialDataSeals'
import {
  attachMoneyApprovalSealFields,
  collectMoneyApprovalIds,
} from '../../utils/auditIntegrity/attachMoneyApprovalSealFields'
import { IntegrityApprovalRepository } from '../../repositories/audit/IntegrityApprovalRepository'
import { INTEGRITY_LEAF_KINDS, type IntegrityLeafKind } from '../../../app/constants/audit/integrityLeafKinds'

export class AuditIntegrityService {
  private activityRepo: ProjectActivityRepository
  private batchRepo: AuditIntegrityBatchRepository
  private approvalRepo: IntegrityApprovalRepository
  private projectRepo: ProjectRepository
  private budgetRepo: AdditionalBudgetRepository
  private obligationRepo: ObligationRepository
  private disbursementRepo: DisbursementRepository

  constructor(
    activityRepo?: ProjectActivityRepository,
    batchRepo?: AuditIntegrityBatchRepository,
    projectRepo?: ProjectRepository,
    budgetRepo?: AdditionalBudgetRepository,
    obligationRepo?: ObligationRepository,
    disbursementRepo?: DisbursementRepository
  ) {
    this.activityRepo = activityRepo || new ProjectActivityRepository()
    this.batchRepo = batchRepo || new AuditIntegrityBatchRepository()
    this.approvalRepo = new IntegrityApprovalRepository()
    this.projectRepo = projectRepo || new ProjectRepository()
    this.budgetRepo = budgetRepo || new AdditionalBudgetRepository()
    this.obligationRepo = obligationRepo || new ObligationRepository()
    this.disbursementRepo = disbursementRepo || new DisbursementRepository()
  }

  async sealPendingActivities(limit = 500) {
    const pending = (await this.activityRepo.findUnbatchedWithHash()).slice(0, limit)
    if (pending.length === 0) {
      return { sealed: 0, batchId: null as string | null }
    }

    const leaves: string[] = []
    for (const activity of pending) {
      let hash = activity.integrityHash
      if (!hash) {
        hash = hashActivityPayload({
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
        await this.activityRepo.updateIntegrityHash(activity.id, hash)
      }
      leaves.push(hash)
    }

    const projectIds = [...new Set(pending.map((activity) => activity.projectId))]
    const projectDataSeals: ProjectDataSealMap = {}
    for (const projectId of projectIds) {
      const project = await this.projectRepo.findById(projectId)
      if (!project || project.deletedAt) {
        continue
      }
      const payload = this.toPayload(project)
      projectDataSeals[projectId] = {
        hash: hashProjectPayload(payload),
        snapshot: toProjectIntegritySnapshot(payload),
      }
    }

    const financialSeals = await this.buildFinancialSealsForProjects(projectIds)
    const hashMap = Object.fromEntries(
      Object.entries(projectDataSeals).map(([id, entry]) => [id, entry.hash])
    )
    const projectLeaves = projectDataHashesToLeafList(hashMap)
    const financialLeaves = financialDataSealsToLeafList(financialSeals)
    const merkleRoot = buildMerkleRoot([...leaves, ...projectLeaves, ...financialLeaves])
    const otsProof = await stampDigestHex(merkleRoot)

    const batch = await this.batchRepo.create({
      merkleRoot,
      otsProof,
      status: AUDIT_BATCH_STATUS.SUBMITTED,
      leafCount: leaves.length + projectLeaves.length + financialLeaves.length,
      projectDataHashes: serializeProjectDataSealMap(projectDataSeals),
      financialDataHashes: serializeFinancialDataSealMap(financialSeals),
      sealedAt: new Date(),
    })

    const indexById = new Map<string, number>()
    pending.forEach((activity, index) => {
      indexById.set(activity.id, index)
    })

    await this.activityRepo.assignBatch(
      pending.map((activity) => activity.id),
      batch.id,
      indexById
    )

    await archiveIntegrityEvidence({
      batchId: batch.id,
      merkleRoot: batch.merkleRoot,
      status: batch.status,
      leafCount: batch.leafCount,
      sealedAt: batch.sealedAt,
      projectDataHashes: batch.projectDataHashes,
      financialDataHashes: batch.financialDataHashes,
      projectIds,
      otsProof: batch.otsProof,
    })

    return {
      sealed: pending.length,
      batchId: batch.id,
      merkleRoot,
      projectCount: Object.keys(projectDataSeals).length,
      financialLeafCount: financialLeaves.length,
    }
  }

  async getProjectIntegrity(projectId: string, runVerify: boolean) {
    const activities = await this.activityRepo.findByProjectId(projectId)
    const sealed = activities.filter((activity) => activity.batchId && activity.integrityHash)
    const batches = await this.batchRepo.findAllForProject(projectId)
    const batch = batches[0] ?? null
    const project = await this.projectRepo.findById(projectId)

    let verified: boolean | null = null
    let verifyDetail: string | null = null
    let alterations: ProjectIntegrityAlteration[] = []
    let historyScope = INTEGRITY_HISTORY_SCOPE.NONE
    let historyBatchCount = 0
    let historyVerifiedCount = 0
    let historyFailedCount = 0
    let batchResults: Array<{
      batchId: string
      verified: boolean
      detail: string
      isLatest: boolean
      checkLiveProjectAndFinancial: boolean
    }> = []

    if (runVerify && batches.length > 0 && sealed.length > 0) {
      const payload = project ? this.toPayload(project) : null
      const currentProjectDataHash = payload ? hashProjectPayload(payload) : null
      const currentFinancialSeals = await this.buildFinancialSealsForProjects([projectId])
      const currentProjectSnapshot = payload
        ? toProjectIntegritySnapshot(payload)
        : null

      const perBatch = []
      for (let index = 0; index < batches.length; index += 1) {
        const historicalBatch = batches[index]
        const isLatest = index === 0
        const projectBatchActivities = sealed.filter(
          (activity) => activity.batchId === historicalBatch.id
        )
        const batchActivities = await this.activityRepo.findByBatchId(historicalBatch.id)
        const result = await verifyBatchIntegrity({
          projectId,
          projectActivities: projectBatchActivities,
          batchActivities,
          merkleRoot: historicalBatch.merkleRoot,
          otsProof: historicalBatch.otsProof,
          projectDataHashesJson: historicalBatch.projectDataHashes,
          financialDataHashesJson: historicalBatch.financialDataHashes,
          currentProjectDataHash: isLatest ? currentProjectDataHash : null,
          currentProjectSnapshot: isLatest ? currentProjectSnapshot : null,
          currentFinancialSeals: isLatest ? currentFinancialSeals : null,
          checkLiveProjectAndFinancial: isLatest,
        })
        perBatch.push({
          batchId: historicalBatch.id,
          isLatest,
          checkLiveProjectAndFinancial: isLatest,
          result,
        })
      }

      const aggregate = aggregateHistoricalBatchVerify(perBatch)
      verified = aggregate.verified
      verifyDetail = aggregate.detail
      alterations = aggregate.alterations
      historyScope = aggregate.historyScope
      historyBatchCount = aggregate.historyBatchCount
      historyVerifiedCount = aggregate.historyVerifiedCount
      historyFailedCount = aggregate.historyFailedCount
      batchResults = aggregate.batchResults
    }

    const status = mapPublicIntegrityStatus({
      activityCount: activities.length,
      sealedCount: sealed.length,
      batchStatus: batch?.status,
      verified: runVerify ? verified : null,
    })

    const checkedAt = runVerify ? new Date() : null
    const latestWithActor = [...activities]
      .reverse()
      .find((activity) => activity.actorType || activity.actorId || activity.userId)
    const actorSummary = latestWithActor
      ? [
          latestWithActor.actorType || 'unknown',
          latestWithActor.actorRoleSnapshot,
          latestWithActor.actorId || latestWithActor.userId,
        ]
          .filter(Boolean)
          .join(' · ')
      : null

    const timeline = buildPublicIntegrityTimeline({
      activityCount: activities.length,
      sealedCount: sealed.length,
      sealedAt: batch?.sealedAt ?? null,
      verified: runVerify ? verified : null,
      verifyDetail,
      checkedAt,
      actorSummary,
    })

    const [budgetRows, obligationRows, disbursementRows] = await Promise.all([
      this.budgetRepo.findByProjectId(projectId),
      this.obligationRepo.findByProjectId(projectId),
      this.disbursementRepo.findByProjectId(projectId),
    ])
    const sealedFinancial = parseFinancialDataSealMap(batch?.financialDataHashes)
    const moneyTrail = buildFollowTheMoneyTrail({
      appropriation: project?.appropriation ?? 0,
      budgets: budgetRows,
      obligations: obligationRows,
      disbursements: disbursementRows,
      sealedFinancial,
    })
    const sealHistory = buildSealHistoryEntries({
      batches,
      batchResults,
    })

    return {
      projectId,
      status,
      label: PUBLIC_INTEGRITY_LABELS[status],
      activityCount: activities.length,
      sealedCount: sealed.length,
      sealedAt: batch?.sealedAt ?? null,
      merkleRoot: batch?.merkleRoot ?? null,
      otsProof: batch?.otsProof ?? null,
      batchId: batch?.id ?? null,
      batchStatus: batch?.status ?? null,
      verified,
      verifyDetail,
      alterations,
      historyScope,
      historyBatchCount,
      historyVerifiedCount,
      historyFailedCount,
      batchResults,
      sealHistory,
      moneyTrail,
      timeline,
      helperText: PUBLIC_INTEGRITY_HELPER[status],
    }
  }

  async getLeafInclusionPack(
    projectId: string,
    leafKind: IntegrityLeafKind,
    leafId: string
  ) {
    if (!INTEGRITY_LEAF_KINDS.includes(leafKind)) {
      return null
    }

    const batches = await this.batchRepo.findAllForProject(projectId)
    for (const batch of batches) {
      const batchActivities = await this.activityRepo.findByBatchId(batch.id)
      const pack = buildLeafInclusionPack({
        leafKind,
        leafId,
        projectId,
        batch,
        batchActivities,
      })
      if (pack) {
        return pack
      }
    }

    return null
  }

  private async buildFinancialSealsForProjects(projectIds: string[]) {
    const budgets: FinancialRecordPayload[] = []
    const obligations: FinancialRecordPayload[] = []
    const disbursements: FinancialRecordPayload[] = []

    for (const projectId of projectIds) {
      const [budgetRows, obligationRows, disbursementRows] = await Promise.all([
        this.budgetRepo.findByProjectId(projectId),
        this.obligationRepo.findByProjectId(projectId),
        this.disbursementRepo.findByProjectId(projectId),
      ])
      budgets.push(...budgetRows.map((row) => this.toBudgetPayload(row)))
      obligations.push(...obligationRows.map((row) => this.toObligationPayload(row)))
      disbursements.push(...disbursementRows.map((row) => this.toDisbursementPayload(row)))
    }

    const approvalIds = collectMoneyApprovalIds([
      ...budgets,
      ...obligations,
      ...disbursements,
    ])
    const approvals = await this.approvalRepo.findByIds(approvalIds)
    const approvalById = new Map(
      approvals.map((row) => [
        row.id,
        { id: row.id, status: row.status, requestId: row.requestId },
      ])
    )

    return buildFinancialDataSealMap({
      budgets: budgets.map((row) =>
        attachMoneyApprovalSealFields(row, approvalById)
      ),
      obligations: obligations.map((row) =>
        attachMoneyApprovalSealFields(row, approvalById)
      ),
      disbursements: disbursements.map((row) =>
        attachMoneyApprovalSealFields(row, approvalById)
      ),
    })
  }

  private toPayload(project: Project): ProjectIntegrityPayload {
    return {
      id: project.id,
      name: project.name,
      implementingUnit: project.implementingUnit,
      location: project.location,
      appropriation: project.appropriation,
      year: project.year,
      services: project.services,
      remarks: project.remarks,
      code: project.code,
      startDate: project.startDate,
      endDate: project.endDate,
      latitude: project.latitude,
      longitude: project.longitude,
    }
  }

  private toBudgetPayload(row: AdditionalBudget): FinancialRecordPayload {
    return {
      id: row.id,
      projectId: row.projectId,
      amount: row.amount,
      reason: row.reason,
      status: row.status,
      approvedBy: row.approvedBy,
      approvedDate: row.approvedDate,
      approvalId: row.approvalId,
    }
  }

  private toObligationPayload(row: Obligation): FinancialRecordPayload {
    return {
      id: row.id,
      projectId: row.projectId,
      amount: row.amount,
      reason: row.reason,
      status: row.status,
      approvedBy: row.approvedBy,
      approvedDate: row.approvedDate,
      payee: row.payee,
      approvalId: row.approvalId,
    }
  }

  private toDisbursementPayload(row: Disbursement): FinancialRecordPayload {
    return {
      id: row.id,
      projectId: row.projectId,
      amount: row.amount,
      reason: row.reason,
      status: row.status,
      approvedBy: row.approvedBy,
      approvedDate: row.approvedDate,
      payee: row.payee,
      approvalId: row.approvalId,
    }
  }
}
