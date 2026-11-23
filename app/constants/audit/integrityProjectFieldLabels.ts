/** Friendly labels for sealed project fields shown when a check fails. */
export const INTEGRITY_PROJECT_FIELD_LABEL = {
  appropriation: 'Budget / appropriation',
  code: 'Project code',
  endDate: 'End date',
  id: 'Project ID',
  implementingUnit: 'Implementing unit',
  latitude: 'Latitude',
  location: 'Location',
  longitude: 'Longitude',
  name: 'Project name',
  remarks: 'Remarks',
  services: 'Services',
  startDate: 'Start date',
  year: 'Year',
} as const

export type IntegrityProjectFieldKey = keyof typeof INTEGRITY_PROJECT_FIELD_LABEL
