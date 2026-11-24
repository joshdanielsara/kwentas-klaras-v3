import { prisma } from '../../lib/prisma'
import type { IntegrityApproval, PrismaClient } from '@prisma/client'

export class IntegrityApprovalRepository {
  private client: PrismaClient

  constructor(client?: PrismaClient) {
    this.client = client || prisma
  }

  async create(data: {
    projectId: string
    resourceType: string
    resourceId: string
    requestId?: string | null
    status: string
    actorType?: string | null
    actorId?: string | null
    actorRoleSnapshot?: string | null
    note?: string | null
    approvedAt?: Date | null
  }): Promise<IntegrityApproval> {
    return this.client.integrityApproval.create({
      data: {
        projectId: data.projectId,
        resourceType: data.resourceType,
        resourceId: data.resourceId,
        requestId: data.requestId ?? undefined,
        status: data.status,
        actorType: data.actorType ?? undefined,
        actorId: data.actorId ?? undefined,
        actorRoleSnapshot: data.actorRoleSnapshot ?? undefined,
        note: data.note ?? undefined,
        approvedAt: data.approvedAt ?? undefined,
      },
    })
  }

  async findById(id: string): Promise<IntegrityApproval | null> {
    return this.client.integrityApproval.findUnique({ where: { id } })
  }

  async findByIds(ids: string[]): Promise<IntegrityApproval[]> {
    if (!ids.length) {
      return []
    }
    return this.client.integrityApproval.findMany({
      where: { id: { in: ids } },
    })
  }

  async findByResource(
    resourceType: string,
    resourceId: string
  ): Promise<IntegrityApproval | null> {
    return this.client.integrityApproval.findFirst({
      where: { resourceType, resourceId },
      orderBy: { createdAt: 'desc' },
    })
  }
}
