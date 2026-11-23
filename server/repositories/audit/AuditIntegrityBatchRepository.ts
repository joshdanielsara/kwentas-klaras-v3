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
    const activity = await this.client.projectActivity.findFirst({
      where: {
        projectId,
        batchId: { not: null },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!activity?.batchId) {
      return null
    }

    return this.client.auditIntegrityBatch.findUnique({ where: { id: activity.batchId } })
  }

  async updateById(
    id: string,
    data: Prisma.AuditIntegrityBatchUpdateInput
  ): Promise<AuditIntegrityBatch> {
    return this.client.auditIntegrityBatch.update({ where: { id }, data })
  }
}
