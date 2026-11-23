import { requireSuperadmin } from '../../../utils/requireSuperadmin'
import { withErrorHandler } from '../../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    const superadmin = await requireSuperadmin(event)
    return {
      success: true,
      superadmin,
    }
  }, {
    defaultStatusCode: 401,
    defaultMessage: 'Superadmin authentication required',
  })
})
