import { INTEGRITY_ARCHIVE_PROVIDER } from './integrityArchiveProviders'
import type { IntegrityArchiveProvider } from './integrityArchiveProviders'

export const INTEGRITY_ARCHIVE_INCOMPLETE_LOCAL =
  'Local disk archive requires a directory path on this server'

export const INTEGRITY_ARCHIVE_INCOMPLETE_MONGO =
  'Mongo archive requires INTEGRITY_ARCHIVE_MONGODB_URI (env) or a Mongo URI saved here'

export const INTEGRITY_ARCHIVE_INCOMPLETE_VERCEL_BLOB =
  'Vercel Blob requires BLOB_READ_WRITE_TOKEN (env) or a token saved here'

export const INTEGRITY_ARCHIVE_INCOMPLETE_R2 =
  'Cloudflare R2 requires bucket, access key, secret, and endpoint URL'

export const INTEGRITY_ARCHIVE_INCOMPLETE_CLOUD =
  'Bucket, access key, and secret are required when a cloud archive is enabled'

export const INTEGRITY_ARCHIVE_SAVE_DISABLED = 'Integrity archive disabled.'

export const integrityArchiveIncompleteMessage = (
  provider: IntegrityArchiveProvider
): string => {
  if (provider === INTEGRITY_ARCHIVE_PROVIDER.LOCAL) {
    return INTEGRITY_ARCHIVE_INCOMPLETE_LOCAL
  }
  if (provider === INTEGRITY_ARCHIVE_PROVIDER.MONGO) {
    return INTEGRITY_ARCHIVE_INCOMPLETE_MONGO
  }
  if (provider === INTEGRITY_ARCHIVE_PROVIDER.VERCEL_BLOB) {
    return INTEGRITY_ARCHIVE_INCOMPLETE_VERCEL_BLOB
  }
  if (provider === INTEGRITY_ARCHIVE_PROVIDER.R2) {
    return INTEGRITY_ARCHIVE_INCOMPLETE_R2
  }
  return INTEGRITY_ARCHIVE_INCOMPLETE_CLOUD
}

export const integrityArchiveSaveSuccessMessage = (
  provider: IntegrityArchiveProvider
): string => {
  if (provider === INTEGRITY_ARCHIVE_PROVIDER.NONE) {
    return INTEGRITY_ARCHIVE_SAVE_DISABLED
  }
  if (provider === INTEGRITY_ARCHIVE_PROVIDER.LOCAL) {
    return 'Integrity archive saved (local disk). New seals will copy evidence to the configured folder.'
  }
  if (provider === INTEGRITY_ARCHIVE_PROVIDER.MONGO) {
    return 'Integrity archive saved (Mongo second cluster). New seals will copy evidence there.'
  }
  if (provider === INTEGRITY_ARCHIVE_PROVIDER.VERCEL_BLOB) {
    return 'Integrity archive saved (Vercel Blob). New seals will copy evidence to Blob storage.'
  }
  return `Integrity archive saved (${provider}). New seals will copy evidence to the bucket.`
}
