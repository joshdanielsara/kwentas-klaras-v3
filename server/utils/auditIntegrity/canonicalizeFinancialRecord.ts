import type { FinancialRecordSnapshot } from './financialRecordSnapshot'

/**
 * Stable JSON for hashing a sealed money row.
 * Approval binding fields are included only when present so legacy seals
 * (without approvalId) keep the same digest.
 */
export const canonicalizeFinancialRecord = (snapshot: FinancialRecordSnapshot): string => {
  const base = {
    amount: snapshot.amount,
    approvedBy: snapshot.approvedBy,
    approvedDate: snapshot.approvedDate,
    id: snapshot.id,
    kind: snapshot.kind,
    payee: snapshot.payee,
    projectId: snapshot.projectId,
    reason: snapshot.reason,
    status: snapshot.status,
  }

  if (snapshot.approvalId || snapshot.approvalStatus || snapshot.requestId) {
    return JSON.stringify({
      ...base,
      approvalId: snapshot.approvalId,
      approvalStatus: snapshot.approvalStatus,
      requestId: snapshot.requestId,
    })
  }

  return JSON.stringify(base)
}
