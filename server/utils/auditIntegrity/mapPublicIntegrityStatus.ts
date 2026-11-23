import {
  AUDIT_BATCH_STATUS,
  PUBLIC_INTEGRITY_STATUS,
  type PublicIntegrityStatus,
} from '../../../app/constants/audit/integrityStatus'

export const mapPublicIntegrityStatus = (input: {
  activityCount: number
  sealedCount: number
  batchStatus?: string | null
  verified?: boolean | null
}): PublicIntegrityStatus => {
  if (input.activityCount === 0) {
    return PUBLIC_INTEGRITY_STATUS.NONE
  }

  const hasUnsealed = input.sealedCount < input.activityCount

  // Tamper on already-sealed rows always wins
  if (input.verified === false) {
    return PUBLIC_INTEGRITY_STATUS.FAILED
  }

  // New activity rows are normal — wait for auto-seal before "Verified"
  if (hasUnsealed) {
    return PUBLIC_INTEGRITY_STATUS.PENDING
  }

  if (input.verified === true) {
    return PUBLIC_INTEGRITY_STATUS.VERIFIED
  }

  if (input.sealedCount === 0) {
    return PUBLIC_INTEGRITY_STATUS.PENDING
  }

  if (
    input.batchStatus === AUDIT_BATCH_STATUS.SUBMITTED ||
    input.batchStatus === AUDIT_BATCH_STATUS.CONFIRMED
  ) {
    return PUBLIC_INTEGRITY_STATUS.SEALED
  }

  return PUBLIC_INTEGRITY_STATUS.PENDING
}
