import {
  INTEGRITY_ARCHIVE_KEY_PREFIX_DEFAULT,
  INTEGRITY_ARCHIVE_LOCAL_ROOT_DEFAULT,
  INTEGRITY_ARCHIVE_PROVIDER,
  type IntegrityArchiveProvider,
} from './integrityArchiveProviders'

export const APP_SETTING_KEY_INTEGRITY_ARCHIVE = 'integrity_archive_config'

export const INTEGRITY_ARCHIVE_SECRET_MASK = '********'

export interface IntegrityArchiveSettings {
  provider: IntegrityArchiveProvider
  /** Absolute or process-relative directory for Local disk provider. */
  localRootPath: string
  /** Separate Mongo URI for archive cluster (masked on GET). */
  mongoUri: string
  /** Vercel Blob read/write token (masked on GET). */
  vercelBlobToken: string
  bucket: string
  accessKeyId: string
  secretAccessKey: string
  endpoint: string
  region: string
  keyPrefix: string
  forcePathStyle: boolean
}

export const INTEGRITY_ARCHIVE_SETTINGS_DEFAULT: IntegrityArchiveSettings = {
  provider: INTEGRITY_ARCHIVE_PROVIDER.NONE,
  localRootPath: INTEGRITY_ARCHIVE_LOCAL_ROOT_DEFAULT,
  mongoUri: '',
  vercelBlobToken: '',
  bucket: '',
  accessKeyId: '',
  secretAccessKey: '',
  endpoint: '',
  region: '',
  keyPrefix: INTEGRITY_ARCHIVE_KEY_PREFIX_DEFAULT,
  forcePathStyle: false,
}

export const INTEGRITY_ARCHIVE_PROVIDER_OPTIONS: Array<{
  value: IntegrityArchiveProvider
  label: string
  help: string
  recommended?: boolean
}> = [
  {
    value: INTEGRITY_ARCHIVE_PROVIDER.MONGO,
    label: 'MongoDB (second cluster)',
    help: 'Copy seal evidence into a separate Atlas cluster (e.g. integrity_archive). Best default on Vercel.',
    recommended: true,
  },
  {
    value: INTEGRITY_ARCHIVE_PROVIDER.VERCEL_BLOB,
    label: 'Vercel Blob',
    help: 'Store evidence in Vercel Blob. Uses BLOB_READ_WRITE_TOKEN or a token saved here.',
  },
  {
    value: INTEGRITY_ARCHIVE_PROVIDER.R2,
    label: 'Cloudflare R2',
    help: 'S3-compatible. Requires account endpoint, e.g. https://<accountid>.r2.cloudflarestorage.com',
  },
  {
    value: INTEGRITY_ARCHIVE_PROVIDER.S3,
    label: 'Amazon S3',
    help: 'AWS S3 or any S3-compatible endpoint.',
  },
  {
    value: INTEGRITY_ARCHIVE_PROVIDER.GCS,
    label: 'Google Cloud Storage',
    help: 'Use GCS S3 interoperability HMAC keys. Default endpoint https://storage.googleapis.com',
  },
  {
    value: INTEGRITY_ARCHIVE_PROVIDER.LOCAL,
    label: 'Local disk',
    help: 'Folder on this server. Works for on-prem hosts — not durable on Vercel serverless.',
  },
  {
    value: INTEGRITY_ARCHIVE_PROVIDER.NONE,
    label: 'Disabled',
    help: 'Do not copy seal evidence outside the main app database.',
  },
]
