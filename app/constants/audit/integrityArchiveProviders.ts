export const INTEGRITY_ARCHIVE_PROVIDER = {
  NONE: 'none',
  LOCAL: 'local',
  MONGO: 'mongo',
  VERCEL_BLOB: 'vercel_blob',
  R2: 'r2',
  S3: 's3',
  GCS: 'gcs',
} as const

export type IntegrityArchiveProvider =
  (typeof INTEGRITY_ARCHIVE_PROVIDER)[keyof typeof INTEGRITY_ARCHIVE_PROVIDER]

export const INTEGRITY_ARCHIVE_PROVIDERS: IntegrityArchiveProvider[] = [
  INTEGRITY_ARCHIVE_PROVIDER.MONGO,
  INTEGRITY_ARCHIVE_PROVIDER.VERCEL_BLOB,
  INTEGRITY_ARCHIVE_PROVIDER.R2,
  INTEGRITY_ARCHIVE_PROVIDER.S3,
  INTEGRITY_ARCHIVE_PROVIDER.GCS,
  INTEGRITY_ARCHIVE_PROVIDER.LOCAL,
  INTEGRITY_ARCHIVE_PROVIDER.NONE,
]

/** Default object key prefix inside the bucket, blob store, or local root. */
export const INTEGRITY_ARCHIVE_KEY_PREFIX_DEFAULT = 'integrity-evidence/'

/** Default on-server folder when Superadmin chooses Local disk. */
export const INTEGRITY_ARCHIVE_LOCAL_ROOT_DEFAULT = 'storage/integrity-evidence'

/** Collection used by the Mongo archive provider. */
export const INTEGRITY_ARCHIVE_MONGO_COLLECTION = 'seal_evidence'

export const INTEGRITY_EVIDENCE_MANIFEST_VERSION = 1

export const INTEGRITY_EVIDENCE_MANIFEST_FILENAME = 'manifest.json'
export const INTEGRITY_EVIDENCE_PROOF_FILENAME = 'proof.ots'

export const INTEGRITY_ARCHIVE_CLOUD_PROVIDERS: IntegrityArchiveProvider[] = [
  INTEGRITY_ARCHIVE_PROVIDER.R2,
  INTEGRITY_ARCHIVE_PROVIDER.S3,
  INTEGRITY_ARCHIVE_PROVIDER.GCS,
]

export const isIntegrityArchiveCloudProvider = (
  provider: IntegrityArchiveProvider
): boolean => INTEGRITY_ARCHIVE_CLOUD_PROVIDERS.includes(provider)

export const isIntegrityArchiveS3FamilyProvider = isIntegrityArchiveCloudProvider
