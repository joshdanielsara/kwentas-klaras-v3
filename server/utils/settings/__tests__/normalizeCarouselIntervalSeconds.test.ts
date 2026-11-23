import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { normalizeCarouselIntervalSeconds } from '../normalizeCarouselIntervalSeconds'
import {
  PUBLIC_CAROUSEL_INTERVAL_DEFAULT_SECONDS,
  PUBLIC_CAROUSEL_INTERVAL_MAX_SECONDS,
  PUBLIC_CAROUSEL_INTERVAL_MIN_SECONDS,
} from '../../../../app/constants/public/carouselSettings'

describe('normalizeCarouselIntervalSeconds', () => {
  it('defaults invalid values to 5 seconds', () => {
    assert.equal(normalizeCarouselIntervalSeconds(undefined), PUBLIC_CAROUSEL_INTERVAL_DEFAULT_SECONDS)
    assert.equal(normalizeCarouselIntervalSeconds('abc'), PUBLIC_CAROUSEL_INTERVAL_DEFAULT_SECONDS)
  })

  it('clamps below minimum and above maximum', () => {
    assert.equal(normalizeCarouselIntervalSeconds(1), PUBLIC_CAROUSEL_INTERVAL_MIN_SECONDS)
    assert.equal(normalizeCarouselIntervalSeconds(999), PUBLIC_CAROUSEL_INTERVAL_MAX_SECONDS)
  })

  it('accepts valid integer seconds', () => {
    assert.equal(normalizeCarouselIntervalSeconds('8'), 8)
    assert.equal(normalizeCarouselIntervalSeconds(12), 12)
  })
})
