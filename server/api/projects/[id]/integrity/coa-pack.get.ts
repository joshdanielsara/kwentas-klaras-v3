import { CoaIntegrityPackService } from '../../../../services/audit/CoaIntegrityPackService'
import { requirePermission } from '../../../../utils/requirePermission'
import { withErrorHandler } from '../../../../utils/errorHandler'
import { COA_INTEGRITY_PACK_CONTENT_TYPE } from '../../../../../app/constants/audit/coaIntegrityPack'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    await requirePermission(event, 'read', 'ProjectIntegrity')
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'Project id is required' })
    }

    const pack = await new CoaIntegrityPackService().buildProjectPack(id)
    if (pack.batchCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No sealed integrity batches found for this project',
      })
    }

    setHeader(event, 'Content-Type', COA_INTEGRITY_PACK_CONTENT_TYPE)
    setHeader(
      event,
      'Content-Disposition',
      `attachment; filename="${pack.filename}"`
    )
    return pack.buffer
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to build COA integrity pack',
  })
})
