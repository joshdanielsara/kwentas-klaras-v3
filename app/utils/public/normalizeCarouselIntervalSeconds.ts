import {
  PUBLIC_CAROUSEL_INTERVAL_DEFAULT_SECONDS,
  PUBLIC_CAROUSEL_INTERVAL_MAX_SECONDS,
  PUBLIC_CAROUSEL_INTERVAL_MIN_SECONDS,
} from '../../constants/public/carouselSettings'

export const normalizeCarouselIntervalSeconds = (raw: unknown): number => {
  const parsed =
    typeof raw === 'number'
      ? raw
      : typeof raw === 'string'
        ? Number.parseInt(raw, 10)
        : Number.NaN

  if (!Number.isFinite(parsed)) {
    return PUBLIC_CAROUSEL_INTERVAL_DEFAULT_SECONDS
  }

  const rounded = Math.round(parsed)
  if (rounded < PUBLIC_CAROUSEL_INTERVAL_MIN_SECONDS) {
    return PUBLIC_CAROUSEL_INTERVAL_MIN_SECONDS
  }
  if (rounded > PUBLIC_CAROUSEL_INTERVAL_MAX_SECONDS) {
    return PUBLIC_CAROUSEL_INTERVAL_MAX_SECONDS
  }
  return rounded
}
