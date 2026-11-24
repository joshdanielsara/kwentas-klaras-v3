import { AppSettingService } from '../../../services/settings/AppSettingService'
import { requireSuperadmin } from '../../../utils/requireSuperadmin'
import { withErrorHandler } from '../../../utils/errorHandler'
import { INTEGRITY_ARCHIVE_PROVIDER_OPTIONS } from '../../../../app/constants/audit/integrityArchiveSettings'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    await requireSuperadmin(event)

    const archive = await new AppSettingService().getPublicIntegrityArchiveSettings()

    return {
      success: true,
      archive,
      providers: INTEGRITY_ARCHIVE_PROVIDER_OPTIONS,
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to load integrity archive settings',
  })
})
