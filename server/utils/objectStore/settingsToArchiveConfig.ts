import type { IntegrityArchiveSettings } from '../../../app/constants/audit/integrityArchiveSettings'
import {
  INTEGRITY_ARCHIVE_PROVIDER,
  isIntegrityArchiveCloudProvider,
} from '../../../app/constants/audit/integrityArchiveProviders'
import {
  integrityArchiveSettingsAreComplete,
  resolveMongoArchiveUri,
  resolveVercelBlobToken,
} from '../settings/normalizeIntegrityArchiveSettings'
import type { IntegrityArchiveEnvConfig } from './resolveObjectStoreConfig'

const defaultEndpoint = (
  provider: IntegrityArchiveSettings['provider'],
  endpoint: string
): string | undefined => {
  if (endpoint) {
    return endpoint
  }
  if (provider === INTEGRITY_ARCHIVE_PROVIDER.GCS) {
    return 'https://storage.googleapis.com'
  }
  return undefined
}

const defaultRegion = (
  provider: IntegrityArchiveSettings['provider'],
  region: string
): string => {
  if (region) {
    return region
  }
  if (
    provider === INTEGRITY_ARCHIVE_PROVIDER.R2 ||
    provider === INTEGRITY_ARCHIVE_PROVIDER.GCS
  ) {
    return 'auto'
  }
  return 'us-east-1'
}

/** Map Superadmin/DB settings into the runtime archive config used by the object store. */
export const settingsToArchiveConfig = (
  settings: IntegrityArchiveSettings,
  env: NodeJS.ProcessEnv = process.env
): IntegrityArchiveEnvConfig => {
  if (!integrityArchiveSettingsAreComplete(settings, env)) {
    return {
      provider: INTEGRITY_ARCHIVE_PROVIDER.NONE,
      enabled: false,
      keyPrefix: settings.keyPrefix,
    }
  }

  if (settings.provider === INTEGRITY_ARCHIVE_PROVIDER.LOCAL) {
    return {
      provider: settings.provider,
      enabled: true,
      keyPrefix: settings.keyPrefix,
      localRootPath: settings.localRootPath,
    }
  }

  if (settings.provider === INTEGRITY_ARCHIVE_PROVIDER.MONGO) {
    return {
      provider: settings.provider,
      enabled: true,
      keyPrefix: settings.keyPrefix,
      mongoUri: resolveMongoArchiveUri(settings, env),
    }
  }

  if (settings.provider === INTEGRITY_ARCHIVE_PROVIDER.VERCEL_BLOB) {
    return {
      provider: settings.provider,
      enabled: true,
      keyPrefix: settings.keyPrefix,
      vercelBlobToken: resolveVercelBlobToken(settings, env),
    }
  }

  if (!isIntegrityArchiveCloudProvider(settings.provider)) {
    return {
      provider: INTEGRITY_ARCHIVE_PROVIDER.NONE,
      enabled: false,
      keyPrefix: settings.keyPrefix,
    }
  }

  return {
    provider: settings.provider,
    enabled: true,
    keyPrefix: settings.keyPrefix,
    s3: {
      bucket: settings.bucket,
      region: defaultRegion(settings.provider, settings.region),
      accessKeyId: settings.accessKeyId,
      secretAccessKey: settings.secretAccessKey,
      endpoint: defaultEndpoint(settings.provider, settings.endpoint),
      forcePathStyle:
        settings.forcePathStyle || settings.provider === INTEGRITY_ARCHIVE_PROVIDER.R2,
    },
  }
}
