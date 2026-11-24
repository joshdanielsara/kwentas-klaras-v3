import type { IntegrityFinancialKind } from '../../../app/constants/audit/integrityFinancialKinds'

export interface FinancialRecordSnapshot {
  amount: number
  approvalId: string
  approvalStatus: string
  approvedBy: string
  approvedDate: string
  id: string
  kind: IntegrityFinancialKind
  payee: string
  projectId: string
  reason: string
  requestId: string
  status: string
}

export interface FinancialRecordPayload {
  id: string
  projectId: string
  amount: number
  reason: string
  status: string
  approvedBy?: string | null
  approvedDate?: string | Date | null
  payee?: string | null
  approvalId?: string | null
  approvalStatus?: string | null
  requestId?: string | null
}

const toIso = (value?: string | Date | null): string => {
  if (!value) {
    return ''
  }
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  return date.toISOString()
}

export const toFinancialRecordSnapshot = (
  kind: IntegrityFinancialKind,
  payload: FinancialRecordPayload
): FinancialRecordSnapshot => {
  return {
    amount: payload.amount,
    approvalId: payload.approvalId ?? '',
    approvalStatus: payload.approvalStatus ?? '',
    approvedBy: payload.approvedBy ?? '',
    approvedDate: toIso(payload.approvedDate),
    id: payload.id,
    kind,
    payee: payload.payee ?? '',
    projectId: payload.projectId,
    reason: payload.reason.trim(),
    requestId: payload.requestId ?? '',
    status: payload.status.trim(),
  }
}
