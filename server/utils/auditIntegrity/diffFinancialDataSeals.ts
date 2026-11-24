import {
  INTEGRITY_FINANCIAL_FIELD_LABEL,
  type IntegrityFinancialFieldKey,
} from '../../../app/constants/audit/integrityFinancialFieldLabels'
import {
  INTEGRITY_FINANCIAL_KIND_LABEL,
  INTEGRITY_FINANCIAL_KIND_ORDER,
  type IntegrityFinancialKind,
} from '../../../app/constants/audit/integrityFinancialKinds'
import type { FinancialRecordSnapshot } from './financialRecordSnapshot'
import { hashFinancialRecordSnapshot } from './hashFinancialRecord'
import {
  financialKindMapKey,
  type FinancialDataSealMap,
  type FinancialKindSealMap,
} from './parseFinancialDataSeals'
import type { ProjectIntegrityAlteration } from './diffProjectIntegritySnapshots'

const formatValue = (value: string | number | null): string => {
  if (value === null || value === '') {
    return '(empty)'
  }
  if (typeof value === 'number') {
    return Number.isInteger(value)
      ? value.toLocaleString('en-PH')
      : value.toLocaleString('en-PH', { maximumFractionDigits: 6 })
  }
  return String(value)
}

const recordLabel = (kind: IntegrityFinancialKind, snapshot?: FinancialRecordSnapshot): string => {
  const kindLabel = INTEGRITY_FINANCIAL_KIND_LABEL[kind]
  if (!snapshot) {
    return kindLabel
  }
  const payee = snapshot.payee ? ` · ${snapshot.payee}` : ''
  return `${kindLabel}${payee}`
}

const diffSnapshots = (
  kind: IntegrityFinancialKind,
  sealed: FinancialRecordSnapshot,
  current: FinancialRecordSnapshot
): ProjectIntegrityAlteration[] => {
  const fields = Object.keys(INTEGRITY_FINANCIAL_FIELD_LABEL) as IntegrityFinancialFieldKey[]
  const alterations: ProjectIntegrityAlteration[] = []
  const base = recordLabel(kind, sealed)

  for (const field of fields) {
    if (kind === 'budget' && field === 'payee') {
      continue
    }
    const sealedRaw = sealed[field]
    const currentRaw = current[field]
    if (sealedRaw === currentRaw) {
      continue
    }
    alterations.push({
      field: `${kind}.${sealed.id}.${field}`,
      label: `${base} · ${INTEGRITY_FINANCIAL_FIELD_LABEL[field]}`,
      sealedValue: formatValue(sealedRaw),
      currentValue: formatValue(currentRaw),
    })
  }

  return alterations
}

const compareKind = (
  kind: IntegrityFinancialKind,
  sealedMap: FinancialKindSealMap,
  currentMap: FinancialKindSealMap
): { match: boolean; alterations: ProjectIntegrityAlteration[] } => {
  const alterations: ProjectIntegrityAlteration[] = []
  const sealedIds = new Set(Object.keys(sealedMap))
  const currentIds = new Set(Object.keys(currentMap))

  for (const id of sealedIds) {
    if (!currentIds.has(id)) {
      alterations.push({
        field: `${kind}.${id}.removed`,
        label: `${recordLabel(kind, sealedMap[id].snapshot)} removed`,
        sealedValue: sealedMap[id].snapshot
          ? formatValue(sealedMap[id].snapshot!.amount)
          : sealedMap[id].hash.slice(0, 12),
        currentValue: '(missing)',
      })
      continue
    }
    const sealedEntry = sealedMap[id]
    const currentEntry = currentMap[id]
    if (sealedEntry.hash === currentEntry.hash) {
      continue
    }
    if (sealedEntry.snapshot && currentEntry.snapshot) {
      alterations.push(...diffSnapshots(kind, sealedEntry.snapshot, currentEntry.snapshot))
    } else {
      alterations.push({
        field: `${kind}.${id}.hash`,
        label: `${recordLabel(kind, sealedEntry.snapshot)} altered`,
        sealedValue: sealedEntry.hash.slice(0, 12) + '…',
        currentValue: currentEntry.hash.slice(0, 12) + '…',
      })
    }
  }

  for (const id of currentIds) {
    if (sealedIds.has(id)) {
      continue
    }
    alterations.push({
      field: `${kind}.${id}.added`,
      label: `${recordLabel(kind, currentMap[id].snapshot)} added after seal`,
      sealedValue: '(not sealed)',
      currentValue: currentMap[id].snapshot
        ? formatValue(currentMap[id].snapshot!.amount)
        : currentMap[id].hash.slice(0, 12),
    })
  }

  return { match: alterations.length === 0, alterations }
}

/**
 * Compare sealed vs current financial seal maps for one project.
 * Empty sealed map → null match (legacy batches without money leaves).
 */
export const diffFinancialDataSeals = (
  sealed: FinancialDataSealMap,
  current: FinancialDataSealMap
): { match: boolean | null; alterations: ProjectIntegrityAlteration[] } => {
  const sealedCount =
    Object.keys(sealed.budgets).length +
    Object.keys(sealed.obligations).length +
    Object.keys(sealed.disbursements).length

  if (sealedCount === 0) {
    return { match: null, alterations: [] }
  }

  const alterations: ProjectIntegrityAlteration[] = []
  let match = true

  for (const kind of INTEGRITY_FINANCIAL_KIND_ORDER) {
    const key = financialKindMapKey(kind)
    const result = compareKind(kind, sealed[key], current[key])
    if (!result.match) {
      match = false
    }
    alterations.push(...result.alterations)
  }

  return { match, alterations }
}

/** Hash helper used when building current map outside seal builder. */
export const hashFromSnapshot = hashFinancialRecordSnapshot
