import type { AuditIntegrityBatch, Prisma } from '@prisma/client'

export interface IAuditIntegrityBatchRepository {
  create(data: Prisma.AuditIntegrityBatchCreateInput): Promise<AuditIntegrityBatch>
  findById(id: string): Promise<AuditIntegrityBatch | null>
  findLatestForProject(projectId: string): Promise<AuditIntegrityBatch | null>
  findManyByIds(ids: string[]): Promise<AuditIntegrityBatch[]>
  findAllForProject(projectId: string): Promise<AuditIntegrityBatch[]>
  updateById(id: string, data: Prisma.AuditIntegrityBatchUpdateInput): Promise<AuditIntegrityBatch>
}
