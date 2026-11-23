import { APP_SETTING_KEY } from '../../../app/constants/public/carouselSettings'
import { AppSettingRepository } from '../../repositories/settings/AppSettingRepository'
import { normalizeCarouselIntervalSeconds } from '../../utils/settings/normalizeCarouselIntervalSeconds'

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
}
