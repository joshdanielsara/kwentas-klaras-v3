import type { ProjectIntegrityPayload } from './canonicalizeProject'

export type ProjectIntegritySnapshot = {
  appropriation: number
  code: string
  endDate: string
  id: string
  implementingUnit: string
  latitude: number | null
  location: string
  longitude: number | null
  name: string
  remarks: string
  services: string
  startDate: string
  year: number
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

/** Normalized project fields stored with a seal for later alteration display. */
export const toProjectIntegritySnapshot = (
  payload: ProjectIntegrityPayload
): ProjectIntegritySnapshot => {
  return {
    appropriation: payload.appropriation,
    code: payload.code ?? '',
    endDate: toIso(payload.endDate),
    id: payload.id,
    implementingUnit: payload.implementingUnit ?? '',
    latitude: payload.latitude ?? null,
    location: payload.location ?? '',
    longitude: payload.longitude ?? null,
    name: payload.name.trim(),
    remarks: payload.remarks ?? '',
    services: payload.services.trim(),
    startDate: toIso(payload.startDate),
    year: payload.year,
  }
}
