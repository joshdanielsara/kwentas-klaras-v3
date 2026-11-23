import { toProjectIntegritySnapshot } from './projectIntegritySnapshot'

export interface ProjectIntegrityPayload {
  id: string
  name: string
  implementingUnit?: string | null
  location?: string | null
  appropriation: number
  year: number
  services: string
  remarks?: string | null
  code?: string | null
  startDate?: string | Date | null
  endDate?: string | Date | null
  latitude?: number | null
  longitude?: number | null
}

/** Stable JSON for hashing government project master data. */
export const canonicalizeProject = (payload: ProjectIntegrityPayload): string => {
  return JSON.stringify(toProjectIntegritySnapshot(payload))
}
