import { INTEGRITY_ARCHIVE_PROVIDER } from '../../../app/constants/audit/integrityArchiveProviders'
import type { IObjectStore } from './IObjectStore'
import { LocalObjectStore } from './localObjectStore'
import { MongoObjectStore } from './mongoObjectStore'
import {
  resolveIntegrityArchiveEnvConfig,
  type IntegrityArchiveEnvConfig,
} from './resolveObjectStoreConfig'
import { S3CompatibleObjectStore } from './s3CompatibleObjectStore'
import { VercelBlobObjectStore } from './vercelBlobObjectStore'

/** Build an object store for the configured provider, or null when disabled. */
export const createIntegrityObjectStore = (
  config: IntegrityArchiveEnvConfig = resolveIntegrityArchiveEnvConfig()
): IObjectStore | null => {
  if (!config.enabled) {
    return null
  }

  if (config.provider === INTEGRITY_ARCHIVE_PROVIDER.LOCAL) {
    if (!config.localRootPath) {
      return null
    }
    return new LocalObjectStore({ rootPath: config.localRootPath })
  }

  if (config.provider === INTEGRITY_ARCHIVE_PROVIDER.MONGO) {
    if (!config.mongoUri) {
      return null
    }
    return new MongoObjectStore({ uri: config.mongoUri })
  }

  if (config.provider === INTEGRITY_ARCHIVE_PROVIDER.VERCEL_BLOB) {
    if (!config.vercelBlobToken) {
      return null
    }
    return new VercelBlobObjectStore({ token: config.vercelBlobToken })
  }

  if (!config.s3) {
    return null
  }

  if (
    config.provider === INTEGRITY_ARCHIVE_PROVIDER.R2 ||
    config.provider === INTEGRITY_ARCHIVE_PROVIDER.S3 ||
    config.provider === INTEGRITY_ARCHIVE_PROVIDER.GCS
  ) {
    return new S3CompatibleObjectStore(config.s3)
  }

  return null
}
