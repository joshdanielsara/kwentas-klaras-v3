import {
  INTEGRITY_FINANCIAL_KIND,
  INTEGRITY_FINANCIAL_KIND_ORDER,
  type IntegrityFinancialKind,
} from '../../../app/constants/audit/integrityFinancialKinds'
import type { FinancialRecordSnapshot } from './financialRecordSnapshot'

export interface FinancialSealEntry {
  hash: string
  snapshot?: FinancialRecordSnapshot
}

export type FinancialKindSealMap = Record<string, FinancialSealEntry>

export type FinancialDataSealMap = {
  budgets: FinancialKindSealMap
  obligations: FinancialKindSealMap
  disbursements: FinancialKindSealMap
}

const emptyMap = (): FinancialDataSealMap => ({
  budgets: {},
  obligations: {},
  disbursements: {},
})

const isSnapshot = (value: unknown): value is FinancialRecordSnapshot => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }
  const record = value as Record<string, unknown>
  return (
    typeof record.id === 'string' &&
    typeof record.projectId === 'string' &&
    typeof record.amount === 'number' &&
    typeof record.kind === 'string'
  )
}

const parseKindMap = (raw: unknown): FinancialKindSealMap => {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {}
  }
  const result: FinancialKindSealMap = {}
  for (const [id, value] of Object.entries(raw)) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      continue
    }
    const entry = value as { hash?: unknown; snapshot?: unknown }
    if (typeof entry.hash === 'string' && entry.hash.length > 0) {
      result[id] = {
        hash: entry.hash,
        snapshot: isSnapshot(entry.snapshot) ? entry.snapshot : undefined,
      }
    }
  }
  return result
}

export const parseFinancialDataSealMap = (raw?: string | null): FinancialDataSealMap => {
  if (!raw) {
    return emptyMap()
  }
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return emptyMap()
    }
    const record = parsed as Record<string, unknown>
    return {
      budgets: parseKindMap(record.budgets),
      obligations: parseKindMap(record.obligations),
      disbursements: parseKindMap(record.disbursements),
    }
  } catch {
    return emptyMap()
  }
}

export const serializeFinancialDataSealMap = (map: FinancialDataSealMap): string => {
  const sortKind = (kindMap: FinancialKindSealMap): FinancialKindSealMap => {
    const ordered: FinancialKindSealMap = {}
    for (const id of Object.keys(kindMap).sort()) {
      ordered[id] = kindMap[id]
    }
    return ordered
  }
  return JSON.stringify({
    budgets: sortKind(map.budgets),
    obligations: sortKind(map.obligations),
    disbursements: sortKind(map.disbursements),
  })
}

const kindKey = (kind: IntegrityFinancialKind): keyof FinancialDataSealMap => {
  if (kind === INTEGRITY_FINANCIAL_KIND.BUDGET) {
    return 'budgets'
  }
  if (kind === INTEGRITY_FINANCIAL_KIND.OBLIGATION) {
    return 'obligations'
  }
  return 'disbursements'
}

/** Financial leaves append after project leaves: kind order, then id. */
export const financialDataSealsToLeafList = (map: FinancialDataSealMap): string[] => {
  const leaves: string[] = []
  for (const kind of INTEGRITY_FINANCIAL_KIND_ORDER) {
    const kindMap = map[kindKey(kind)]
    for (const id of Object.keys(kindMap).sort()) {
      leaves.push(kindMap[id].hash)
    }
  }
  return leaves
}

export const filterFinancialSealsForProject = (
  map: FinancialDataSealMap,
  projectId: string
): FinancialDataSealMap => {
  const filterKind = (kindMap: FinancialKindSealMap): FinancialKindSealMap => {
    const next: FinancialKindSealMap = {}
    for (const [id, entry] of Object.entries(kindMap)) {
      if (entry.snapshot?.projectId === projectId) {
        next[id] = entry
      }
    }
    return next
  }
  return {
    budgets: filterKind(map.budgets),
    obligations: filterKind(map.obligations),
    disbursements: filterKind(map.disbursements),
  }
}

export { kindKey as financialKindMapKey }
