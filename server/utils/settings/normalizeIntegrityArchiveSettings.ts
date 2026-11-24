import {
  INTEGRITY_ARCHIVE_SETTINGS_DEFAULT,
  INTEGRITY_ARCHIVE_SECRET_MASK,
  type IntegrityArchiveSettings,
} from '../../../app/constants/audit/integrityArchiveSettings'
import {
  INTEGRITY_ARCHIVE_KEY_PREFIX_DEFAULT,
  INTEGRITY_ARCHIVE_LOCAL_ROOT_DEFAULT,
  INTEGRITY_ARCHIVE_PROVIDER,
  INTEGRITY_ARCHIVE_PROVIDERS,
  isIntegrityArchiveCloudProvider,
  type IntegrityArchiveProvider,
} from '../../../app/constants/audit/integrityArchiveProviders'

const asString = (value: unknown): string => {
  if (typeof value === 'string') {
    return value.trim()
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value).trim()
  }
  return ''
}

const normalizeProvider = (raw: unknown): IntegrityArchiveProvider => {
  const value = asString(raw).toLowerCase()
  if (INTEGRITY_ARCHIVE_PROVIDERS.includes(value as IntegrityArchiveProvider)) {
    return value as IntegrityArchiveProvider
  }
  return INTEGRITY_ARCHIVE_PROVIDER.NONE
}

const normalizePrefix = (raw: unknown): string => {
  const prefix = asString(raw) || INTEGRITY_ARCHIVE_KEY_PREFIX_DEFAULT
  return prefix.endsWith('/') ? prefix : `${prefix}/`
}

const keepMaskedSecret = (incoming: string, existing: string): string => {
  if (!incoming || incoming === INTEGRITY_ARCHIVE_SECRET_MASK) {
    return existing
  }
  return incoming
}

/** Normalize Superadmin / API body into archive settings (keeps secrets as provided). */
export const normalizeIntegrityArchiveSettings = (
  raw: unknown
): IntegrityArchiveSettings => {
  const source =
    raw && typeof raw === 'object' && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {}

  const provider = normalizeProvider(source.provider)
  const forcePathStyle =
    source.forcePathStyle === true ||
    source.forcePathStyle === 'true' ||
    (provider === INTEGRITY_ARCHIVE_PROVIDER.R2 && source.forcePathStyle !== false)

  return {
    provider,
    localRootPath:
      asString(source.localRootPath) || INTEGRITY_ARCHIVE_LOCAL_ROOT_DEFAULT,
    mongoUri: asString(source.mongoUri),
    vercelBlobToken: asString(source.vercelBlobToken),
    bucket: asString(source.bucket),
    accessKeyId: asString(source.accessKeyId),
    secretAccessKey: asString(source.secretAccessKey),
    endpoint: asString(source.endpoint),
    region: asString(source.region),
    keyPrefix: normalizePrefix(source.keyPrefix),
    forcePathStyle:
      provider === INTEGRITY_ARCHIVE_PROVIDER.R2 ? true : Boolean(forcePathStyle),
  }
}

export const parseIntegrityArchiveSettingsJson = (
  raw?: string | null
): IntegrityArchiveSettings => {
  if (!raw) {
    return { ...INTEGRITY_ARCHIVE_SETTINGS_DEFAULT }
  }
  try {
    return normalizeIntegrityArchiveSettings(JSON.parse(raw))
  } catch {
    return { ...INTEGRITY_ARCHIVE_SETTINGS_DEFAULT }
  }
}

export type PublicIntegrityArchiveSettings = IntegrityArchiveSettings & {
  secretConfigured: boolean
  mongoUriConfigured: boolean
  vercelBlobTokenConfigured: boolean
  /** Env fallback available when App Setting URI/token is empty. */
  mongoUriEnvConfigured: boolean
  vercelBlobTokenEnvConfigured: boolean
}

/** Public Superadmin GET shape — never returns real secrets. */
export const toPublicIntegrityArchiveSettings = (
  settings: IntegrityArchiveSettings,
  env: NodeJS.ProcessEnv = process.env
): PublicIntegrityArchiveSettings => {
  const secretConfigured = Boolean(settings.secretAccessKey)
  const mongoUriConfigured = Boolean(settings.mongoUri)
  const vercelBlobTokenConfigured = Boolean(settings.vercelBlobToken)

  return {
    ...settings,
    secretAccessKey: secretConfigured ? INTEGRITY_ARCHIVE_SECRET_MASK : '',
    mongoUri: mongoUriConfigured ? INTEGRITY_ARCHIVE_SECRET_MASK : '',
    vercelBlobToken: vercelBlobTokenConfigured ? INTEGRITY_ARCHIVE_SECRET_MASK : '',
    secretConfigured,
    mongoUriConfigured,
    vercelBlobTokenConfigured,
    mongoUriEnvConfigured: Boolean((env.INTEGRITY_ARCHIVE_MONGODB_URI || '').trim()),
    vercelBlobTokenEnvConfigured: Boolean(
      (env.INTEGRITY_ARCHIVE_VERCEL_BLOB_TOKEN || env.BLOB_READ_WRITE_TOKEN || '').trim()
    ),
  }
}

/**
 * Merge PUT body with existing settings.
 * Empty or masked secrets keep previously stored values.
 */
export const mergeIntegrityArchiveSettings = (
  existing: IntegrityArchiveSettings,
  incomingRaw: unknown
): IntegrityArchiveSettings => {
  const incoming = normalizeIntegrityArchiveSettings(incomingRaw)

  return {
    ...incoming,
    secretAccessKey: keepMaskedSecret(incoming.secretAccessKey, existing.secretAccessKey),
    mongoUri: keepMaskedSecret(incoming.mongoUri, existing.mongoUri),
    vercelBlobToken: keepMaskedSecret(incoming.vercelBlobToken, existing.vercelBlobToken),
  }
}

export const resolveMongoArchiveUri = (
  settings: IntegrityArchiveSettings,
  env: NodeJS.ProcessEnv = process.env
): string => {
  return settings.mongoUri || (env.INTEGRITY_ARCHIVE_MONGODB_URI || '').trim()
}

export const resolveVercelBlobToken = (
  settings: IntegrityArchiveSettings,
  env: NodeJS.ProcessEnv = process.env
): string => {
  return (
    settings.vercelBlobToken ||
    (env.INTEGRITY_ARCHIVE_VERCEL_BLOB_TOKEN || '').trim() ||
    (env.BLOB_READ_WRITE_TOKEN || '').trim()
  )
}

export const integrityArchiveSettingsAreComplete = (
  settings: IntegrityArchiveSettings,
  env: NodeJS.ProcessEnv = process.env
): boolean => {
  if (settings.provider === INTEGRITY_ARCHIVE_PROVIDER.NONE) {
    return false
  }

  if (settings.provider === INTEGRITY_ARCHIVE_PROVIDER.LOCAL) {
    return Boolean(settings.localRootPath)
  }

  if (settings.provider === INTEGRITY_ARCHIVE_PROVIDER.MONGO) {
    return Boolean(resolveMongoArchiveUri(settings, env))
  }

  if (settings.provider === INTEGRITY_ARCHIVE_PROVIDER.VERCEL_BLOB) {
    return Boolean(resolveVercelBlobToken(settings, env))
  }

  if (!isIntegrityArchiveCloudProvider(settings.provider)) {
    return false
  }

  if (!settings.bucket || !settings.accessKeyId || !settings.secretAccessKey) {
    return false
  }
  if (settings.provider === INTEGRITY_ARCHIVE_PROVIDER.R2 && !settings.endpoint) {
    return false
  }
  return true
}
