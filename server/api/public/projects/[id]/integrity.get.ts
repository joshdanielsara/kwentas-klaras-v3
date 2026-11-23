import { AuditIntegrityService } from '../../../../services/audit/AuditIntegrityService'
import { withErrorHandler } from '../../../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Project ID is required',
      })
    }

    const query = getQuery(event)
    const runVerify = query.verify === '1' || query.verify === 'true'

    const integrity = await new AuditIntegrityService().getProjectIntegrity(id, runVerify)

    return {
      success: true,
      integrity,
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to load project integrity',
  })
})
