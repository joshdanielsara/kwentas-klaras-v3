import { ProjectActivityRepository } from '../../repositories/project/ProjectActivityRepository'
import { ProjectActivitySerializer } from '../../serializers/ProjectActivitySerializer'
import { hashActivityPayload } from '../../utils/auditIntegrity/hashActivity'
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
  }) {
    const createdAt = new Date()
    const integrityHash = hashActivityPayload({
      projectId: data.projectId,
      action: data.action,
      description: data.description,
      userId: data.userId,
      metadata: data.metadata,
      createdAt,
    })

    const activity = await this.repo.create({
      ...data,
      integrityHash,
      createdAt,
    })

    // Background OpenTimestamps seal — no manual CLI required
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
