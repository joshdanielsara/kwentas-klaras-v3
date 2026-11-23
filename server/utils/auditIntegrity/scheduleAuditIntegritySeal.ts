import { AuditIntegrityService } from '../../services/audit/AuditIntegrityService'
import { AUDIT_INTEGRITY_SEAL_DEBOUNCE_MS } from '../../../app/constants/audit/integritySeal'

let debounceTimer: ReturnType<typeof setTimeout> | null = null
let inFlight = false
let rerunRequested = false

const runSeal = async () => {
  if (inFlight) {
    rerunRequested = true
    return
  }

  inFlight = true
  try {
    const result = await new AuditIntegrityService().sealPendingActivities()
    if (result.sealed > 0) {
      console.log('[scheduleAuditIntegritySeal] sealed pending activities', result)
    }
  } catch (error: unknown) {
    console.error('[scheduleAuditIntegritySeal] seal failed', {
      error: error instanceof Error ? error.message : 'unknown',
    })
  } finally {
    inFlight = false
    if (rerunRequested) {
      rerunRequested = false
      scheduleAuditIntegritySeal()
    }
  }
}

/** Debounced background seal after activity writes — no scheduler / CLI required. */
export const scheduleAuditIntegritySeal = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = setTimeout(() => {
    debounceTimer = null
    void runSeal()
  }, AUDIT_INTEGRITY_SEAL_DEBOUNCE_MS)
}
