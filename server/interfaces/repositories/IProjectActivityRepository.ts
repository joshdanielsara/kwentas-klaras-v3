import type { ProjectActivity } from '@prisma/client'

export interface IProjectActivityRepository {
  create(data: {
    projectId: string
    action: string
    description: string
    userId?: string
    actorType?: string
    actorId?: string
    actorRoleSnapshot?: string
    source?: string
    canonVersion?: number
    metadata?: string
    integrityHash?: string
    createdAt?: Date
  }): Promise<ProjectActivity>
  findByProjectId(projectId: string): Promise<ProjectActivity[]>
  findByBatchId(batchId: string): Promise<ProjectActivity[]>
  findRecent(limit: number): Promise<ProjectActivity[]>
  findAll(): Promise<ProjectActivity[]>
  findUnbatchedWithHash(): Promise<ProjectActivity[]>
  assignBatch(
    activityIds: string[],
    batchId: string,
    indexById: Map<string, number>
  ): Promise<void>
  updateIntegrityHash(id: string, integrityHash: string): Promise<ProjectActivity>
}
