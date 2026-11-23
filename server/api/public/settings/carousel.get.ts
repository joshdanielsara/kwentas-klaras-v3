import { AppSettingService } from '../../../services/settings/AppSettingService'
import { withErrorHandler } from '../../../utils/errorHandler'

export default defineEventHandler(async () => {
  return await withErrorHandler(async () => {
    const intervalSeconds = await new AppSettingService().getPublicCarouselIntervalSeconds()
    return {
      success: true,
      carousel: {
        intervalSeconds,
      },
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to load carousel settings',
  })
})
