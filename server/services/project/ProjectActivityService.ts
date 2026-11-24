import { ACTIVITY_CANON_VERSION_CURRENT } from '../../../app/constants/audit/integrityActor'
import { ProjectActivityRepository } from '../../repositories/project/ProjectActivityRepository'
import { ProjectActivitySerializer } from '../../serializers/ProjectActivitySerializer'
import { hashActivityPayload } from '../../utils/auditIntegrity/hashActivity'
import { resolveActivityActor } from '../../utils/auditIntegrity/resolveActivityActor'
import { scheduleAuditIntegritySeal } from '../../utils/auditIntegrity/scheduleAuditIntegritySeal'

export class ProjectActivityService {
  private repo: ProjectActivityRepository

  constructor() {
    this.repo = new ProjectActivityRepository()
  }

  async create(data: {
    projectId: string
    action: string
    description: string
    userId?: string
    metadata?: string
    actorType?: string
    actorId?: string
    actorRoleSnapshot?: string
    source?: string
  }) {
    const createdAt = new Date()
    const actor = resolveActivityActor(data)
    const canonVersion = ACTIVITY_CANON_VERSION_CURRENT
    const integrityHash = hashActivityPayload({
      projectId: data.projectId,
      action: data.action,
      description: data.description,
      userId: actor.userId,
      metadata: data.metadata,
      createdAt,
      actorType: actor.actorType,
      actorId: actor.actorId,
      actorRoleSnapshot: actor.actorRoleSnapshot,
      source: actor.source,
      canonVersion,
    })

    const activity = await this.repo.create({
      projectId: data.projectId,
      action: data.action,
      description: data.description,
      userId: actor.userId,
      actorType: actor.actorType,
      actorId: actor.actorId,
      actorRoleSnapshot: actor.actorRoleSnapshot,
      source: actor.source,
      canonVersion,
      metadata: data.metadata,
      integrityHash,
      createdAt,
    })

    scheduleAuditIntegritySeal()

    return ProjectActivitySerializer.format(activity)
  }

  async findByProjectId(projectId: string) {
    const activities = await this.repo.findByProjectId(projectId)
    return ProjectActivitySerializer.list(activities)
  }

  async findAll() {
    const activities = await this.repo.findAll()
    return ProjectActivitySerializer.list(activities)
  }
}
