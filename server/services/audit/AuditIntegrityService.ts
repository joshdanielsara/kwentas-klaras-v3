import type { Project } from '@prisma/client'
import { AUDIT_BATCH_STATUS } from '../../../app/constants/audit/integrityStatus'
import { PUBLIC_INTEGRITY_LABELS } from '../../../app/constants/audit/integrityStatus'
import { PUBLIC_INTEGRITY_HELPER } from '../../../app/constants/audit/integrityCopy'
import { ProjectActivityRepository } from '../../repositories/project/ProjectActivityRepository'
import { AuditIntegrityBatchRepository } from '../../repositories/audit/AuditIntegrityBatchRepository'
import { ProjectRepository } from '../../repositories/project/ProjectRepository'
import { hashActivityPayload } from '../../utils/auditIntegrity/hashActivity'
import { hashProjectPayload } from '../../utils/auditIntegrity/hashProject'
import { buildMerkleRoot } from '../../utils/auditIntegrity/merkleTree'
import { mapPublicIntegrityStatus } from '../../utils/auditIntegrity/mapPublicIntegrityStatus'
import { buildPublicIntegrityTimeline } from '../../utils/auditIntegrity/buildPublicIntegrityTimeline'
import { stampDigestHex } from '../../utils/auditIntegrity/openTimestampsClient'
import {
  verifyBatchIntegrity,
  type ProjectIntegrityAlteration,
} from '../../utils/auditIntegrity/verifyBatchIntegrity'
import {
  projectDataHashesToLeafList,
  serializeProjectDataSealMap,
  type ProjectDataSealMap,
} from '../../utils/auditIntegrity/parseProjectDataHashes'
import { toProjectIntegritySnapshot } from '../../utils/auditIntegrity/projectIntegritySnapshot'
import type { ProjectIntegrityPayload } from '../../utils/auditIntegrity/canonicalizeProject'

export class AuditIntegrityService {
  private activityRepo: ProjectActivityRepository
  private batchRepo: AuditIntegrityBatchRepository
  private projectRepo: ProjectRepository

  constructor(
    activityRepo?: ProjectActivityRepository,
    batchRepo?: AuditIntegrityBatchRepository,
    projectRepo?: ProjectRepository
  ) {
    this.activityRepo = activityRepo || new ProjectActivityRepository()
    this.batchRepo = batchRepo || new AuditIntegrityBatchRepository()
    this.projectRepo = projectRepo || new ProjectRepository()
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

    const hashMap = Object.fromEntries(
      Object.entries(projectDataSeals).map(([id, entry]) => [id, entry.hash])
    )
    const projectLeaves = projectDataHashesToLeafList(hashMap)
    const merkleRoot = buildMerkleRoot([...leaves, ...projectLeaves])
    const otsProof = await stampDigestHex(merkleRoot)

    const batch = await this.batchRepo.create({
      merkleRoot,
      otsProof,
      status: AUDIT_BATCH_STATUS.SUBMITTED,
      leafCount: leaves.length + projectLeaves.length,
      projectDataHashes: serializeProjectDataSealMap(projectDataSeals),
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

    return {
      sealed: pending.length,
      batchId: batch.id,
      merkleRoot,
      projectCount: Object.keys(projectDataSeals).length,
    }
  }

  async getProjectIntegrity(projectId: string, runVerify: boolean) {
    const activities = await this.activityRepo.findByProjectId(projectId)
    const sealed = activities.filter((activity) => activity.batchId && activity.integrityHash)
    const batch = await this.batchRepo.findLatestForProject(projectId)
    const project = await this.projectRepo.findById(projectId)

    let verified: boolean | null = null
    let verifyDetail: string | null = null
    let alterations: ProjectIntegrityAlteration[] = []

    if (runVerify && batch && sealed.length > 0) {
      const projectBatchActivities = sealed.filter(
        (activity) => activity.batchId === batch.id
      )
      const batchActivities = await this.activityRepo.findByBatchId(batch.id)
      const payload = project ? this.toPayload(project) : null
      const currentProjectDataHash = payload ? hashProjectPayload(payload) : null
      const result = await verifyBatchIntegrity({
        projectId,
        projectActivities: projectBatchActivities,
        batchActivities,
        merkleRoot: batch.merkleRoot,
        otsProof: batch.otsProof,
        projectDataHashesJson: batch.projectDataHashes,
        currentProjectDataHash,
        currentProjectSnapshot: payload ? toProjectIntegritySnapshot(payload) : null,
      })

      verified = result.verified
      verifyDetail = result.detail
      alterations = result.alterations
    }

    const status = mapPublicIntegrityStatus({
      activityCount: activities.length,
      sealedCount: sealed.length,
      batchStatus: batch?.status,
      verified: runVerify ? verified : null,
    })

    const checkedAt = runVerify ? new Date() : null
    const timeline = buildPublicIntegrityTimeline({
      activityCount: activities.length,
      sealedCount: sealed.length,
      sealedAt: batch?.sealedAt ?? null,
      verified: runVerify ? verified : null,
      verifyDetail,
      checkedAt,
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
      timeline,
      helperText: PUBLIC_INTEGRITY_HELPER[status],
    }
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
}
