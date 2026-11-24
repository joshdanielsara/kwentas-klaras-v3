import { APP_SETTING_KEY } from '../../../app/constants/public/carouselSettings'
import {
  APP_SETTING_KEY_INTEGRITY_ARCHIVE,
  INTEGRITY_ARCHIVE_SETTINGS_DEFAULT,
  type IntegrityArchiveSettings,
} from '../../../app/constants/audit/integrityArchiveSettings'
import { AppSettingRepository } from '../../repositories/settings/AppSettingRepository'
import { normalizeCarouselIntervalSeconds } from '../../utils/settings/normalizeCarouselIntervalSeconds'
import {
  mergeIntegrityArchiveSettings,
  parseIntegrityArchiveSettingsJson,
  toPublicIntegrityArchiveSettings,
} from '../../utils/settings/normalizeIntegrityArchiveSettings'

export class AppSettingService {
  private repo: AppSettingRepository

  constructor(repo?: AppSettingRepository) {
    this.repo = repo || new AppSettingRepository()
  }

  async getPublicCarouselIntervalSeconds(): Promise<number> {
    const setting = await this.repo.findByKey(APP_SETTING_KEY.PUBLIC_CAROUSEL_INTERVAL_SECONDS)
    return normalizeCarouselIntervalSeconds(setting?.value)
  }

  async setPublicCarouselIntervalSeconds(raw: unknown): Promise<number> {
    const seconds = normalizeCarouselIntervalSeconds(raw)
    await this.repo.upsertByKey(
      APP_SETTING_KEY.PUBLIC_CAROUSEL_INTERVAL_SECONDS,
      String(seconds)
    )
    return seconds
  }

  async getIntegrityArchiveSettings(): Promise<IntegrityArchiveSettings> {
    const setting = await this.repo.findByKey(APP_SETTING_KEY_INTEGRITY_ARCHIVE)
    if (!setting?.value) {
      return { ...INTEGRITY_ARCHIVE_SETTINGS_DEFAULT }
    }
    return parseIntegrityArchiveSettingsJson(setting.value)
  }

  async getPublicIntegrityArchiveSettings() {
    const settings = await this.getIntegrityArchiveSettings()
    return toPublicIntegrityArchiveSettings(settings)
  }

  async setIntegrityArchiveSettings(raw: unknown): Promise<
    IntegrityArchiveSettings & { secretConfigured: boolean }
  > {
    const existing = await this.getIntegrityArchiveSettings()
    const merged = mergeIntegrityArchiveSettings(existing, raw)
    await this.repo.upsertByKey(
      APP_SETTING_KEY_INTEGRITY_ARCHIVE,
      JSON.stringify(merged)
    )
    return toPublicIntegrityArchiveSettings(merged)
  }
}
