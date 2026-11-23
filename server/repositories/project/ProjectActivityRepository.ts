import { prisma } from '../../lib/prisma'
import type { PrismaClient, ProjectActivity } from '@prisma/client'
import { IProjectActivityRepository } from '../../interfaces/repositories/IProjectActivityRepository'

export class ProjectActivityRepository implements IProjectActivityRepository {
  private client: PrismaClient

  constructor(client?: PrismaClient) {
    this.client = client || prisma
  }

  async create(data: {
    projectId: string
    action: string
    description: string
    userId?: string
    metadata?: string
    integrityHash?: string
    createdAt?: Date
  }): Promise<ProjectActivity> {
    return this.client.projectActivity.create({
      data: {
        projectId: data.projectId,
        action: data.action,
        description: data.description,
        userId: data.userId,
        metadata: data.metadata,
        integrityHash: data.integrityHash,
        createdAt: data.createdAt,
      },
    })
  }

  async findByProjectId(projectId: string): Promise<ProjectActivity[]> {
    return this.client.projectActivity.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    })
  }

  async findByBatchId(batchId: string): Promise<ProjectActivity[]> {
    return this.client.projectActivity.findMany({
      where: { batchId },
      orderBy: { merkleIndex: 'asc' },
    })
  }

  async findRecent(limit: number): Promise<ProjectActivity[]> {
    return this.client.projectActivity.findMany({
      where: {
        createdAt: { not: null },
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    })
  }

  async findAll(): Promise<ProjectActivity[]> {
    return this.client.projectActivity.findMany({
      where: {
        createdAt: { not: null },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findUnbatchedWithHash(): Promise<ProjectActivity[]> {
    // Mongo: older rows omit batch_id; Prisma `null` alone does not match unset fields
    return this.client.projectActivity.findMany({
      where: {
        OR: [{ batchId: null }, { batchId: { isSet: false } }],
      },
      orderBy: { createdAt: 'asc' },
    })
  }

  async assignBatch(
    activityIds: string[],
    batchId: string,
    indexById: Map<string, number>
  ): Promise<void> {
    await Promise.all(
      activityIds.map((id) =>
        this.client.projectActivity.update({
          where: { id },
          data: {
            batchId,
            merkleIndex: indexById.get(id) ?? null,
          },
        })
      )
    )
  }

  async updateIntegrityHash(id: string, integrityHash: string): Promise<ProjectActivity> {
    return this.client.projectActivity.update({
      where: { id },
      data: { integrityHash },
    })
  }
}
