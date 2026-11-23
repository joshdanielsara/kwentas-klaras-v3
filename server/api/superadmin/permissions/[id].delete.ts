import { PermissionService } from '../../../services/rbac/PermissionService'
import { requireSuperadmin } from '../../../utils/requireSuperadmin'
import { withErrorHandler } from '../../../utils/errorHandler'
import { requireCSRF } from '../../../utils/csrfMiddleware'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    await requireSuperadmin(event)
    await requireCSRF(event)
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({ statusCode: 400, message: 'Permission id is required' })
    }
    await new PermissionService().delete(id)
    return { success: true }
  })
})
