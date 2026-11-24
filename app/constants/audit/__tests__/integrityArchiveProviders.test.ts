import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  INTEGRITY_ARCHIVE_PROVIDER,
  INTEGRITY_ARCHIVE_PROVIDERS,
  isIntegrityArchiveCloudProvider,
} from '../integrityArchiveProviders'
import { INTEGRITY_ARCHIVE_PROVIDER_OPTIONS } from '../integrityArchiveSettings'
import {
  integrityArchiveIncompleteMessage,
  integrityArchiveSaveSuccessMessage,
} from '../integrityArchiveMessages'

describe('integrityArchiveProviders', () => {
  it('includes mongo and vercel blob among selectable providers', () => {
    assert.ok(INTEGRITY_ARCHIVE_PROVIDERS.includes(INTEGRITY_ARCHIVE_PROVIDER.MONGO))
    assert.ok(INTEGRITY_ARCHIVE_PROVIDERS.includes(INTEGRITY_ARCHIVE_PROVIDER.VERCEL_BLOB))
    assert.equal(
      INTEGRITY_ARCHIVE_PROVIDER_OPTIONS[0]?.value,
      INTEGRITY_ARCHIVE_PROVIDER.MONGO
    )
    assert.equal(INTEGRITY_ARCHIVE_PROVIDER_OPTIONS[0]?.recommended, true)
  })

  it('treats only r2/s3/gcs as s3-family cloud providers', () => {
    assert.equal(isIntegrityArchiveCloudProvider(INTEGRITY_ARCHIVE_PROVIDER.MONGO), false)
    assert.equal(isIntegrityArchiveCloudProvider(INTEGRITY_ARCHIVE_PROVIDER.VERCEL_BLOB), false)
    assert.equal(isIntegrityArchiveCloudProvider(INTEGRITY_ARCHIVE_PROVIDER.R2), true)
  })

  it('returns provider-specific incomplete and success copy', () => {
    assert.match(
      integrityArchiveIncompleteMessage(INTEGRITY_ARCHIVE_PROVIDER.MONGO),
      /INTEGRITY_ARCHIVE_MONGODB_URI/i
    )
    assert.match(
      integrityArchiveIncompleteMessage(INTEGRITY_ARCHIVE_PROVIDER.VERCEL_BLOB),
      /BLOB/i
    )
    assert.match(
      integrityArchiveSaveSuccessMessage(INTEGRITY_ARCHIVE_PROVIDER.MONGO),
      /Mongo/i
    )
  })
})
