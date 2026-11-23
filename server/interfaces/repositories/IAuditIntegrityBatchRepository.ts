import type { AuditIntegrityBatch, Prisma } from '@prisma/client'

export interface IAuditIntegrityBatchRepository {
  create(data: Prisma.AuditIntegrityBatchCreateInput): Promise<AuditIntegrityBatch>
  findById(id: string): Promise<AuditIntegrityBatch | null>
  findLatestForProject(projectId: string): Promise<AuditIntegrityBatch | null>
  updateById(id: string, data: Prisma.AuditIntegrityBatchUpdateInput): Promise<AuditIntegrityBatch>
}
