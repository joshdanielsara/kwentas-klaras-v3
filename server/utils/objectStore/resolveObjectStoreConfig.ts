import {
  INTEGRITY_ARCHIVE_PROVIDER,
  type IntegrityArchiveProvider,
  INTEGRITY_ARCHIVE_PROVIDERS,
  INTEGRITY_ARCHIVE_KEY_PREFIX_DEFAULT,
  INTEGRITY_ARCHIVE_LOCAL_ROOT_DEFAULT,
  isIntegrityArchiveCloudProvider,
} from '../../../app/constants/audit/integrityArchiveProviders'
import type { S3CompatibleObjectStoreConfig } from './s3CompatibleObjectStore'

export interface IntegrityArchiveEnvConfig {
  provider: IntegrityArchiveProvider
  enabled: boolean
  keyPrefix: string
  localRootPath?: string
  mongoUri?: string
  vercelBlobToken?: string
  s3?: S3CompatibleObjectStoreConfig
}

const normalizeProvider = (raw?: string | null): IntegrityArchiveProvider => {
  const value = (raw || INTEGRITY_ARCHIVE_PROVIDER.NONE).trim().toLowerCase()
  if (INTEGRITY_ARCHIVE_PROVIDERS.includes(value as IntegrityArchiveProvider)) {
    return value as IntegrityArchiveProvider
  }
  return INTEGRITY_ARCHIVE_PROVIDER.NONE
}

const normalizePrefix = (raw?: string | null): string => {
  const prefix = (raw || INTEGRITY_ARCHIVE_KEY_PREFIX_DEFAULT).trim()
  if (!prefix) {
    return INTEGRITY_ARCHIVE_KEY_PREFIX_DEFAULT
  }
  return prefix.endsWith('/') ? prefix : `${prefix}/`
}

const defaultEndpointForProvider = (
  provider: IntegrityArchiveProvider,
  endpoint?: string | null
): string | undefined => {
  if (endpoint && endpoint.trim()) {
    return endpoint.trim()
  }
  if (provider === INTEGRITY_ARCHIVE_PROVIDER.GCS) {
    return 'https://storage.googleapis.com'
  }
  return undefined
}

const defaultRegionForProvider = (
  provider: IntegrityArchiveProvider,
  region?: string | null
): string => {
  if (region && region.trim()) {
    return region.trim()
  }
  if (
    provider === INTEGRITY_ARCHIVE_PROVIDER.R2 ||
    provider === INTEGRITY_ARCHIVE_PROVIDER.GCS
  ) {
    return 'auto'
  }
  return 'us-east-1'
}

/**
 * Resolve archive settings from env.
 * Supports local disk, Mongo second cluster, Vercel Blob, and S3-family clouds.
 */
export const resolveIntegrityArchiveEnvConfig = (
  env: NodeJS.ProcessEnv = process.env
): IntegrityArchiveEnvConfig => {
  const provider = normalizeProvider(env.INTEGRITY_ARCHIVE_PROVIDER)
  const keyPrefix = normalizePrefix(env.INTEGRITY_ARCHIVE_KEY_PREFIX)

  if (provider === INTEGRITY_ARCHIVE_PROVIDER.NONE) {
    return { provider, enabled: false, keyPrefix }
  }

  if (provider === INTEGRITY_ARCHIVE_PROVIDER.LOCAL) {
    const localRootPath = (
      env.INTEGRITY_ARCHIVE_LOCAL_ROOT || INTEGRITY_ARCHIVE_LOCAL_ROOT_DEFAULT
    ).trim()
    if (!localRootPath) {
      console.warn('[resolveIntegrityArchiveEnvConfig] local provider missing root path', {
        provider,
      })
      return { provider: INTEGRITY_ARCHIVE_PROVIDER.NONE, enabled: false, keyPrefix }
    }
    return {
      provider,
      enabled: true,
      keyPrefix,
      localRootPath,
    }
  }

  if (provider === INTEGRITY_ARCHIVE_PROVIDER.MONGO) {
    const mongoUri = (env.INTEGRITY_ARCHIVE_MONGODB_URI || '').trim()
    if (!mongoUri) {
      console.warn('[resolveIntegrityArchiveEnvConfig] mongo provider missing URI', {
        provider,
      })
      return { provider: INTEGRITY_ARCHIVE_PROVIDER.NONE, enabled: false, keyPrefix }
    }
    return {
      provider,
      enabled: true,
      keyPrefix,
      mongoUri,
    }
  }

  if (provider === INTEGRITY_ARCHIVE_PROVIDER.VERCEL_BLOB) {
    const vercelBlobToken = (
      env.INTEGRITY_ARCHIVE_VERCEL_BLOB_TOKEN ||
      env.BLOB_READ_WRITE_TOKEN ||
      ''
    ).trim()
    if (!vercelBlobToken) {
      console.warn('[resolveIntegrityArchiveEnvConfig] vercel_blob missing token', {
        provider,
      })
      return { provider: INTEGRITY_ARCHIVE_PROVIDER.NONE, enabled: false, keyPrefix }
    }
    return {
      provider,
      enabled: true,
      keyPrefix,
      vercelBlobToken,
    }
  }

  if (!isIntegrityArchiveCloudProvider(provider)) {
    return { provider: INTEGRITY_ARCHIVE_PROVIDER.NONE, enabled: false, keyPrefix }
  }

  const bucket = (env.INTEGRITY_ARCHIVE_BUCKET || '').trim()
  const accessKeyId = (env.INTEGRITY_ARCHIVE_ACCESS_KEY_ID || '').trim()
  const secretAccessKey = (env.INTEGRITY_ARCHIVE_SECRET_ACCESS_KEY || '').trim()
  const endpoint = defaultEndpointForProvider(provider, env.INTEGRITY_ARCHIVE_ENDPOINT)
  const region = defaultRegionForProvider(provider, env.INTEGRITY_ARCHIVE_REGION)

  if (!bucket || !accessKeyId || !secretAccessKey) {
    console.warn('[resolveIntegrityArchiveEnvConfig] archive provider set but credentials incomplete', {
      provider,
      hasBucket: Boolean(bucket),
      hasAccessKey: Boolean(accessKeyId),
      hasSecret: Boolean(secretAccessKey),
    })
    return { provider: INTEGRITY_ARCHIVE_PROVIDER.NONE, enabled: false, keyPrefix }
  }

  if (provider === INTEGRITY_ARCHIVE_PROVIDER.R2 && !endpoint) {
    console.warn('[resolveIntegrityArchiveEnvConfig] R2 requires INTEGRITY_ARCHIVE_ENDPOINT', {
      provider,
    })
    return { provider: INTEGRITY_ARCHIVE_PROVIDER.NONE, enabled: false, keyPrefix }
  }

  const forcePathStyle =
    env.INTEGRITY_ARCHIVE_FORCE_PATH_STYLE === 'true' ||
    provider === INTEGRITY_ARCHIVE_PROVIDER.R2

  return {
    provider,
    enabled: true,
    keyPrefix,
    s3: {
      bucket,
      region,
      accessKeyId,
      secretAccessKey,
      endpoint,
      forcePathStyle,
    },
  }
}
