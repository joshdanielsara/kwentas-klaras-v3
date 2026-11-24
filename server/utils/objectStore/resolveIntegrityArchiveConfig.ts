import { AppSettingService } from '../../services/settings/AppSettingService'
import {
  resolveIntegrityArchiveEnvConfig,
  type IntegrityArchiveEnvConfig,
} from './resolveObjectStoreConfig'
import { settingsToArchiveConfig } from './settingsToArchiveConfig'

/**
 * Prefer Superadmin-saved AppSetting config; fall back to env vars.
 */
export const resolveIntegrityArchiveConfig = async (
  settingService: AppSettingService = new AppSettingService()
): Promise<IntegrityArchiveEnvConfig> => {
  try {
    const fromDb = await settingService.getIntegrityArchiveSettings()
    const dbConfig = settingsToArchiveConfig(fromDb)
    if (dbConfig.enabled) {
      return dbConfig
    }
  } catch (error: unknown) {
    console.warn('[resolveIntegrityArchiveConfig] failed to load AppSetting; using env', {
      error: error instanceof Error ? error.message : 'unknown',
    })
  }

  return resolveIntegrityArchiveEnvConfig()
}
