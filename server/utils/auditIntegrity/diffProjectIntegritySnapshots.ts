import {
  INTEGRITY_PROJECT_FIELD_LABEL,
  type IntegrityProjectFieldKey,
} from '../../../app/constants/audit/integrityProjectFieldLabels'
import type { ProjectIntegritySnapshot } from './projectIntegritySnapshot'

export interface ProjectIntegrityAlteration {
  /** Project field key or financial path like `obligation.<id>.amount`. */
  field: string
  label: string
  sealedValue: string
  currentValue: string
}

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

/** Compare sealed vs current project snapshot; skip id (identity only). */
export const diffProjectIntegritySnapshots = (
  sealed: ProjectIntegritySnapshot,
  current: ProjectIntegritySnapshot
): ProjectIntegrityAlteration[] => {
  const fields = Object.keys(INTEGRITY_PROJECT_FIELD_LABEL) as IntegrityProjectFieldKey[]
  const alterations: ProjectIntegrityAlteration[] = []

  for (const field of fields) {
    if (field === 'id') {
      continue
    }
    const sealedRaw = sealed[field]
    const currentRaw = current[field]
    if (sealedRaw === currentRaw) {
      continue
    }
    alterations.push({
      field,
      label: INTEGRITY_PROJECT_FIELD_LABEL[field],
      sealedValue: formatValue(sealedRaw),
      currentValue: formatValue(currentRaw),
    })
  }

  return alterations
}
