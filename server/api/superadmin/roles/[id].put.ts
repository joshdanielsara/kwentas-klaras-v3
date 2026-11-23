import { RoleService } from '../../../services/rbac/RoleService'
import { requireSuperadmin } from '../../../utils/requireSuperadmin'
import { withErrorHandler } from '../../../utils/errorHandler'
import { requireCSRF } from '../../../utils/csrfMiddleware'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    await requireSuperadmin(event)
    await requireCSRF(event)
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({ statusCode: 400, message: 'Role id is required' })
    }
    const body = await readBody(event)
    const role = await new RoleService().update(id, {
      name: body.name,
      description: body.description,
      permissionIds: body.permissionIds,
    })
    return { success: true, role }
  })
})
