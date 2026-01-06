export interface LocationInfo {
  barangay: string | null
  municipality: string | null
  loading: boolean
  error: string | null
}

export interface GeotagMapOptions {
  projectId?: string
  locationName?: string | null
  initialLatitude?: number | null
  initialLongitude?: number | null
  onCoordinatesUpdate?: (lat: number | null, lng: number | null) => void
  onSaved?: (lat: number | null, lng: number | null) => void
}

