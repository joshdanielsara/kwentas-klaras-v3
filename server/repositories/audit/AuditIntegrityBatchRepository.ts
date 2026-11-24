import { prisma } from '../../lib/prisma'
import type { AuditIntegrityBatch, Prisma, PrismaClient } from '@prisma/client'
import { IAuditIntegrityBatchRepository } from '../../interfaces/repositories/IAuditIntegrityBatchRepository'

export class AuditIntegrityBatchRepository implements IAuditIntegrityBatchRepository {
  private client: PrismaClient

  constructor(client?: PrismaClient) {
    this.client = client || prisma
  }

  async create(data: Prisma.AuditIntegrityBatchCreateInput): Promise<AuditIntegrityBatch> {
    return this.client.auditIntegrityBatch.create({ data })
  }

  async findById(id: string): Promise<AuditIntegrityBatch | null> {
    return this.client.auditIntegrityBatch.findUnique({ where: { id } })
  }

  async findLatestForProject(projectId: string): Promise<AuditIntegrityBatch | null> {
    const batches = await this.findAllForProject(projectId)
    return batches[0] ?? null
  }

  async findManyByIds(ids: string[]): Promise<AuditIntegrityBatch[]> {
    if (ids.length === 0) {
      return []
    }
    return this.client.auditIntegrityBatch.findMany({
      where: { id: { in: ids } },
      orderBy: { sealedAt: 'desc' },
    })
  }

  async findAllForProject(projectId: string): Promise<AuditIntegrityBatch[]> {
    const activities = await this.client.projectActivity.findMany({
      where: {
        projectId,
        batchId: { not: null },
      },
      select: { batchId: true },
    })

    const batchIds = [
      ...new Set(
        activities
          .map((activity) => activity.batchId)
          .filter((batchId): batchId is string => Boolean(batchId))
      ),
    ]

    return this.findManyByIds(batchIds)
  }

  async updateById(
    id: string,
    data: Prisma.AuditIntegrityBatchUpdateInput
  ): Promise<AuditIntegrityBatch> {
    return this.client.auditIntegrityBatch.update({ where: { id }, data })
  }
}
