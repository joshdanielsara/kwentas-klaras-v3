import { AuditIntegrityBatchRepository } from '../../repositories/audit/AuditIntegrityBatchRepository'
import { buildCoaIntegrityPackZip } from '../../utils/auditIntegrity/buildCoaIntegrityPackZip'

export class CoaIntegrityPackService {
  private batchRepo: AuditIntegrityBatchRepository

  constructor(batchRepo?: AuditIntegrityBatchRepository) {
    this.batchRepo = batchRepo || new AuditIntegrityBatchRepository()
  }

  async buildProjectPack(projectId: string) {
    const batches = await this.batchRepo.findAllForProject(projectId)
    return buildCoaIntegrityPackZip({ projectId, batches })
  }
}
