import { AppSettingService } from '../../../services/settings/AppSettingService'
import { requireSuperadmin } from '../../../utils/requireSuperadmin'
import { withErrorHandler } from '../../../utils/errorHandler'
import {
  PUBLIC_CAROUSEL_INTERVAL_DEFAULT_SECONDS,
  PUBLIC_CAROUSEL_INTERVAL_MAX_SECONDS,
  PUBLIC_CAROUSEL_INTERVAL_MIN_SECONDS,
} from '../../../../app/constants/public/carouselSettings'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    await requireSuperadmin(event)
    const intervalSeconds = await new AppSettingService().getPublicCarouselIntervalSeconds()
    return {
      success: true,
      carousel: {
        intervalSeconds,
        defaultSeconds: PUBLIC_CAROUSEL_INTERVAL_DEFAULT_SECONDS,
        minSeconds: PUBLIC_CAROUSEL_INTERVAL_MIN_SECONDS,
        maxSeconds: PUBLIC_CAROUSEL_INTERVAL_MAX_SECONDS,
      },
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to load carousel settings',
  })
})
