import {
  FOLLOW_THE_MONEY_SEALED,
  FOLLOW_THE_MONEY_STEP_LABEL,
  FOLLOW_THE_MONEY_UNSEALED,
} from '../../../app/constants/audit/followTheMoneyCopy'
import type { FinancialDataSealMap } from './parseFinancialDataSeals'

export interface FollowTheMoneyStep {
  kind: 'appropriation' | 'budget' | 'obligation' | 'disbursement'
  label: string
  amount: number
  date: string | null
  detail: string | null
  sealed: boolean
  sealedLabel: string
  recordId: string | null
}

export interface FollowTheMoneyTrail {
  steps: FollowTheMoneyStep[]
  appropriationTotal: number
  obligationTotal: number
  disbursementTotal: number
}

const toIso = (value?: Date | string | null): string | null => {
  if (!value) {
    return null
  }
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

/** Build a citizen-facing appropriation → obligation → disbursement trail. */
export const buildFollowTheMoneyTrail = (input: {
  appropriation: number
  budgets: Array<{
    id: string
    amount: number
    reason: string
    approvedDate?: Date | string | null
    createdAt?: Date | string | null
  }>
  obligations: Array<{
    id: string
    amount: number
    payee: string
    reason: string
    approvedDate?: Date | string | null
    createdAt?: Date | string | null
  }>
  disbursements: Array<{
    id: string
    amount: number
    payee: string
    reason: string
    approvedDate?: Date | string | null
    createdAt?: Date | string | null
  }>
  sealedFinancial?: FinancialDataSealMap | null
}): FollowTheMoneyTrail => {
  const sealed = input.sealedFinancial
  const steps: FollowTheMoneyStep[] = []

  const budgetExtra = input.budgets.reduce((sum, row) => sum + row.amount, 0)
  const appropriationTotal = input.appropriation + budgetExtra

  steps.push({
    kind: 'appropriation',
    label: FOLLOW_THE_MONEY_STEP_LABEL.APPROPRIATION,
    amount: input.appropriation,
    date: null,
    detail: 'Original project appropriation',
    sealed: true,
    sealedLabel: FOLLOW_THE_MONEY_SEALED,
    recordId: null,
  })

  for (const row of input.budgets) {
    const sealedRow = Boolean(sealed?.budgets?.[row.id])
    steps.push({
      kind: 'budget',
      label: FOLLOW_THE_MONEY_STEP_LABEL.ADDITIONAL_BUDGET,
      amount: row.amount,
      date: toIso(row.approvedDate || row.createdAt),
      detail: row.reason,
      sealed: sealedRow,
      sealedLabel: sealedRow ? FOLLOW_THE_MONEY_SEALED : FOLLOW_THE_MONEY_UNSEALED,
      recordId: row.id,
    })
  }

  for (const row of input.obligations) {
    const sealedRow = Boolean(sealed?.obligations?.[row.id])
    steps.push({
      kind: 'obligation',
      label: FOLLOW_THE_MONEY_STEP_LABEL.OBLIGATION,
      amount: row.amount,
      date: toIso(row.approvedDate || row.createdAt),
      detail: `${row.payee} — ${row.reason}`,
      sealed: sealedRow,
      sealedLabel: sealedRow ? FOLLOW_THE_MONEY_SEALED : FOLLOW_THE_MONEY_UNSEALED,
      recordId: row.id,
    })
  }

  for (const row of input.disbursements) {
    const sealedRow = Boolean(sealed?.disbursements?.[row.id])
    steps.push({
      kind: 'disbursement',
      label: FOLLOW_THE_MONEY_STEP_LABEL.DISBURSEMENT,
      amount: row.amount,
      date: toIso(row.approvedDate || row.createdAt),
      detail: `${row.payee} — ${row.reason}`,
      sealed: sealedRow,
      sealedLabel: sealedRow ? FOLLOW_THE_MONEY_SEALED : FOLLOW_THE_MONEY_UNSEALED,
      recordId: row.id,
    })
  }

  return {
    steps,
    appropriationTotal,
    obligationTotal: input.obligations.reduce((sum, row) => sum + row.amount, 0),
    disbursementTotal: input.disbursements.reduce((sum, row) => sum + row.amount, 0),
  }
}
