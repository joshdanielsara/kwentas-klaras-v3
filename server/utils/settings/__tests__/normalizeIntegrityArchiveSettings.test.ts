import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  INTEGRITY_ARCHIVE_SECRET_MASK,
  INTEGRITY_ARCHIVE_SETTINGS_DEFAULT,
} from '../../../../app/constants/audit/integrityArchiveSettings'
import { INTEGRITY_ARCHIVE_PROVIDER } from '../../../../app/constants/audit/integrityArchiveProviders'
import {
  integrityArchiveSettingsAreComplete,
  mergeIntegrityArchiveSettings,
  normalizeIntegrityArchiveSettings,
  toPublicIntegrityArchiveSettings,
} from '../normalizeIntegrityArchiveSettings'

describe('normalizeIntegrityArchiveSettings', () => {
  it('normalizes r2 settings and forces path style', () => {
    const settings = normalizeIntegrityArchiveSettings({
      provider: 'r2',
      bucket: ' seals ',
      accessKeyId: 'key',
      secretAccessKey: 'secret',
      endpoint: 'https://abc.r2.cloudflarestorage.com',
      keyPrefix: 'evidence',
    })
    assert.equal(settings.provider, INTEGRITY_ARCHIVE_PROVIDER.R2)
    assert.equal(settings.bucket, 'seals')
    assert.equal(settings.keyPrefix, 'evidence/')
    assert.equal(settings.forcePathStyle, true)
  })

  it('keeps existing secret when mask or empty is sent', () => {
    const existing = {
      ...INTEGRITY_ARCHIVE_SETTINGS_DEFAULT,
      provider: INTEGRITY_ARCHIVE_PROVIDER.S3,
      bucket: 'b',
      accessKeyId: 'a',
      secretAccessKey: 'real-secret',
    }
    const merged = mergeIntegrityArchiveSettings(existing, {
      ...existing,
      secretAccessKey: INTEGRITY_ARCHIVE_SECRET_MASK,
    })
    assert.equal(merged.secretAccessKey, 'real-secret')
  })

  it('masks secret for public responses', () => {
    const publicSettings = toPublicIntegrityArchiveSettings({
      ...INTEGRITY_ARCHIVE_SETTINGS_DEFAULT,
      provider: INTEGRITY_ARCHIVE_PROVIDER.GCS,
      bucket: 'b',
      accessKeyId: 'a',
      secretAccessKey: 'hidden',
    })
    assert.equal(publicSettings.secretAccessKey, INTEGRITY_ARCHIVE_SECRET_MASK)
    assert.equal(publicSettings.secretConfigured, true)
  })

  it('requires endpoint for complete r2 settings', () => {
    assert.equal(
      integrityArchiveSettingsAreComplete({
        ...INTEGRITY_ARCHIVE_SETTINGS_DEFAULT,
        provider: INTEGRITY_ARCHIVE_PROVIDER.R2,
        bucket: 'b',
        accessKeyId: 'a',
        secretAccessKey: 's',
        endpoint: '',
      }),
      false
    )
    assert.equal(
      integrityArchiveSettingsAreComplete({
        ...INTEGRITY_ARCHIVE_SETTINGS_DEFAULT,
        provider: INTEGRITY_ARCHIVE_PROVIDER.R2,
        bucket: 'b',
        accessKeyId: 'a',
        secretAccessKey: 's',
        endpoint: 'https://abc.r2.cloudflarestorage.com',
      }),
      true
    )
  })

  it('treats local disk as complete when a root path is set', () => {
    assert.equal(
      integrityArchiveSettingsAreComplete({
        ...INTEGRITY_ARCHIVE_SETTINGS_DEFAULT,
        provider: INTEGRITY_ARCHIVE_PROVIDER.LOCAL,
        localRootPath: 'storage/integrity-evidence',
      }),
      true
    )
    assert.equal(
      integrityArchiveSettingsAreComplete({
        ...INTEGRITY_ARCHIVE_SETTINGS_DEFAULT,
        provider: INTEGRITY_ARCHIVE_PROVIDER.LOCAL,
        localRootPath: '',
      }),
      false
    )
  })

  it('defaults localRootPath when normalizing', () => {
    const settings = normalizeIntegrityArchiveSettings({
      provider: 'local',
    })
    assert.equal(settings.provider, INTEGRITY_ARCHIVE_PROVIDER.LOCAL)
    assert.ok(settings.localRootPath.length > 0)
  })

  it('accepts mongo when URI is in env even if settings URI is empty', () => {
    assert.equal(
      integrityArchiveSettingsAreComplete(
        {
          ...INTEGRITY_ARCHIVE_SETTINGS_DEFAULT,
          provider: INTEGRITY_ARCHIVE_PROVIDER.MONGO,
          mongoUri: '',
        },
        { INTEGRITY_ARCHIVE_MONGODB_URI: 'mongodb+srv://u:p@host/integrity_archive' }
      ),
      true
    )
  })

  it('accepts vercel_blob when token is in env', () => {
    assert.equal(
      integrityArchiveSettingsAreComplete(
        {
          ...INTEGRITY_ARCHIVE_SETTINGS_DEFAULT,
          provider: INTEGRITY_ARCHIVE_PROVIDER.VERCEL_BLOB,
          vercelBlobToken: '',
        },
        { BLOB_READ_WRITE_TOKEN: 'vercel_blob_rw_test' }
      ),
      true
    )
  })
})
