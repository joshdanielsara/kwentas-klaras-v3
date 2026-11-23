import { AppSettingService } from '../../../services/settings/AppSettingService'
import { requireSuperadmin } from '../../../utils/requireSuperadmin'
import { requireCSRF } from '../../../utils/csrfMiddleware'
import { withErrorHandler } from '../../../utils/errorHandler'
import {
  PUBLIC_CAROUSEL_INTERVAL_MAX_SECONDS,
  PUBLIC_CAROUSEL_INTERVAL_MIN_SECONDS,
} from '../../../../app/constants/public/carouselSettings'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    await requireSuperadmin(event)
    await requireCSRF(event)

    const body = await readBody(event)
    const intervalSeconds = await new AppSettingService().setPublicCarouselIntervalSeconds(
      body?.intervalSeconds
    )

    return {
      success: true,
      carousel: {
        intervalSeconds,
        minSeconds: PUBLIC_CAROUSEL_INTERVAL_MIN_SECONDS,
        maxSeconds: PUBLIC_CAROUSEL_INTERVAL_MAX_SECONDS,
      },
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to save carousel settings',
  })
})
