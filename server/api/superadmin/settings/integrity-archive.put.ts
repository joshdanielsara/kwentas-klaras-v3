import { AppSettingService } from '../../../services/settings/AppSettingService'
import { requireSuperadmin } from '../../../utils/requireSuperadmin'
import { requireCSRF } from '../../../utils/csrfMiddleware'
import { withErrorHandler } from '../../../utils/errorHandler'
import { INTEGRITY_ARCHIVE_PROVIDER_OPTIONS } from '../../../../app/constants/audit/integrityArchiveSettings'
import { INTEGRITY_ARCHIVE_PROVIDER } from '../../../../app/constants/audit/integrityArchiveProviders'
import { integrityArchiveIncompleteMessage } from '../../../../app/constants/audit/integrityArchiveMessages'
import {
  integrityArchiveSettingsAreComplete,
  mergeIntegrityArchiveSettings,
} from '../../../utils/settings/normalizeIntegrityArchiveSettings'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    await requireSuperadmin(event)
    await requireCSRF(event)

    const body = await readBody(event)
    const service = new AppSettingService()
    const existing = await service.getIntegrityArchiveSettings()
    const merged = mergeIntegrityArchiveSettings(existing, body?.archive ?? body)

    if (
      merged.provider !== INTEGRITY_ARCHIVE_PROVIDER.NONE &&
      !integrityArchiveSettingsAreComplete(merged)
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: integrityArchiveIncompleteMessage(merged.provider),
      })
    }

    const archive = await service.setIntegrityArchiveSettings(merged)

    return {
      success: true,
      archive,
      providers: INTEGRITY_ARCHIVE_PROVIDER_OPTIONS,
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to save integrity archive settings',
  })
})
