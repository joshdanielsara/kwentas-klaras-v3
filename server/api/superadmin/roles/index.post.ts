import { RoleService } from '../../../services/rbac/RoleService'
import { requireSuperadmin } from '../../../utils/requireSuperadmin'
import { withErrorHandler } from '../../../utils/errorHandler'
import { requireCSRF } from '../../../utils/csrfMiddleware'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    await requireSuperadmin(event)
    await requireCSRF(event)
    const body = await readBody(event)
    const role = await new RoleService().create({
      slug: body.slug,
      name: body.name,
      description: body.description,
      permissionIds: body.permissionIds,
    })
    return { success: true, role }
  })
})
