import { AuditIntegrityService } from '../server/services/audit/AuditIntegrityService'

async function main() {
  const service = new AuditIntegrityService()
  const result = await service.sealPendingActivities()
  console.log('[sealAuditBatches] completed', result)
}

main().catch((error) => {
  console.error('[sealAuditBatches] failed', error)
  process.exit(1)
})
