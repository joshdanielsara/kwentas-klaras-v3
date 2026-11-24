import type { FinancialRecordPayload } from './financialRecordSnapshot'

export interface MoneyApprovalSealSource {
  id: string
  status: string
  requestId?: string | null
}

/**
 * Merge IntegrityApproval status/requestId onto a money payload for sealing.
 * Rows without approvalId stay unchanged (legacy-compatible empty approval fields).
 */
export const attachMoneyApprovalSealFields = (
  payload: FinancialRecordPayload,
  approvalById: Map<string, MoneyApprovalSealSource>
): FinancialRecordPayload => {
  const approvalId = payload.approvalId?.trim()
  if (!approvalId) {
    return payload
  }

  const approval = approvalById.get(approvalId)
  if (!approval) {
    return {
      ...payload,
      approvalId,
      approvalStatus: payload.approvalStatus ?? '',
      requestId: payload.requestId ?? '',
    }
  }

  return {
    ...payload,
    approvalId: approval.id,
    approvalStatus: approval.status,
    requestId: approval.requestId ?? '',
  }
}

export const collectMoneyApprovalIds = (
  rows: Array<{ approvalId?: string | null }>
): string[] => {
  const ids = new Set<string>()
  for (const row of rows) {
    const id = row.approvalId?.trim()
    if (id) {
      ids.add(id)
    }
  }
  return [...ids]
}
